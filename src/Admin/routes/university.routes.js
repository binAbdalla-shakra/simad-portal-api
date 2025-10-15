const express = require('express');
const router = express.Router();
const {
    getAllUniversities,
    createOrUpdateUniversity,
    deleteUniversity,
    getUniversityById
} = require('../controllers/university.controller');
const { uploadUniversityProfileImages } = require('../../middlewares/upload.middleware');

// GET /api/university - Get university information
router.get('/', getAllUniversities);

// PUT /api/university - Update university information
router.post('/',);
router.post('/', uploadUniversityProfileImages, createOrUpdateUniversity);

router.delete('/:id', deleteUniversity);
router.get('/:id', getUniversityById);

module.exports = router;