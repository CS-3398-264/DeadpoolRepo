# TeamDeadpool
Project 2 nUber

Currently **live** at [nUber-api.herokuapp.com](https://nUber-api.herokuapp.com).

## Development server

Run `npm install` and 'npm start' for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

**NOTE: Environment variables are used for mongoDB connection and all API Keys. The app won't work locally without them properly set in a `.env` file.**

# Available Routes:

## Driver Routes
`get('/driver', getAllDrivers)`
* returns a list of all drivers
* query parameter options: 
  * _minCapacity:_ specify a minimum number of seats
  * _available:_ accepts true or false
`get('/driver/:driverID', getDriverByID)`
* get detailed info on a single driver.
`get('/driver/:driverID/rating', getDriverRating)`
* get a driver's average user rating score.
`get('/driver/:driverID/directions', getCurrentDirections)`
* gives a driver directions for their current trip, if they're on one.
`put('/driver/:driverID/available', setAvailability)`
* manually set a driver's availability.
  * takes { "available" : _true_ or _false_ } in request body
`put('/driver/:driverID/location', setDriverLocation)`
* manually set a driver's location.
  * takes { "available" : _true_ or _false_ } in request body
`post('/driver/:driverID/rateRider', rateRider)`
* driver can rate a rider that has a taken a trip with them
  * takes _tripID_, _riderID_, and a decimal _rating_ from 1.0 to 5.0.
    * _this range isn't currently enforced!_
`post('/driver', addDriver)`
* NOTE: requires **admin authentication.**
* 
`delete('/driver/:driverID', removeDriver)`
* NOTE: requires **admin authentication.**

## Rider Routes
`get('/rider', getAllRiders)`
`get('/rider/:riderID', getRiderByID)`
`get('/rider/:riderID/rating', getRiderRating)`
`get('/rider/:riderID/findDrivers', getPotentialDrivers)`
`get('/rider/:riderID/tripEstimate', getTripEstimate)`
`put('/rider/:riderID/location', setRiderLocation)`
`post('/rider/:riderID/rateDriver', rateDriver)`
`post('/rider/:riderID/requestPickup', requestPickup)`
`post('/rider', addRider)`
`delete('/rider/:riderID', removeRider)`

## Trip Routes
`get('/trip/currentRate', getCurrentRate)`
`get('/trip/:tripID', getTripByID)`