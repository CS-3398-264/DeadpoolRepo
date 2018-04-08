const { tripModel } = require('../models');
const { calculateRate } = require('../utils/tools');

exports = module.exports = {};

exports.getCurrentRate = (req, res) => {
  res.json(calculateRate(new Date(Date.now()).getHours()));
}