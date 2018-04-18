const { tripModel } = require('../models');
const { calculateRate, simulateTrip } = require('../utils/tools');
const Promise = require('bluebird');

exports = module.exports = {};

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}

exports.tripSimulation = async (req, res) => {
  try {
    let delay, count = 0;
    const tripData = await simulateTrip('test');
    /*
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
    */

    /*
    tripData.routes[0].legs.forEach(async (leg, i) => {
      console.log(`leg: ${i}\n`);
      await leg.steps.forEach(async (step,j) => {
        const stepData = await getStepDataWithDelay(step, j);
        console.log(`leg${i} step ${j}: taking ${stepData.delay}ms to travel ${stepData.distance} and arrive at ${stepData.lat},${stepData.lon}.`);  
        //console.log(step);
      });
    });
    */
    

  
    //const taskArray = tripData.routes[0].legs[0].steps.map(async (step, j) => await getStepDataWithDelay(step, j));
    //Promise.each(taskArray, (output) =>  console.log(output));


    res.sendStatus(200);
  } catch (e) {
    console.error(e.message || e);
  }
}
/*
const getStepDataWithDelay = async (step, index) => {
  const delayMS = step.duration.value * 500;
  await new Promise.delay(delayMS).then(() => {
    return {
      delay: delayMS,
      distance: step.distance.text,
      lat: step.end_location.lat,
      lon: step.end_location.lng
    }
  });
  throw Error(`error with step #${index}!`);
}
*/