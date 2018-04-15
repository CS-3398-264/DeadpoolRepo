const { tripModel } = require('../models');
const { calculateRate, simulateTrip } = require('../utils/tools');

exports = module.exports = {};

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}

exports.tripSimulation = async (req, res) => {
  try {
    let count = 0;
    const tripData = await simulateTrip('test');
    const intervalID = setInterval(() => {
      console.log('testing timer');
      tripData.routes[0].legs.forEach(
        leg => leg.steps.forEach(
          step => {
            console.log(`travel ${step.distance.text} for ${step.duration.text} to finish at ${step.end_location.lat},${step.end_location.lng}.`);
            count++;
          }
        )
      );
      if (count > 9) {
        clearInterval(intervalID);
        console.log(`${count} steps complete.`);
      }
    }, 1000);
    //tripData.routes[0].legs.forEach(leg=>leg.steps.forEach(step=>console.log(step)));
    res.sendStatus(200);
  } catch (e) {
    console.error(e.message || e);
  }
}