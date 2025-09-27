const express = require('express');
const router = express.Router();
const {

    createSchool,
    updateSchool,
    deleteSchool,
    getAllSchools,
    getSchoolById
} = require('../controllers/school.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllSchools);

router.post('/', createSchool);


// PUT /api/accreditations - Update accreditations
router.put('/:id', updateSchool);

router.delete('/:id', deleteSchool);

router.get('/:id', getSchoolById);





module.exports = router;