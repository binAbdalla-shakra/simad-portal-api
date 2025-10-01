const express = require('express');
const router = express.Router();
const {

    createOrUpdateStaff,
    deleteStaff,
    getAllStaff,
    getStaffById
} = require('../controllers/staff.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllStaff);

router.post('/', uploadFile('photoUrl'), createOrUpdateStaff);

router.delete('/:id', deleteStaff);

router.get('/:id', getStaffById);





module.exports = router;