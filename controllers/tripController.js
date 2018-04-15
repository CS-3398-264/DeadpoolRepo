const { tripModel } = require('../models');
const { calculateRate, simulateTrip } = require('../utils/tools');

exports = module.exports = {};

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}

exports.tripSimulation = async (req, res) => {
  try {
    let count = 0;
    const intervalID = setInterval(() => {
      console.log('testing timer');
      count++;
      if (count > 9) clearInterval(intervalID);
    }, 1000);
    const tripData = await simulateTrip('test');
    tripData.routes[0].legs.forEach(leg=>leg.steps.forEach(step=>console.log(step)));
    res.sendStatus(200);
  } catch (e) {
    console.error(e.message || e);
  }
}