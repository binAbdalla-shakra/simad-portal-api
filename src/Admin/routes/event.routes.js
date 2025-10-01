const express = require('express');
const router = express.Router();
const {
    createOrUpdateEvent,
    getAllEvents,
    getEventById,
    deleteEvent,
} = require('../controllers/event.controller');
const { uploadFile } = require('../../middlewares/upload.middleware');

router.post('/', uploadFile('image'), createOrUpdateEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);

module.exports = router;
