const express = require('express');
const router = express.Router();
const {
    getProgramCategories
} = require('../controllers/ProgramCategory.controller');

router.get('/', getProgramCategories);

module.exports = router;