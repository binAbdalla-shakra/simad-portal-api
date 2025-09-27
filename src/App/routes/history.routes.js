const express = require('express');
const router = express.Router();
const {
    getHistoryItems,
    updateHistoryItems
} = require('../controllers/history.controller');

// GET /api/history - Get all history items
router.get('/', getHistoryItems);

// PUT /api/history - Update history items
router.put('/', updateHistoryItems);

module.exports = router;