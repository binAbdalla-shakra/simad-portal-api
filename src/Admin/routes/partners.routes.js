const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partners.controller');

router.post('/', partnerController.createPartner);
router.get('/', partnerController.getPartners);
router.get('/:id', partnerController.getPartnerById);
router.put('/:id', partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
