const express = require('express');
const router = express.Router();
const {
    getInstitutionsSummary,
    getInstitutionInfo
} = require('../controllers/institutions.controller');

router.get('/summary', getInstitutionsSummary);

router.get('/:identifier', getInstitutionInfo);


module.exports = router;