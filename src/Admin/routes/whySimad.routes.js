const express = require('express');
const router = express.Router();
const {
    getAllWhySimad,
    createOrUpdateWhySimad,
    deleteWhySimad,
    getWhySimadById
} = require('../controllers/whySimad.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// GET /api/why-simad - Get all WhySimad items
router.get('/', getAllWhySimad);

// PUT /api/why-simad - Update WhySimad items
router.post('/', uploadFile('image'), createOrUpdateWhySimad);


router.delete('/:id', deleteWhySimad);
router.get('/:id', getWhySimadById);

module.exports = router;