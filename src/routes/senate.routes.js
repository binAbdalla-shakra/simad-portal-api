const express = require('express');
const router = express.Router();
const {
    getSenateMembers,
    updateSenateMembers
} = require('../controllers/senate.controller');

// GET /api/senate - Get all senate members
router.get('/', getSenateMembers);

// PUT /api/senate - Update senate members
router.put('/', updateSenateMembers);

module.exports = router;