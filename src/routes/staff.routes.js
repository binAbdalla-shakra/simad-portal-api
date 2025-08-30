const express = require('express');
const router = express.Router();
const {

    createStaff,
    updateStaff,
    deleteStaff,
    getAllStaff,
    getStaffById
} = require('../controllers/staff.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllStaff);

router.post('/', createStaff);


// PUT /api/accreditations - Update accreditations
router.put('/:id', updateStaff);

router.delete('/:id', deleteStaff);

router.get('/:id', getStaffById);





module.exports = router;