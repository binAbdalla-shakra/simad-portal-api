const History = require('../models/History.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all history items
exports.getHistoryItems = async (req, res) => {
    try {
        const items = await History.find({ isActive: true }).sort({ order: 1 });
        return successResponse(res, { items });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create or update history items in bulk
exports.updateHistoryItems = async (req, res) => {
    try {
        const { items } = req.body;

        // Delete all existing items
        await History.deleteMany({});

        // Insert new items
        const newItems = await History.insertMany(items);

        return successResponse(res, { items: newItems }, 'History items updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};