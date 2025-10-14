const { successResponse, errorResponse } = require('../../utils/response');
const Institution = require('../../models/Instituion.model');

exports.getInstitutionsSummary = async (req, res) => {
    try {
        const institutions = await Institution.find({}, 'name image shortDescription'); // Select only summary fields

        const summary = institutions.map(inst => ({
            id: inst._id,
            name: inst.name,
            image: inst.image,
            description: inst.shortDescription,
        }));

        return successResponse(res, { institutions: summary });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};



exports.getInstitutionInfo = async (req, res) => {
    try {
        const { identifier } = req.params;

        // Try finding by ID
        const institution = await Institution.findOne({ _id: identifier });

        if (!institution) {
            return errorResponse(res, 'Institution not found', 404);
        }

        return successResponse(res, { institution });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

