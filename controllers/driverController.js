const { driverModel, riderModel } = require('../models');
const { getRating } = require('../utils/tools');

exports = module.exports = {};

// NOTE: these methods currently return JSON (for debugging), 
// but, for idempotency, may get switched to 200 OK later on

exports.driverID = (req, res, next, driverID) => {
  driverModel.findOne({ _id : driverID }).then(doc => {
    req.driver = doc;
    return next();
  }).catch(err => { 
    req.driver = null;
    return next(); 
  });
}

exports.getDriverByID = (req, res) => { 
  if (req.driver) 
    res.send(req.driver);
  else 
    res.sendStatus(404);
}

exports.getAllDrivers = (req, res) => {
  driverModel.find().then(docs => {
    res.send(docs);
  }).catch(err => {
    res.sendStatus(400); // should be different error code?
  });                    // there are a few that should be changed..
}

exports.getDriverRating = (req, res) => { 
  if (req.driver) 
    res.json(getRating(req.driver));
  else 
    res.sendStatus(404);
}

exports.setAvailability = (req, res) => {
  driverModel.findByIdAndUpdate(
    req.driver._id, 
    { $set: { available: req.body.available } }, 
    { new: true }).then(driver => {
    res.json(driver);
  }).catch(err => {
    res.sendStatus(400);
  });
}

exports.rateRider = (req, res) => {
  if (req.driver) {
    riderModel.findByIdAndUpdate(
      req.body.riderID, 
      { $push: { reviews: req.body.rating } }, 
      { new: true }).then(rider => {
      res.json(rider);
    }).catch(err => {
      res.sendStatus(400);
    });
  }
}