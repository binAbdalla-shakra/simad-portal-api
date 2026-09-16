const Event = require('../../models/Event.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { getReadableMessage } = require('../../utils/error-messages');
exports.createOrUpdateEvent = async (req, res) => {
    try {
        const { _id } = req.body;

        // Handle image upload (e.g., event banner or cover)
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToS3(req.file, 'events');
        }

        const eventData = {
            ...req.body,
        };

        delete eventData._id; // Avoid overwriting _id directly

        let existingEvent;

        if (_id) {
            existingEvent = await Event.findById(_id);
            if (!existingEvent) {
                return errorResponse(res, 'Event not found for update', 404);
            }
        }

        if (req.file) {
            eventData.image = imageUrl;

            // Delete old image if updating
            if (_id && existingEvent?.image) {
                await deleteFromS3(existingEvent.image);
            }
        } else if (_id) {
            eventData.image = existingEvent?.image || '';
        } else {
            eventData.image = '';
        }

        let resultEvent;

        if (_id) {
            // UPDATE operation
            resultEvent = await Event.findByIdAndUpdate(
                _id,
                {
                    ...eventData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            // CREATE operation
            const newEvent = new Event(eventData);
            resultEvent = await newEvent.save();
        }

        const message = _id
            ? 'Event updated successfully'
            : 'Event created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { event: resultEvent }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get all Events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        return successResponse(res, { events }, 'Events fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return errorResponse(res, 'Event not found', 404);
        return successResponse(res, event, 'Event fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return errorResponse(res, 'Event not found', 404);
        if (event.image) {
            await deleteFromS3(event.image);
        }
        return successResponse(res, null, 'Event deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
