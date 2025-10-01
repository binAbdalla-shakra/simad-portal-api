const express = require('express');
const router = express.Router();
const {

    createOrUpdateProgram,
    deleteProgram,
    getAllPrograms,
    getProgramById
} = require('../controllers/program.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllPrograms);

router.post('/', uploadFile('coverImage'), createOrUpdateProgram);


router.delete('/:id', deleteProgram);

router.get('/:id', getProgramById);





module.exports = router;