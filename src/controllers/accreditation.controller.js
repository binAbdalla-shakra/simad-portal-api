const Accreditation = require('../models/Accreditation.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all accreditations
exports.getAccreditations = async (req, res) => {
    try {
        const accreditations = await Accreditation.find({ isActive: true }).sort({ order: 1 });
        return successResponse(res, { accreditations });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create or update accreditations in bulk
exports.updateAccreditations = async (req, res) => {
    try {
        const { accreditations } = req.body;

        // Delete all existing accreditations
        await Accreditation.deleteMany({});

        // Insert new accreditations
        const newAccreditations = await Accreditation.insertMany(accreditations);

        return successResponse(res, { accreditations: newAccreditations }, 'Accreditations updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};