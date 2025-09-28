const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partners.controller');

router.get('/', partnerController.getPartnersInfo);
module.exports = router;
