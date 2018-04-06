const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const adminRouter = require('./admin');
const { 
  driverID, 
  getDriverByID, 
  getDriverRating, 
  getAllDrivers, 
  setAvailability 
} = require('../controllers/driverController');
const { 
  riderID, 
  getRiderByID, 
  getRiderRating, 
  addRider, 
  removeRider, 
  getAllRiders 
} = require('../controllers/riderController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* Parameter Definitions */
router.param('driverID', driverID);
router.param('riderID', riderID);

/* Admin Routes */
router.use('/admin', adminRouter);

/* Driver Routes */
router.get('/driver/:driverID', getDriverByID);
router.get('/driver/:driverID/rating', getDriverRating);
router.put('/driver/:driverID/available', setAvailability);
router.get('/driver', getAllDrivers);

/* Rider Routes */
router.get('/rider/:riderID', getRiderByID);
router.get('/rider/:riderID/rating', getRiderRating);
router.get('/rider', getAllRiders);
router.post('/rider', addRider);

module.exports = router;