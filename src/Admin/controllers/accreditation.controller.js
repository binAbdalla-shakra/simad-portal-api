const Accreditation = require('../../models/Accreditation.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { getReadableMessage } = require('../../utils/error-messages');

// Create or Update Accreditation
exports.createOrUpdateAccreditation = async (req, res) => {
    try {
        const { _id } = req.body;

        console.log("req.body", req.body)

        let logoUrl = '';
        if (req.file) {
            logoUrl = await uploadToS3(req.file, 'accreditations');
        }

        const accreditationData = {
            ...req.body,
        };

        delete accreditationData._id;

        let existingAccreditation;

        if (_id) {
            existingAccreditation = await Accreditation.findById(_id);
            if (!existingAccreditation) {
                return errorResponse(res, 'Accreditation not found for update', 404);
            }
        }

        if (req.file) {
            accreditationData.logo = logoUrl;

            // Delete old logo if updating
            if (_id && existingAccreditation?.logo) {
                await deleteFromS3(existingAccreditation.logo);
            }
        } else if (_id) {
            accreditationData.logo = existingAccreditation?.logo || '';
        } else {
            accreditationData.logo = '';
        }

        let resultAccreditation;

        if (_id) {
            resultAccreditation = await Accreditation.findByIdAndUpdate(
                _id,
                {
                    ...accreditationData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            const newAccreditation = new Accreditation(accreditationData);
            resultAccreditation = await newAccreditation.save();
        }

        const message = _id
            ? 'Accreditation updated successfully'
            : 'Accreditation created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { accreditation: resultAccreditation }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get All Accreditations
exports.getAllAccreditations = async (req, res) => {
    try {
        const accreditations = await Accreditation.find().sort({ order: 1 });
        return successResponse(res, { accreditations }, 'Accreditations fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get Accreditation by ID
exports.getAccreditationById = async (req, res) => {
    try {
        const accreditation = await Accreditation.findById(req.params.id);
        if (!accreditation) return errorResponse(res, 'Accreditation not found', 404);
        return successResponse(res, accreditation, 'Accreditation fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete Accreditation
exports.deleteAccreditation = async (req, res) => {
    try {
        const accreditation = await Accreditation.findByIdAndDelete(req.params.id);
        if (!accreditation) return errorResponse(res, 'Accreditation not found', 404);

        if (accreditation.logo) {
            await deleteFromS3(accreditation.logo);
        }

        return successResponse(res, null, 'Accreditation deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
