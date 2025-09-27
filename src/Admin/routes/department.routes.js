const express = require('express');
const router = express.Router();
const {

    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartments,
    getDepartmentById
} = require('../controllers/department.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllDepartments);

router.post('/', createDepartment);


// PUT /api/accreditations - Update accreditations
router.put('/:id', updateDepartment);

router.delete('/:id', deleteDepartment);

router.get('/:id', getDepartmentById);





module.exports = router;