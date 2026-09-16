const Partner = require('../../models/partners.model');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Create Partner
exports.createorUpdatePartner = async (req, res) => {
    try {
        const { _id } = req.body;

        // Handle file upload (e.g. partner logo)
        let logoUrl = '';
        if (req.file) {
            logoUrl = await uploadToS3(req.file, 'partners');
        }

        const partnerData = {
            ...req.body,
        };

        delete partnerData._id; // Prevent accidental overwrite of _id

        let existingPartner;
        if (_id) {
            existingPartner = await Partner.findById(_id);
            if (!existingPartner) {
                return errorResponse(res, 'Partner not found for update', 404);
            }
        }

        if (req.file) {
            // New file uploaded – use the new logo
            partnerData.logo = logoUrl;

            // Delete old logo from S3 if updating
            if (_id && existingPartner?.logo) {
                await deleteFromS3(existingPartner.logo);
            }
        } else if (_id) {
            // Update without new file – retain existing logo
            partnerData.logo = existingPartner?.logo || '';
        } else {
            // Create without logo
            partnerData.logo = '';
        }

        let resultPartner;

        if (_id) {
            // UPDATE operation
            resultPartner = await Partner.findByIdAndUpdate(
                _id,
                {
                    ...partnerData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );

            if (!resultPartner) {
                return errorResponse(res, 'Partner not found for update', 404);
            }

        } else {
            // CREATE operation
            const newPartner = new Partner(partnerData);
            resultPartner = await newPartner.save();
        }

        const message = _id
            ? 'Partner updated successfully'
            : 'Partner created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { partner: resultPartner }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};



// Get All Partners
exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.find().populate('category');
        return successResponse(res, { partners });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get Single Partner
exports.getPartnerById = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id).populate('category');
        if (!partner) return errorResponse(res, 'Partner not found', 404);
        return successResponse(res, { partner });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Update Partner
exports.updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!partner) return errorResponse(res, 'Partner not found', 404);
        return successResponse(res, { partner });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete Partner
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        if (!partner) return errorResponse(res, 'Partner not found', 404);

        if (partner.logo) {
            await deleteFromS3(partner.logo);
        }
        return successResponse(res, null, "Partner deleted successfully");
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
