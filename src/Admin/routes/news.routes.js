const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

// CRUD routes
router.post('/', uploadFile('image'), newsController.createOrUpdateNews);
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
