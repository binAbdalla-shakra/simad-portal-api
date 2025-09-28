const express = require('express');
const router = express.Router();
const {

    getProgramsInfoByID,
    getAvaliableProgramsInfo
} = require('../controllers/program.controller');



router.get('/getProgramsInfoByID/:id', getProgramsInfoByID);
router.get('/getAvaliableProgramsInfo', getAvaliableProgramsInfo);






module.exports = router;