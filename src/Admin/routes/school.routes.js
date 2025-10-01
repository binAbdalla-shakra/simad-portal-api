const express = require('express');
const router = express.Router();
const {

    createOrUpdateSchool,
    deleteSchool,
    getAllSchools,
    getSchoolById
} = require('../controllers/school.controller');
const { uploadSchoolImages } = require('../../middlewares/upload.middleware');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllSchools);

router.post('/', uploadSchoolImages, createOrUpdateSchool);


router.delete('/:id', deleteSchool);

router.get('/:id', getSchoolById);





module.exports = router;