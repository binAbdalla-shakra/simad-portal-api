const express = require('express');
const router = express.Router();
const {
    getUniversityInfo,
    updateUniversity
} = require('../controllers/university.controller');

// GET /api/university - Get university information
router.get('/', getUniversityInfo);

// PUT /api/university - Update university information
router.put('/', updateUniversity);

module.exports = router;