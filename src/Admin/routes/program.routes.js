const express = require('express');
const router = express.Router();
const {

    createProgram,
    updateProgram,
    deleteProgram,
    getAllPrograms,
    getProgramById
} = require('../controllers/program.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllPrograms);

router.post('/', createProgram);


// PUT /api/accreditations - Update accreditations
router.put('/:id', updateProgram);

router.delete('/:id', deleteProgram);

router.get('/:id', getProgramById);





module.exports = router;