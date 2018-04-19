const { riderModel, driverModel, tripModel } = require('../models');
const { getRating, calculateRate, computeMileage, distanceMatrixRequest, newDirectionRequest, buildSteps, simulateTrip } = require('../utils/tools');
const auth = require('basic-auth');

exports = module.exports = {};

// NOTE: these methods currently return JSON (for debugging), 
// but, for idempotency, may get switched to 200 OK later on

exports.riderID = async (req, res, next, riderID) => {
  try {
    const riderDoc = await riderModel.findById(riderID);
    req.rider = riderDoc;  
    if (!riderDoc) throw 'Error: rider not found.'
  } catch (e) {
    req.rider = null;
    console.error(e.message || e);
  }
  return next();
}

exports.getRiderByID = (req, res) => { 
  if (req.rider) 
    res.send(req.rider);
  else 
    res.sendStatus(404);
}

exports.getAllRiders = async (req, res) => {
  try {
    const riderDocs = await riderModel.find();
    res.send(riderDocs);
  } catch (e) {
    res.sendStatus(400); // should be different error code?
  }
}

exports.getPotentialDrivers = async (req, res) => {
  try {
    let driverDocs = await driverModel.find({ available : true });
    const maxDistance = req.query.maxDistance || 15;
    if (!req.rider.location.latitude || !req.rider.location.longitude)
      throw 'Error: Rider does not have location set.';
    if (req.query.minCapacity) {
      driverDocs = driverDocs.filter(driver => driver.capacity >= req.query.minCapacity);
    }
    const distanceData = await distanceMatrixRequest(
      driverDocs.filter(driver => driver.location.latitude && driver.location.longitude).map(driver => driver.location), 
      req.rider.location
    );
    const newDriverDocs = driverDocs.filter(driver => driver.location.latitude && driver.location.longitude)
      .map((driver, index) => {
        return {
          ...JSON.parse(JSON.stringify(driver)), 
          distance : String(distanceData.rows[index].elements[0].distance.text),
          timeToPickup : String(distanceData.rows[index].elements[0].duration.text)
        };
    });
    driverDocs = newDriverDocs.filter(driver => parseFloat(computeMileage(driver.distance)) <= maxDistance);
    res.send(driverDocs);
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(400); // should be different error code?
  }
}

exports.getTripEstimate = async (req, res) => {
  try {
    if (!req.query.lat || !req.query.lon)
      throw 'Error: Destination not set.';
    else if (!req.rider.location.latitude || !req.rider.location.longitude)
      throw 'Error: Rider does not have location set.';
    const dest = {
      latitude: req.query.lat,
      longitude: req.query.lon
    };
    const tripData = await distanceMatrixRequest(req.rider.location, dest);
    const currentRate = calculateRate(new Date(Date.now()).getHours());
    const mileage = computeMileage(tripData.rows[0].elements[0].distance.text);
    const tripCost = `$${(currentRate * mileage).toFixed(2)}`;
    const tripEstimate = {
      pickup: tripData.origin_addresses[0],
      dropoff: tripData.destination_addresses[0],
      distance: tripData.rows[0].elements[0].distance.text,
      travelTime: tripData.rows[0].elements[0].duration.text,
      cost: tripCost
    };
    res.send(tripEstimate);
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(400); // should be different error code?
  }
}

exports.getRiderRating = (req, res) => { 
  if (req.rider) 
    res.json(getRating(req.rider));
  else 
    res.sendStatus(404);
  console.log(req.rider.reviews);
}

exports.setRiderLocation = async (req, res) => {
  try {
    if (!req.body.latitude || !req.body.longitude)
      throw 'Error: Incomplete location.';
    const updatedRider = await riderModel.findByIdAndUpdate(
      req.rider._id, 
      { $set: { location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude 
      } } }, { new: true }
    );
    res.send(updatedRider); // should probably just return 200 status for 'idempotency'
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(400);
  }
}

exports.rateDriver = async (req, res) => {
  try {
    if (!req.rider)
      throw 'Error: Invalid riderID.';
    const validTrip = await tripModel.findById(req.body.tripID);
    if (!validTrip)
      throw 'Error: Invalid trip.';
    else if (!validTrip.isComplete)
      throw 'Error: Trip incomplete.';
    const existingRating = await driverModel.findOne({"reviews.tripID" : req.body.tripID});
    if (existingRating)
      throw 'Error: Rating already submitted for this trip.';
    const updatedDriver = await driverModel.findByIdAndUpdate(
      req.body.driverID, 
      { $push: { 
          reviews: {
            tripID: req.body.tripID,
            score: parseFloat(req.body.score).toFixed(2)
          } 
        } 
      }, 
      { new: true }
    );
    res.send(updatedDriver);
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(400);
  }
}

exports.requestPickup = async (req, res) => {
  try {
    const requestedDriver = await driverModel.findById(req.body.driverID);
    if (!req.rider.location.latitude || !req.rider.location.longitude)
      throw 'Error: Current location not set.';
    else if (!req.body.dropoff.latitude || !req.body.dropoff.longitude)
      throw 'Error: Destination coordinates incomplete.'
    else if (!requestedDriver.available) 
      throw 'Error: Selected driver is unavailable.';
    
    // testing out a different API to get all the trip data at once w/ directions
    const dirData = await newDirectionRequest(
      requestedDriver.location, req.rider.location, req.body.dropoff
    );
    const currentRate = calculateRate(new Date(Date.now()).getHours());
    const mileage = computeMileage(dirData.routes[0].legs[1].distance.text);
    const tripRequest = new tripModel({
      riderID: req.rider._id,
      driverID: requestedDriver._id,
      isComplete: false,
      rate: currentRate,
      cost: `$${(currentRate * mileage).toFixed(2)}`,
      driverLoc: {
        address: dirData.routes[0].legs[0].start_address,
        latitude: requestedDriver.location.latitude,
        longitude: requestedDriver.location.longitude
      },
      pickup: {
        address: dirData.routes[0].legs[0].end_address,
        latitude: req.rider.location.latitude,
        longitude: req.rider.location.longitude
      },
      dropoff: {
        address: dirData.routes[0].legs[1].end_address,
        latitude: req.body.dropoff.latitude,
        longitude: req.body.dropoff.longitude
      },
      distance: dirData.routes[0].legs[1].distance.text,
      travelTime: dirData.routes[0].legs[1].duration.text,
      timeToPickup: dirData.routes[0].legs[0].duration.text,
      directions: {
        toPickup: buildSteps(dirData.routes[0].legs[0].steps),
        toDropoff: buildSteps(dirData.routes[0].legs[1].steps)
      }
    });
    const tripDoc = await tripRequest.save();
    const updatedDriver = await driverModel.findByIdAndUpdate(
      req.body.driverID,
      { $set: {
        available: false,
        currentTrip: tripDoc._id
      } }, 
      { new: true }
    );
    simulateTrip(tripDoc);
    res.send(tripDoc);
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(400);
  }
}

exports.addRider = async (req, res) => {
  if (req.body.name) { // refactor these conditional style checks to use 'throw' instead
    try {
      const newRider = new riderModel({
        name: req.body.name,
        location: {
          latitude: null,
          longitude: null 
        },
        reviews: []
      });
      const newDoc = await newRider.save();
      console.log('saved new Rider "%s" to db. id: %s', newDoc.name, newDoc._id);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  } 
}

/* ADMIN AUTH REQUIRED */

exports.removeRider = async (req, res) => {
  const credentials = auth(req);
  if (credentials && credentials.name == 'admin' && credentials.pass == 'password') {
    try {
      const rider = await riderModel.remove({ _id : req.rider._id });
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(401);
  }
}