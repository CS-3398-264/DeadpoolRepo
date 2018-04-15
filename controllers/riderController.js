const { riderModel, driverModel } = require('../models');
const { getRating, getContent } = require('../utils/tools');
const auth = require('basic-auth');

exports = module.exports = {};

// NOTE: these methods currently return JSON (for debugging), 
// but, for idempotency, may get switched to 200 OK later on

exports.riderID = async (req, res, next, riderID) => {
  try {
    const riderDoc = await riderModel.findOne({ _id : riderID });
    req.rider = riderDoc;  
  } catch (e) {
    req.rider = null;
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
    // calculate disatnce here so we can filter it
    const baseURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=';
    const key = `&key=${process.env.GOOGLE_KEY}`;
    const destinations = `&destinations=${req.rider.location.latitude},${req.rider.location.longitude}`;
    const origins = driverDocs.filter(driver => driver.location.latitude && driver.location.longitude).map(driver => String(driver.location.latitude) + ',' + String(driver.location.longitude)).join('|');
    const requestString = baseURL + origins + destinations + key;
    const distanceData = await getContent(requestString);
    const newDriverDocs = driverDocs.filter(driver => driver.location.latitude && driver.location.longitude).map((driver, index) => {
      return {
        ...JSON.parse(JSON.stringify(driver)), 
        distance : String(JSON.parse(distanceData).rows[index].elements[0].distance.text)
      };
    });
    driverDocs = newDriverDocs.filter(driver => 
      parseFloat(driver.distance.split(' ')[0]) <= maxDistance);
    res.send(driverDocs);
  } catch (e) {
    console.error(e);
    res.sendStatus(400); // should be different error code?
  }
}

exports.setRiderLocation = async (req, res) => {
  try {
    if (!req.body.latitude || !req.body.longitude)
      throw 'Error: Incomplete parameters.';
    const updatedRider = await riderModel.findByIdAndUpdate(
      req.rider._id, 
      { $set: { location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude 
      } } }, { new: true });
    res.send(updatedRider); // should probably just return 200 status for 'idempotency'
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
}

exports.getRiderRating = (req, res) => { 
  if (req.rider) 
    res.json(getRating(req.rider));
  else 
    res.sendStatus(404);
}

exports.addRider = async (req, res) => {
  if (req.body.name) {
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

exports.rateDriver = async (req, res) => {
  if (req.rider) {
    try {
      const updatedDriver = await driverModel.findByIdAndUpdate(
        req.body.driverID, 
        { $push: { reviews: req.body.rating } }, 
        { new: true });
      res.send(updatedDriver);
    } catch (e) {
      res.sendStatus(400);
    }
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