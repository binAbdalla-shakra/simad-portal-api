const WhySimad = require('../../models/WhySimad.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all WhySimad items
exports.getWhySimadItems = async (req, res) => {
    try {
        const items = await WhySimad.find({ isActive: true }).sort({ order: 1 });
        return successResponse(res, { items });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create or update WhySimad items in bulk
exports.updateWhySimadItems = async (req, res) => {
    try {
        const { items } = req.body;

        // Delete all existing items
        await WhySimad.deleteMany({});

        // Insert new items
        const newItems = await WhySimad.insertMany(items);

        return successResponse(res, { items: newItems }, 'Why SIMAD items updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};