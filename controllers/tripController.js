const { tripModel } = require('../models');
const { calculateRate, simulateTrip, driverTripSimulation } = require('../utils/tools');

exports = module.exports = {};

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}

exports.tripSimulation = (req, res) => {
  try {
    let delay, count = 0;
    res.sendStatus(200);
    const pickup = driverTripSimulation('5abdd27a734d1d0cf303e71f', 'Austin', '30.229246,-97.725819', 'pickup').then(()=> {
      const dropoff = driverTripSimulation('5abdd27a734d1d0cf303e71f', '30.229246,-97.725819', 'Austin', 'dropoff');
    });
  } catch (e) {
    console.error(e.message || e);
  }
}