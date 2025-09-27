const ProgramCategory = require('../../models/ProgramCategory.model');
const { successResponse, errorResponse } = require('../../utils/response');



exports.getProgramCategories = async (req, res) => {
    try {
        const categories = await ProgramCategory.find({}).sort({ order: 1 }).select('name');
        return successResponse(res, { categories });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
