const University = require('../../models/University.model');
const WhySimad = require('../../models/WhySimad.model');
const History = require('../../models/History.model');
const Senate = require('../../models/Senate.model');
const Accreditation = require('../../models/Accreditation.model');
const { successResponse, errorResponse } = require('../../utils/response');
// Get all university data
exports.getAllUniversityData = async (req, res) => {
    try {
        const university = await University.findOne({});
        const whySimadItems = await WhySimad.find({ isActive: true }).sort({ order: 1 });
        const historyItems = await History.find({ isActive: true }).sort({ year: -1 });
        const senateMembers = await Senate.find({ isActive: true }).sort({ order: 1 });
        const accreditations = await Accreditation.find({ isActive: true }).sort({ order: 1 });

        return successResponse(res, {
            university,
            whySimadItems,
            historyItems,
            senateMembers,
            accreditations
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
