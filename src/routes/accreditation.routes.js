const express = require('express');
const router = express.Router();
const {
    getAccreditations,
    updateAccreditations
} = require('../controllers/accreditation.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAccreditations);

// PUT /api/accreditations - Update accreditations
router.put('/', updateAccreditations);

module.exports = router;