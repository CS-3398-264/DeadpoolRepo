const { tripModel } = require('../models');
const { calculateRate, simulateTrip, driverTripSimulation } = require('../utils/tools');

exports = module.exports = {};

exports.tripID = async (req, res, next, tripID) => {
  try {
    const tripDoc = await tripModel.findOne({ _id : tripID });
    req.trip = tripDoc;
  } catch (e) {
    req.trip = null;
  }
  return next();
}

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}

// this can serve as an outline for the getTripByID route.. should it be admin-only?
exports.getTripByID = (req, res) => {
  if (req.trip)
    res.send(req.trip);
  else
    res.sendStatus(404);
}