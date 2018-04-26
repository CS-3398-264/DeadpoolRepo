const { tripModel } = require('../models');
const { calculateRate, simulateTrip, driverTripSimulation } = require('../utils/tools');

exports = module.exports = {};

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}

// this can serve as an outline for the getTripByID route.. should it be admin-only?

/*
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
*/