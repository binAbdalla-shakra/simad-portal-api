const express = require('express');
const router = express.Router();
const {
    getAllAccreditations,
    createOrUpdateAccreditation,
    deleteAccreditation,
    getAccreditationById
} = require('../controllers/accreditation.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllAccreditations);

// PUT /api/accreditations - Update accreditations
router.post('/', uploadFile('logo'), createOrUpdateAccreditation);

router.get('/:id', getAccreditationById);
router.delete('/:id', deleteAccreditation);

module.exports = router;