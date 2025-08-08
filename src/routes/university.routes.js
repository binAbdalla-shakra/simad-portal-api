const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', universityController.getUniversityInfo);

router.post('/', universityController.createUniversity);
router.put('/:slug', universityController.updateUniversity);

module.exports = router;