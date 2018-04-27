const { driverModel, riderModel, tripModel } = require('../models');
const { getRating } = require('../utils/tools');
const auth = require('basic-auth');

exports = module.exports = {};

// NOTE: these methods currently return JSON (for debugging),
// but, for idempotency, may get switched to 200 OK later on

exports.driverID = async (req, res, next, driverID) => {
  try {
    const driverDoc = await driverModel.findOne({ _id : driverID });
    req.driver = driverDoc;
  } catch (e) {
    req.driver = null;
  }
  return next();
}

exports.getDriverByID = (req, res) => {
  if (req.driver)
    res.send(req.driver);
  else
    res.sendStatus(404);
}

exports.getAllDrivers = async (req, res) => {
  try {
    let driverDocs = await driverModel.find();
    if (req.query.available) {
      driverDocs = driverDocs.filter(driver => driver.available == JSON.parse(req.query.available));
    }
    if (req.query.minCapacity) {
      driverDocs = driverDocs.filter(driver => driver.capacity >= req.query.minCapacity);
    }
    res.send(driverDocs);
  } catch (e) {
    res.sendStatus(404);
  }
}

exports.getDriverRating = (req, res) => {
  if (req.driver)
    res.json(getRating(req.driver));
  else
    res.sendStatus(404);
}

/* PUT THE CURRENT DIRECTIONS FUNCTION HERE */
exports.getCurrentDirections = async (req, res) => {
  try {
    if (req.driver.currentTrip && req.driver.currentTrip !== 'none') {
      const currentTrip = await tripModel.findOne({ _id : req.driver.currentTrip });
      const directions = {
        tripID: currentTrip._id,
        directions: {
          toPickup: currentTrip.directions.toPickup,
          toDropoff: currentTrip.directions.toDropoff
        }
      }
      res.send(directions)
    } else {
      throw Error('driver not currently assigned to a trip')
    }
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(404);
  }
}

exports.setAvailability = async (req, res) => {
  try {
    const updatedDriver = await driverModel.findByIdAndUpdate(
      req.driver._id,
      { $set: { available: req.body.available } },
      { new: true }
    );
    res.send(updatedDriver); // should probably just return 200 status for 'idempotency'
  } catch (e) {
    res.sendStatus(404); // Driver not found
  }
}

exports.setDriverLocation = async (req, res) => {
  try {
    if (!req.body.latitude || !req.body.longitude)
      throw 'Error: Incomplete parameters.';
    const updatedDriver = await driverModel.findByIdAndUpdate(
      req.driver._id,
      { $set: { location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
      } } }, { new: true }
    );
    res.send(updatedDriver);
  } catch (e) {
    if(e.message === 'Error: Incomplete parameters.') {
      console.error(e.message || e);
      res.sendStatus(422); // Bad request, missing location.
    } else {
      console.error(e.message || e);
      res.sendStatus(500); // Other error, server related.
    }
  }
}

exports.rateRider = async (req, res) => {
  try {
    if (!req.driver)
      throw 'Error: Invalid driverID.';
    const validTrip = await tripModel.findById(req.body.tripID);
    if (!validTrip)
      throw 'Error: Invalid trip.';
    else if (!validTrip.isComplete)
      throw 'Error: Trip incomplete.';
    const existingRating = await riderModel.findOne({"reviews.tripID" : req.body.tripID});
    if (existingRating)
      throw 'Error: Rating already submitted for this trip.';
    const updatedRider = await riderModel.findByIdAndUpdate(
      req.body.riderID,
      { $push: { reviews: parseFloat(req.body.rating).toFixed(2) } },
      { new: true });
    res.send(updatedRider); // should probably just return 200 for 'idempotency'
  } catch (e) {
    if(e.message === 'Error: Missing driver.') {
      console.error(e.message || e);
      res.sendStatus(422); // Bad request, missing location.
    } else {
      console.error(e.message || e);
      res.sendStatus(500); // Other error, server related.
    }
  }

}

/* ADMIN AUTH REQUIRED */

exports.addDriver = async (req, res) => {
  const credentials = auth(req);
    try {
      if (!credentials)
        throw 'Error: Missing Credentials.';
      else if (credentials.name !== 'admin' || credentials.pass !== 'password')
        throw 'Error: Invalid Credentials.';
      else if (!req.body.name || !req.body.vehicle || !req.body.capacity)
        throw 'Error: Missing Parameters.';
      const newDriver = new driverModel({
        name: req.body.name,
        vehicle: req.body.vehicle,
        capacity: req.body.capacity,
        available: false,
        location: {
          latitude: null,
          longitude: null
        },
        reviews: [],
        currentTrip: 'none'
      });
      const newDoc = await newDriver.save();
      console.log('saved new driver "%s" to db. id: %s', newDoc.name, newDoc._id);
      res.send(newDoc);
    } catch(e) {
      if(e.message === 'Error: Missing Credentials.') {
        console.error(e.message || e);
        res.sendStatus(422); // Bad request, missing credentials.
      } else if (e.message === 'Invalid Credentials.') {
        console.error(e.message || e);
        res.sendStatus(401); // Unauthorized user.
      } else if (e.message === 'Missing Parameters.') {
        console.error(e.message || e);
        res.sendStatus(422); // Bad request, missing parameters.
      } else {
        console.error(e.message || e);
        res.sendStatus(500); // Other error, server related.
      }
    }
}

exports.removeDriver = async (req, res) => {
    const credentials = auth(req);
    try {
      if (!credentials)
        throw 'Error: Missing Credentials.';
      else if (credentials.name !== 'admin' || credentials.pass !== 'password')
        throw 'Error: Invalid Credentials.';
      const driver = await driverModel.remove({_id: req.driver._id});
      res.sendStatus(200);
    } catch (e) {
      if (e.message === 'Error: Missing Credentials.') {
        console.error(e.message || e);
        res.sendStatus(422); // Bad request, missing credentials.
      } else if (e.message === 'Invalid Credentials.') {
        console.error(e.message || e);
        res.sendStatus(401); // Unauthorized user.
      } else {
        console.error(e.message || e);
        res.sendStatus(500); // Other error, server related.
      }
    }
}