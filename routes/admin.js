const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const { 
  driverID
} = require('../controllers/driverController');
const { 
  riderID
} = require('../controllers/riderController');
const {
  addDriver, 
  removeDriver,
  removeRider
} = require('../controllers/adminController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* Parameter Definitions */
router.param('driverID', driverID);
router.param('riderID', riderID);

/* Driver Routes */
router.post('/driver', addDriver);
router.delete('/driver/:driverID', removeDriver);

/* Rider Routes */
router.delete('/rider/:riderID', removeRider);

module.exports = router;