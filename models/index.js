const mongoose = require('mongoose');

exports = module.exports = {};

/* OBJECT SCHEMAS */
const driverSchema = mongoose.Schema({
  name: String,
  vehicle: String,
  capacity: Number,
  available: Boolean,
  reviews: Array
}, { collection : 'drivers' });

const riderSchema = mongoose.Schema({
  name: String,
  reviews: Array
}, { collection : 'riders' });

/*
var tripSchema = mongoose.Schema({
  isComplete: Boolean
}, { collection : 'trips' });
*/

/* ORM Models */
exports.driverModel = mongoose.model('driver', driverSchema);
exports.riderModel = mongoose.model('rider', riderSchema);