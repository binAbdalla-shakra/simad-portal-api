const { successResponse, errorResponse } = require('../../utils/response');
const Facility = require('../../models/Facility.model');


// get facilities
exports.getFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ createdAt: -1 })
            .select('name image description');
        return successResponse(res, facilities, 'Facilities fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};