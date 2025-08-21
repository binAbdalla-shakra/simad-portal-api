const express = require('express');
const router = express.Router();
const {
    getWhySimadItems,
    updateWhySimadItems
} = require('../controllers/whySimad.controller');

// GET /api/why-simad - Get all WhySimad items
router.get('/', getWhySimadItems);

// PUT /api/why-simad - Update WhySimad items
router.put('/', updateWhySimadItems);

module.exports = router;