const Institution = require('../../models/Instituion.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { getReadableMessage } = require('../../utils/error-messages');

// Create or Update Institution
exports.createOrUpdateInstitution = async (req, res) => {
    try {
        const { _id } = req.body;

        let imageUrl = '';
        let coverImageUrl = '';

        // Handle file uploads if present
        if (req.files?.image?.[0]) {
            imageUrl = await uploadToS3(req.files.image[0], 'institutions');
        }

        if (req.files?.coverImage?.[0]) {
            coverImageUrl = await uploadToS3(req.files.coverImage[0], 'institutions');
        }

        const institutionData = {
            ...req.body,
        };

        delete institutionData._id; // Prevent direct _id overwrite

        let existingInstitution;

        if (_id) {
            existingInstitution = await Institution.findById(_id);
            if (!existingInstitution) {
                return errorResponse(res, 'Institution not found for update', 404);
            }
        }

        // Manage image update logic
        if (imageUrl) {
            institutionData.image = imageUrl;
            if (_id && existingInstitution?.image) {
                await deleteFromS3(existingInstitution.image);
            }
        } else if (_id) {
            institutionData.image = existingInstitution?.image || '';
        } else {
            institutionData.image = '';
        }

        // Manage coverImage update logic
        if (coverImageUrl) {
            institutionData.coverImage = coverImageUrl;
            if (_id && existingInstitution?.coverImage) {
                await deleteFromS3(existingInstitution.coverImage);
            }
        } else if (_id) {
            institutionData.coverImage = existingInstitution?.coverImage || '';
        } else {
            institutionData.coverImage = '';
        }

        let resultInstitution;

        if (_id) {
            resultInstitution = await Institution.findByIdAndUpdate(
                _id,
                {
                    ...institutionData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            const newInstitution = new Institution(institutionData);
            resultInstitution = await newInstitution.save();
        }

        const message = _id
            ? 'Institution updated successfully'
            : 'Institution created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { institution: resultInstitution }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get all Institutions
exports.getAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find().sort({ createdAt: -1 });
        return successResponse(res, { institutions }, 'Institutions fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get Institution by ID
exports.getInstitutionById = async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);
        if (!institution) return errorResponse(res, 'Institution not found', 404);
        return successResponse(res, institution, 'Institution fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete Institution
exports.deleteInstitution = async (req, res) => {
    try {
        const institution = await Institution.findByIdAndDelete(req.params.id);
        if (!institution) return errorResponse(res, 'Institution not found', 404);

        // Delete image from S3 if exists
        if (institution.image) {
            await deleteFromS3(institution.image);
        }

        return successResponse(res, null, 'Institution deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
