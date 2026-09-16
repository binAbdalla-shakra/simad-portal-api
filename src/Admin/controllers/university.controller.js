const University = require('../../models/University.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { getReadableMessage } = require('../../utils/error-messages');

// Create or Update University
exports.createOrUpdateUniversity = async (req, res) => {
    try {
        const { _id } = req.body;

        let logoUrl = '';
        let bgUrl = '';

        if (req.files?.logo) {
            logoUrl = await uploadToS3(req.files.logo[0], 'universities/logos');
        }

        if (req.files?.backgroundImage) {
            bgUrl = await uploadToS3(req.files.backgroundImage[0], 'universities/backgrounds');
        }

        const universityData = {
            ...req.body,
        };

        delete universityData._id;

        let existingUniversity = null;

        if (_id) {
            existingUniversity = await University.findById(_id);
            if (!existingUniversity) {
                return errorResponse(res, 'University not found for update', 404);
            }
        }

        if (logoUrl) {
            universityData.logo = logoUrl;
            if (_id && existingUniversity?.logo && existingUniversity.logo !== 'university-default.png') {
                await deleteFromS3(existingUniversity.logo);
            }
        } else if (_id) {
            universityData.logo = existingUniversity?.logo;
        }

        if (bgUrl) {
            universityData.backgroundImage = bgUrl;
            if (_id && existingUniversity?.backgroundImage && existingUniversity.backgroundImage !== 'university-bg-default.jpg') {
                await deleteFromS3(existingUniversity.backgroundImage);
            }
        } else if (_id) {
            universityData.backgroundImage = existingUniversity?.backgroundImage;
        }

        let resultUniversity;

        if (_id) {
            resultUniversity = await University.findByIdAndUpdate(
                _id,
                {
                    ...universityData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            const newUniversity = new University(universityData);
            resultUniversity = await newUniversity.save();
        }

        const message = _id
            ? 'University updated successfully'
            : 'University created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { university: resultUniversity }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get All Universities
exports.getAllUniversities = async (req, res) => {
    try {
        const university = await University.find().sort({ name: 1 });
        return successResponse(res, { university }, 'Universities fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get University by ID
exports.getUniversityById = async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) return errorResponse(res, 'University not found', 404);
        return successResponse(res, university, 'University fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete University
exports.deleteUniversity = async (req, res) => {
    try {
        const university = await University.findByIdAndDelete(req.params.id);
        if (!university) return errorResponse(res, 'University not found', 404);

        if (university.logo && university.logo !== 'university-default.png') {
            await deleteFromS3(university.logo);
        }

        if (university.backgroundImage && university.backgroundImage !== 'university-bg-default.jpg') {
            await deleteFromS3(university.backgroundImage);
        }

        return successResponse(res, null, 'University deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
