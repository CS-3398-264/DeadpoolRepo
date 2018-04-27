# TeamDeadpool
Project 2 nUber

Currently **live** at [nUber-api.herokuapp.com](https://nUber-api.herokuapp.com).

## Development server

Run `npm install` and 'npm start' for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

**NOTE: Environment variables are used for mongoDB connection and all API Keys. The app won't work locally without them properly set in a `.env` file.**

# Available Routes:

## Driver Routes
### `get('/driver', getAllDrivers)`
* returns a list of all drivers
* query parameter options: 
  * _minCapacity:_ specify a minimum number of seats
  * _available:_ accepts true or false
### `get('/driver/:driverID', getDriverByID)`
* get detailed info on a single driver.
### `get('/driver/:driverID/rating', getDriverRating)`
* get a driver's average user rating score.
### `get('/driver/:driverID/directions', getCurrentDirections)`
* gives a driver directions for their current trip, if they're on one.
### `put('/driver/:driverID/available', setAvailability)`
* manually set a driver's availability.
  * takes { "available" : _true_ or _false_ } in request body
### `put('/driver/:driverID/location', setDriverLocation)`
* manually set a driver's location.
  * takes _latitude_ and _longitude_ in request body
### `post('/driver/:driverID/rateRider', rateRider)`
* driver can rate a rider that has a taken a trip with them
  * takes _tripID_, _riderID_, and a decimal _rating_ from 1.0 to 5.0.
    * _this range isn't currently enforced!_
### `post('/driver', addDriver)`
* NOTE: requires **admin authentication.**
* takes _name_, _vehicle_, and _capacity_ in the request body.
### `delete('/driver/:driverID', removeDriver)`
* NOTE: requires **admin authentication.**

## Rider Routes
### `get('/rider', getAllRiders)`
* get a list of all riders
### `get('/rider/:riderID', getRiderByID)`
* get details on a single rider
### `get('/rider/:riderID/rating', getRiderRating)`
* get a riders average review score.
### `get('/rider/:riderID/findDrivers', getPotentialDrivers)`
* gets all available drivers, in a 15 mi radius by default.
* query parameter options:
  * _minCapacity:_ specify a minimum capacity
  * _maxDistance:_ specify a max searcch radius
### `get('/rider/:riderID/tripEstimate', getTripEstimate)`
* get a price estimate on a trip with the current rate
* trip starts from current rider location
* takes query parameters _lat_ and _lon_ instead of a request body.
### `put('/rider/:riderID/location', setRiderLocation)`
* manually set rider location
* takes _latitude_ and _longitude_ in request body.
### `post('/rider/:riderID/rateDriver', rateDriver)`
* allows rider to rate a driver once they have completed a trip.
### `post('/rider/:riderID/requestPickup', requestPickup)`
* request a pickup from a specific driver.
* simulates a real trip, with updated locations for both the rider and driver in 'scale' time.
* takes _driverID_, _dropoff.latitude_ and _dropoff.longitude_ in the request body.
* returns a detailed report on the trip.
### `post('/rider', addRider)`
* adds a rider to the system.
* specify a _name_ in the request body.
### `delete('/rider/:riderID', removeRider)`
* NOTE: requires **admin authentication.**

## Trip Routes
### `get('/trip/currentRate', getCurrentRate)`
* returns the current rate, based on demand AKA time of day
### `get('/trip/:tripID', getTripByID)`
* returns a detailed report on the specified trip.