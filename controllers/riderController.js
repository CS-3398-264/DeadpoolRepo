const { riderModel, driverModel } = require('../models');
const { getRating } = require('../utils/tools');
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
    const riderDocs = riderModel.find();
    res.send(docs);
  } catch (e) {
    res.sendStatus(400); // should be different error code?
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
      res.send(updatedRider);
    } catch (e) {
      res.sendStatus(400);
    }
  }
}

/* ADMIN AUTH REQUIRED */

exports.removeRider = async (req, res) => {
  const credentials = auth(req);
  if (credentials && credentials.name == "admin" && credentials.pass == "password") {
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