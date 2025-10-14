const express = require('express');
const router = express.Router();
const {
    createOrUpdateInstitution,
    deleteInstitution,
    getInstitutionById,
    getAllInstitutions
} = require('../controllers/institution.controller');
const { uploadInstitutionImages } = require('../../middlewares/upload.middleware');

// GET /api/Institutions - Get all Institutions
router.get('/', getAllInstitutions);

router.post('/', uploadInstitutionImages, createOrUpdateInstitution);


router.delete('/:id', deleteInstitution);

router.get('/:id', getInstitutionById);





module.exports = router;