const mongoose = require('mongoose');

exports = module.exports = {};

/* OBJECT SCHEMAS */
const driverSchema = mongoose.Schema({
  name: String,
  vehicle: String,
  capacity: Number,
  available: Boolean,
  location: {
    latitude: Number,
    longitude: Number 
  },
  reviews: [Number],
  currentTrip: String
}, { collection : 'drivers' });

const riderSchema = mongoose.Schema({
  name: String,
  location: {
    latitude: Number,
    longitude: Number 
  },
  reviews: [Number]
}, { collection : 'riders' });

const tripSchema = mongoose.Schema({
  isComplete: Boolean,
  rate: Number,
  cost: String,
  driverLoc: {
    address: String,
    latitude: Number,
    longitude: Number 
  },
  pickup: {
    address: String,
    latitude: Number,
    longitude: Number 
  },
  dropoff: {
    address: String,
    latitude: Number,
    longitude: Number 
  },
  driverID: String,
  riderID: String,
  distance: String,
  travelTime: String,
  timeToPickup: String,
  directions: {
    toPickup: Object,
    toDropoff: Object
  }
}, { collection : 'trips' });

/* ORM Models */
exports.driverModel = mongoose.model('driver', driverSchema);
exports.riderModel = mongoose.model('rider', riderSchema);
exports.tripModel = mongoose.model('trip', tripSchema);