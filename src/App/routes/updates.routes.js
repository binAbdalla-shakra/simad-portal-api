const express = require('express');
const router = express.Router();
const updatesController = require('../controllers/updates.controller');

router.get('/active-news', updatesController.getActiveNews);
router.get('/upcoming-events', updatesController.getAllEvents);




module.exports = router;
