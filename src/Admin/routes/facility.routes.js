const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facility.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// CRUD routes
router.post('/', uploadFile('image'), facilityController.createOrUpdateFacility);
router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.delete('/:id', facilityController.deleteFacility);

module.exports = router;
