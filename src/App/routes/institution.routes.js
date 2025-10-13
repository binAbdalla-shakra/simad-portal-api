const express = require('express');
const router = express.Router();
const {
    getinstiutionsStaticInfo
} = require('../controllers/institutions.controller');

router.get('/', getinstiutionsStaticInfo);

module.exports = router;