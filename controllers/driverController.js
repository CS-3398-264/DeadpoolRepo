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
    res.sendStatus(400); // should be different error code?
  }
}

exports.getDriverRating = (req, res) => { 
  if (req.driver) 
    res.json(getRating(req.driver));
  else 
    res.sendStatus(404);
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
    res.sendStatus(400);
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
    res.send(updatedDriver); // should probably just return 200 status for 'idempotency'
  } catch (e) {
    console.error(e.messge || e);
    res.sendStatus(400);
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
      { $push: { 
          reviews: {
            tripID: req.body.tripID,
            score: parseFloat(req.body.score).toFixed(2)
          } 
        } 
      }, 
      { new: true }
    );
    res.send(updatedRider);
  } catch (e) {
    console.error(e.message || e);
    res.sendStatus(400);
  }

}

/* ADMIN AUTH REQUIRED */

exports.addDriver = async (req, res) => {
  const credentials = auth(req);
  if (credentials && credentials.name == 'admin' && credentials.pass == 'password' &&
      req.body.name && req.body.vehicle && req.body.capacity) {
    try {
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
      res.sendStatus(200);
    } catch(e) {
      res.sendStatus(400);
    }
  } else {
    // right now this catches auth and driver model errors.. should probably split stuff like this?
    res.sendStatus(401);
  }
}

exports.removeDriver = async (req, res) => {
  const credentials = auth(req);
  if (credentials && credentials.name == 'admin' && credentials.pass == 'password') {
    try {
      const driver = await driverModel.remove({ _id : req.driver._id });
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(404);
    } 
  } else {
    res.sendStatus(401);
  }
}