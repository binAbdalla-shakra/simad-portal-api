const History = require('../../models/History.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Create or Update History Entry
exports.createOrUpdateHistory = async (req, res) => {
    try {
        const { _id } = req.body;

        const historyData = {
            ...req.body,
        };

        delete historyData._id;

        let existingEntry;

        if (_id) {
            existingEntry = await History.findById(_id);
            if (!existingEntry) {
                return errorResponse(res, 'History entry not found for update', 404);
            }
        }

        let resultHistory;

        if (_id) {
            resultHistory = await History.findByIdAndUpdate(
                _id,
                {
                    ...historyData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            const newHistory = new History(historyData);
            resultHistory = await newHistory.save();
        }

        const message = _id
            ? 'History entry updated successfully'
            : 'History entry created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { history: resultHistory }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get All History Entries
exports.getAllHistory = async (req, res) => {
    try {
        const history = await History.find().sort({ order: 1 });
        return successResponse(res, { history }, 'History entries fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get History Entry by ID
exports.getHistoryById = async (req, res) => {
    try {
        const entry = await History.findById(req.params.id);
        if (!entry) return errorResponse(res, 'History entry not found', 404);
        return successResponse(res, entry, 'History entry fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete History Entry
exports.deleteHistory = async (req, res) => {
    try {
        const entry = await History.findByIdAndDelete(req.params.id);
        if (!entry) return errorResponse(res, 'History entry not found', 404);

        return successResponse(res, null, 'History entry deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
