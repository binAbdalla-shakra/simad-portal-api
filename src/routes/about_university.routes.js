const express = require('express');
const router = express.Router();
const {
    getAllUniversityData,
    updateAllUniversityData
} = require('../controllers/about_university.controller');


// GET /about-university - Get all university data
router.get('/', getAllUniversityData);

// PUT /about-university - Update all university data
router.put('/', updateAllUniversityData);

module.exports = router;