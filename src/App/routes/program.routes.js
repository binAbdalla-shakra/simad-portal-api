const express = require('express');
const router = express.Router();
const {

    getProgramsInfoByID
} = require('../controllers/program.controller');



router.get('/getProgramsInfoByID/:id', getProgramsInfoByID);





module.exports = router;