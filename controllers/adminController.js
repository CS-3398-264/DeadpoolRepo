const { driverModel } = require('../models');
const { riderModel } = require('../models');

exports = module.exports = {};

/* Driver Methods */
exports.addDriver = (req, res) => {
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
}

exports.removeDriver = (req, res) => {
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

/* Rider Methods */
exports.removeRider = (req, res) => {
  if (req.rider) {
    riderModel.remove({ _id : req.rider._id })
      .then(doc => {
        res.sendStatus(200);
      }).catch(err => {
        res.sendStatus(400);
      });
  } else { 
    res.sendStatus(404);
  }
}