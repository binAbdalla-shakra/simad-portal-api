const express = require('express');
const router = express.Router();
const {
    getAllHistory,
    createOrUpdateHistory,
    deleteHistory,
    getHistoryById
} = require('../controllers/history.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// GET /api/history - Get all history items
router.get('/', getAllHistory);

// PUT /api/history - Update history items
router.post('/', uploadFile('logo'), createOrUpdateHistory);

router.delete('/:id', deleteHistory);
router.get('/:id', getHistoryById);

module.exports = router;