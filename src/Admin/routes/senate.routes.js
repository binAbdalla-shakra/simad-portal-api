const express = require('express');
const router = express.Router();
const {
    getAllSenates,
    createOrUpdateSenate,
    deleteSenate,
    getSenateById
} = require('../controllers/senate.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// GET /api/senate - Get all senate members
router.get('/', getAllSenates);

// PUT /api/senate - Update senate members
router.post('/', uploadFile('image'), createOrUpdateSenate);

router.delete('/:id', deleteSenate);
router.get('/:id', getSenateById);
module.exports = router;