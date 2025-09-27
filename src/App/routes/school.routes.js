const express = require('express');
const router = express.Router();
const {

    getSchoolsByCategoryID,
    getSchoolsInfoByID
} = require('../controllers/school.controller');


router.get('/getSchoolsByCategoryID/:id', getSchoolsByCategoryID);

router.get('/getSchoolsInfoByID/:id', getSchoolsInfoByID);






module.exports = router;