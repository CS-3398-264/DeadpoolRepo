const { driverModel, riderModel } = require('../models');
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
    const driverDocs = driverModel.find();
    res.send(docs);
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
      { new: true });
    res.send(driver); // should probably just return 200 status for 'idempotency'
  } catch (e) {
    res.sendStatus(400);
  }
}

exports.rateRider = async (req, res) => {
  if (req.driver) {
    try {
      const updatedRider = await riderModel.findByIdAndUpdate(
        req.body.riderID, 
        { $push: { reviews: req.body.rating } }, 
        { new: true });
      res.send(updatedRider); // should probably just return 200 for 'idempotency'
    } catch (e) {
      res.sendStatus(400);
    }
  }
}

/* ADMIN AUTH REQUIRED */

exports.addDriver = async (req, res) => {
  const credentials = auth(req);
  if (credentials && credentials.name == "admin" && credentials.pass == "password" &&
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
        reviews: []
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
  if (credentials && credentials.name == "admin" && credentials.pass == "password") {
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