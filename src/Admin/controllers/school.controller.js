
const School = require('../../models/school.model');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all schools
exports.getAllSchools = async (req, res) => {
    try {

        const schools = await School.find({})
            .populate('dean', 'name')
            .populate('category', 'name')
            .sort({ order: 1 });

        return successResponse(res, { schools });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single school by ID
exports.getSchoolById = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findById(id)
            .populate('dean', 'name')
            .populate('category', 'name');

        if (!school) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, { school });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.createOrUpdateSchool = async (req, res) => {
    try {
        const { _id, name } = req.body;

        // Handle file uploads
        let logoUrl = '';
        let coverImageUrl = '';

        if (req.files?.logo) {
            logoUrl = await uploadToS3(req.files.logo[0], 'schools/logos');
        }

        if (req.files?.coverImage) {
            coverImageUrl = await uploadToS3(req.files.coverImage[0], 'schools/covers');
        }

        const schoolData = {
            ...req.body,
        };

        delete schoolData._id;

        let existingSchool;

        if (_id) {
            // Fetch existing school for old images
            existingSchool = await School.findById(_id);
            if (!existingSchool) {
                return errorResponse(res, 'School not found', 404);
            }

            // Prevent duplicate school name during update
            const duplicate = await School.findOne({
                name,
                _id: { $ne: _id }
            });
            if (duplicate) {
                return errorResponse(res, 'Another school with this name already exists', 400);
            }
        } else {
            // Prevent duplicate school name during creation
            const existing = await School.findOne({ name });
            if (existing) {
                return errorResponse(res, 'School with this name already exists', 400);
            }
        }

        // Logo handling with old image deletion
        if (req.files?.logo) {
            schoolData.logoUrl = logoUrl;

            // Delete old logo from S3 if updating
            if (_id && existingSchool?.logoUrl) {
                await deleteFromS3(existingSchool.logoUrl);
            }
        } else if (_id) {
            schoolData.logoUrl = existingSchool?.logoUrl || '';
        } else {
            schoolData.logoUrl = '';
        }

        // Cover image handling with old image deletion
        if (req.files?.coverImage) {
            schoolData.coverImage = coverImageUrl;

            // Delete old cover image from S3 if updating
            if (_id && existingSchool?.coverImage) {
                await deleteFromS3(existingSchool.coverImage);
            }
        } else if (_id) {
            schoolData.coverImage = existingSchool?.coverImage || '';
        } else {
            schoolData.coverImage = '';
        }

        let resultSchool;

        if (_id) {
            // UPDATE
            resultSchool = await School.findByIdAndUpdate(
                _id,
                {
                    ...schoolData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );

            if (!resultSchool) {
                return errorResponse(res, 'School not found', 404);
            }
        } else {
            // CREATE
            const newSchool = new School(schoolData);
            resultSchool = await newSchool.save();
        }

        const message = _id
            ? 'School updated successfully'
            : 'School created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { school: resultSchool }, message, statusCode);

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};



// Delete school (soft delete)
exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;

        const school = await School.findByIdAndDelete(id);

        if (!school) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, null, 'School deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
