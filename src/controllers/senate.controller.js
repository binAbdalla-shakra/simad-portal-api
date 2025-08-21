const Senate = require('../models/Senate.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all senate members
exports.getSenateMembers = async (req, res) => {
    try {
        const members = await Senate.find({ isActive: true }).sort({ order: 1 });
        return successResponse(res, { members });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create or update senate members in bulk
exports.updateSenateMembers = async (req, res) => {
    try {
        const { members } = req.body;

        // Delete all existing members
        await Senate.deleteMany({});

        // Insert new members
        const newMembers = await Senate.insertMany(members);

        return successResponse(res, { members: newMembers }, 'Senate members updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};