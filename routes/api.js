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
router.get('/getDriver/:driverID?', getDriverByID);
router.get('/getRider/:riderID?', getRiderByID);
router.get('/getRating/rider/:riderID?', getRiderRating);
router.get('/getRating/driver/:driverID?', getDriverRating);


/* POST Request Handlers */
router.post('/addDriver', addDriver);
router.post('/addRider', addRider);
router.post('/removeDriver/:driverID', removeDriver);
router.post('/removeRider/:riderID', removeRider);


module.exports = router;