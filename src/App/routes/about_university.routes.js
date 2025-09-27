const express = require('express');
const router = express.Router();
const {
    getAllUniversityData,
    getWhySimadData,
    getRectorsMessage,
    getSenateList,
    getHistoryAwardData,
    getAccreditationsData,
    getUniVisionAndMission
} = require('../controllers/about_university.controller');


// GET /about-university - Get all university data
router.get('/', getAllUniversityData);

// PUT /about-university - Update all university data
router.get('/getWhySimadData', getWhySimadData);
router.get('/getRectorsMessage', getRectorsMessage);
router.get('/getSenateList', getSenateList);
router.get('/getHistoryAwardData', getHistoryAwardData);

router.get('/getAccreditationsData', getAccreditationsData);
router.get('/getUniVisionAndMission', getUniVisionAndMission);


module.exports = router;