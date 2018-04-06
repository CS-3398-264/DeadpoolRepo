const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const { driverModel, riderModel } = require('../models');
const { driverID, getDriverByID, getDriverRating, addDriver, removeDriver } = require('../controllers/driverController');
const { riderID, getRiderByID, getRiderRating, addRider, removeRider } = require('../controllers/riderController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* Parameter Definitions */
router.param('driverID', driverID);
router.param('riderID', riderID);

/* Driver Routes */
router.get('/driver/:driverID', getDriverByID);
router.get('/driver/:driverID/rating', getDriverRating);
router.post('/addDriver', addDriver);
router.delete('/driver/:driverID', removeDriver);

/* Rider Routes */
router.get('/rider/:riderID', getRiderByID);
router.get('/rider/:riderID/rating', getRiderRating);
router.post('/addRider', addRider);
router.delete('/driver/:riderID', removeRider);

module.exports = router;