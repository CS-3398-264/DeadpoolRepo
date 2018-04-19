const { driverModel } = require('../models');
require('dotenv').config();

exports = module.exports = {};

const DM_KEY = `&key=${process.env.GOOGLE_DM_KEY}`;
const DIR_KEY = `&key=${process.env.GOOGLE_DIR_KEY}`;

const getContent = url => {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(JSON.parse(body.join(''))));
    });
    request.on('error', (err) => reject(err))
    });
}

exports.getRating = userObj => 
  ((userObj.reviews.reduce((a, b) => a + b, 0) / userObj.reviews.length) || 0).toFixed(2);

exports.calculateRate = currentTime => {
  if (currentTime > 16)
    return 1.75;
  else if (currentTime > 9)
    return 1.00;
  else
    return 1.25;
}

exports.computeMileage = distance => {
  const value = distance.split(' ')[0];
  const units = distance.split(' ')[1];
  return units == 'mi' ? value : 1;
}

exports.simulateTrip = async tripRequest => {
  console.log('simulating trip. bleep bloop.');
  let delayMS = 0;
  const dirReq = `https://maps.googleapis.com/maps/api/directions/json?origin=Austin&destination=30.229246,-97.725819${DM_KEY}`;
  const tripData = await getContent(dirReq);
  tripData.routes[0].legs[0].steps.forEach((step, i) => {
    delayMS += (2500 * i) + (step.duration.value * 100); // this can be adjusted... just an estimate
    setTimeout(async () => {
      console.log(`step ${i}: taking ${step.duration.value}ms to travel ${step.distance.text} and arrive at ${step.end_location.lat},${step.end_location.lng}.`);  
      // make an update to drivers position here
      try {
        const updatedDriver = await driverModel.findByIdAndUpdate(
          "5abdd27a734d1d0cf303e71f", 
          { $set: { location: {
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
          } } }, { new: true }
        );
        //console.log(updatedDriver); // should probably just return 200 status for 'idempotency'
      } catch (e) {
        console.error(e.messge || e);
      }
      // end
      if (i == tripData.routes[0].legs[0].steps.length-1)
        console.log('conditional last step');
        // here we can flip availability back for the driver
    }, delayMS);
  });
}

exports.distanceMatrixRequest = (origin, destination) => {
  const baseURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=';
  let reqOrigin;
  let reqDest;
  if (Array.isArray(origin)) {
    reqOrigin = `${origin[0].latitude},${origin[0].longitude}`;
    for (i = 1; i < origin.length; i++) {
      reqOrigin += `|${origin[1].latitude},${origin[1].longitude}`;
    }
  } else {
    reqOrigin = `${origin.latitude},${origin.longitude}`;
  }
  if (Array.isArray(destination)) {
    reqDest = `&destinations=${destination[0].latitude},${destination[0].longitude}`;
    for (i=1; i < destination.length; i++) {
      reqDest += `|${destination[1].latitude},${destination[1].longitude}`;
    }
  } else {
    reqDest = `&destinations=${destination.latitude},${destination.longitude}`;
  }
  const requestString = baseURL + reqOrigin + reqDest + DM_KEY;
  return getContent(requestString);
}

exports.driverTripSimulation = (driverID, startLocation, endLocation, tripType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (tripType === 'pickup') {
        console.log('starting driver sim... driver going unavailable');
        const unavailable = await driverModel.findByIdAndUpdate(
          driverID, 
          { $set: { available: false } }, { new: true }
        );
      }
      let delayMS = 0;
      const dirReq = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${endLocation}${DM_KEY}`;
      const tripData = await getContent(dirReq);
      //console.log(tripData.routes[0].legs);
      // start iterating through the steps in the directions
      tripData.routes[0].legs[0].steps.forEach((step, i) => {
        delayMS += (200 * i) + (step.duration.value * 10); // this can be adjusted... just an estimate
        setTimeout(async () => {
          console.log(`step ${i}: taking ${step.duration.value}ms to travel ${step.distance.text} and arrive at ${step.end_location.lat},${step.end_location.lng}.`);  
          // make an update to drivers position here
          const updatedDriver = await driverModel.findByIdAndUpdate(
            driverID, 
            { $set: { 
              location: {
                latitude: step.end_location.lat,
                longitude: step.end_location.lng
              } 
            } }, { new: true }
          );
          if (i == tripData.routes[0].legs[0].steps.length-1) {
            // if this is a rider dropoff, go back on available
            if (tripType === 'dropoff') {
              console.log('drive finished. going back on available');
              const updatedDriver = await driverModel.findByIdAndUpdate(
                driverID, 
                { $set: { available: true } }, 
                { new: true }
              );
            }
            resolve('done');
          }
        }, delayMS);
      });
    } catch (e) {
      console.error(e.messge || e);
      reject(e.message || e);
    }
  });
}

exports.newDirectionRequest = (driverLocation, pickupLocation, dropoffLocation) => {
  const dirReq = `https://maps.googleapis.com/maps/api/directions/json?origin=` +
                 `${driverLocation.latitude},${driverLocation.longitude}` +
                 `&destination=${dropoffLocation.latitude},${dropoffLocation.longitude}` + 
                 `&waypoints=optimize:true|${pickupLocation.latitude},${pickupLocation.longitude}` + 
                 `&key=${DIR_KEY}`;
  return getContent(dirReq);
}

exports.buildSteps = stepContent => {
  return stepContent.map(step => {
    return {
      "distance": {
        "text": step.distance.text,
        "inMeters": step.distance.value
      },
      "duration": {
        "text": step.duration.text,
        "inSeconds": step.duration.value
      },
      "endLocation": {
        "latitude": step.end_location.lat,
        "longitude": step.end_location.lng
      },
      "maneuver": step.maneuver || null,
      "html": step.html_instructions || bull
    }
  });
}