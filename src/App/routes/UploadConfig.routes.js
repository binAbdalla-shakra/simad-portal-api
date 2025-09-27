const express = require('express');
const router = express.Router();
const {

    createDefaultConfigs
} = require('../controllers/UploadConfig.controller');


router.post('/', createDefaultConfigs);




module.exports = router;