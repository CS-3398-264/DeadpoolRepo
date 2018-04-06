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

/* GET Request Handlers */
router.get('/driver/:driverID', getDriverByID);
router.get('/rider/:riderID', getRiderByID);
router.get('/rider/:riderID/rating', getRiderRating);
router.get('/driver/:driverID/rating', getDriverRating);

/* POST Request Handlers */
router.post('/addDriver', addDriver);
router.post('/addRider', addRider);

/* PUT Request Handlers */

/* DELETE Request Handlers */
router.delete('/driver/:driverID', removeDriver);
router.delete('/driver/:riderID', removeRider);

module.exports = router;