
const express = require('express');
const router = express.Router();
const updatesController = require('../controllers/facility.controller');

router.get('/', updatesController.getFacilities);


module.exports = router;


