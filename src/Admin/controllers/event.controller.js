const Event = require('../../models/Event.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        return successResponse(res, event, 'Event created successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get all Events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        return successResponse(res, events, 'Events fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return errorResponse(res, 'Event not found', 404);
        return successResponse(res, event, 'Event fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update Event
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!event) return errorResponse(res, 'Event not found', 404);
        return successResponse(res, event, 'Event updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return errorResponse(res, 'Event not found', 404);
        return successResponse(res, null, 'Event deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
