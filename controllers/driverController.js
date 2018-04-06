const { driverModel } = require('../models');
const { getRating } = require('../utils/tools');

exports = module.exports = {};

exports.driverID = (req, res, next, driverID) => {
  driverModel.findOne({ _id : driverID }, (err, doc) => {
    if (err) 
      req.driver = null;
    else 
      req.driver = doc;
  }).then(doc => {
    return next();
  }).catch(err => { 
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
  driverModel.find((err, docs) => {
    if (docs) 
      res.json(docs);
    else 
      res.sendStatus(404);
  }).catch(err => {
    res.sendStatus(400);
  })
}

exports.getDriverRating = (req, res) => { 
  if (req.driver) 
    res.json(getRating(req.driver));
  else 
    res.sendStatus(404);
}

exports.setAvailability = (req, res) => {
  if (req.driver) {
    const newStatus;
    if (req.available && !req.driver.available) 
      newStatus = true
    else if (!req.available && req.driver.available) 
      newStatus = false;
    Tank.findByIdAndUpdate(id, { $set: { available: newStatus }}, { new: true }, function (err, tank) {
      if (err) return handleError(err);
      res.send(tank);
    });
  } else {
    res.sendStatus(404);
  }
}

exports.addDriver = (req, res) => {
  // this is our "authentication" for now
  if (req.body.password === 'admin123') {
    if (req.body.name && req.body.vehicle && req.body.capacity) {
      const newDriver = new driverModel({
        name: req.body.name,
        vehicle: req.body.vehicle,
        capacity: req.body.capacity,
        available: false,
        reviews: []
      });
      newDriver.save()
        .then(doc => {
          res.sendStatus(200);
          console.log('saved new driver "%s" to db. id: %s', doc.name, doc._id);
        }).catch(err => {
          res.sendStatus(400);
        });
    } else {
      res.sendStatus(400);
    } 
  } else {
    res.sendStatus(401);
  }
}

exports.removeDriver = (req, res) => {
  // this is our "authentication" for now
  if (req.body.password === 'admin123') {
    if (req.driver) {
      driverModel.remove({ _id : req.driver._id })
        .then(doc => {
          res.sendStatus(200);
        }).catch(err => {
          res.sendStatus(400);
        });
    } else {
      res.sendStatus(404);
    }
  }
}