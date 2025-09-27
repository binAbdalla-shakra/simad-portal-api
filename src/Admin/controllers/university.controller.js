
const University = require('../../models/University.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Get university information
exports.getUniversityInfo = async (req, res) => {
    try {
        const university = await University.findOne({});

        if (!university) {
            return errorResponse(res, 'University information not found', 404);
        }

        return successResponse(res, { university });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create or update university information
exports.updateUniversity = async (req, res) => {
    try {
        let university = await University.findOne({});

        if (university) {
            // Update existing university
            university = await University.findOneAndUpdate(
                {},
                req.body,
                { new: true, runValidators: true }
            );
        } else {
            // Create new university
            university = await University.create(req.body);
        }

        return successResponse(res, { university }, 'University information updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};