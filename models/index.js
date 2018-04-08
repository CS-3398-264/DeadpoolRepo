const mongoose = require('mongoose');

exports = module.exports = {};

/* OBJECT SCHEMAS */
const driverSchema = mongoose.Schema({
  name: String,
  vehicle: String,
  capacity: Number,
  available: Boolean,
  reviews: [Number]
}, { collection : 'drivers' });

const riderSchema = mongoose.Schema({
  name: String,
  reviews: [Number]
}, { collection : 'riders' });

const tripSchema = mongoose.Schema({
  isComplete: Boolean,
  rate: Number,
  totalPrice: Number,
  startLoc: {
    latitude: Number,
    longitude: Number 
  },
  endLoc: {
    latitude: Number,
    longitude: Number 
  },
  driverID: String,
  riderID: String
}, { collection : 'trips' });

/* ORM Models */
exports.driverModel = mongoose.model('driver', driverSchema);
exports.riderModel = mongoose.model('rider', riderSchema);
exports.tripModel = mongoose.model('trip', tripSchema);