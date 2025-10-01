const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partners.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

router.post('/', uploadFile('logo'), partnerController.createorUpdatePartner);
router.get('/', partnerController.getPartners);
router.get('/:id', partnerController.getPartnerById);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
