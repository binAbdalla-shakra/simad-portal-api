const Partner = require('../../models/partners.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Create Partner
exports.createPartner = async (req, res) => {
    try {
        const partner = new Partner(req.body);
        await partner.save();
        return successResponse(res, { partner });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get All Partners
exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.find().populate('category');
        return successResponse(res, { partners });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get Single Partner
exports.getPartnerById = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id).populate('category');
        if (!partner) return errorResponse(res, 'Partner not found', 404);
        return successResponse(res, { partner });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update Partner
exports.updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!partner) return errorResponse(res, 'Partner not found', 404);
        return successResponse(res, { partner });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete Partner
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        if (!partner) return errorResponse(res, 'Partner not found', 404);
        return successResponse(res, null, "Partner deleted successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
