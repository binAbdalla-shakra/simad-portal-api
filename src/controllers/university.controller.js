const University = require('../models/University.model');
const { successResponse, errorResponse } = require('../utils/response');
const { ApiError } = require('../utils/error-handler');

// Create University
exports.createUniversity = async (req, res) => {
    try {
        const university = await University.create(req.body);
        return successResponse(res, { university }, 'University created successfully', 201);
    } catch (error) {

        return errorResponse(res, error.message, 500);
    }
};

// Get  University Info
exports.getUniversityInfo = async (req, res) => {
    try {

        const universityInfo = await University.findOne({});
        return successResponse(res, { universityInfo });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


// Update University
exports.updateUniversity = async (req, res) => {
    try {
        const university = await University.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true }
        );

        if (!university) {
            return errorResponse(res, 'University not found', 404);
        }

        return successResponse(res, { university }, 'University updated successfully');
    } catch (error) {

        return errorResponse(res, error.message, 500);
    }
};

