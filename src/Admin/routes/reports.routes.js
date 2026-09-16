const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/programs-by-school', authenticate, reportsController.programsBySchool);
router.get('/users-by-role', authenticate, reportsController.usersByRole);
router.get('/partners-by-category', authenticate, reportsController.partnersByCategory);
router.get('/content-activity', authenticate, reportsController.contentActivity);

module.exports = router;
