const Facility = require('../../models/Facility.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { getReadableMessage } = require('../../utils/error-messages');

// Create or Update Facility
exports.createOrUpdateFacility = async (req, res) => {
    try {
        const { _id } = req.body;

        // Handle image upload
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToS3(req.file, 'facilities');
        }

        const facilityData = {
            ...req.body,
        };

        delete facilityData._id; // Prevent _id overwrite

        let existingFacility;
        if (_id) {
            existingFacility = await Facility.findById(_id);
            if (!existingFacility) {
                return errorResponse(res, 'Facility not found for update', 404);
            }
        }

        if (req.file) {
            facilityData.image = imageUrl;

            // Delete old image from S3 if updating
            if (_id && existingFacility?.image) {
                await deleteFromS3(existingFacility.image);
            }
        } else if (_id) {
            facilityData.image = existingFacility?.image || '';
        } else {
            facilityData.image = '';
        }

        let resultFacility;

        if (_id) {
            // Update existing
            resultFacility = await Facility.findByIdAndUpdate(
                _id,
                {
                    ...facilityData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            // Create new
            const newFacility = new Facility(facilityData);
            resultFacility = await newFacility.save();
        }

        const message = _id
            ? 'Facility updated successfully'
            : 'Facility created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { facility: resultFacility }, message, statusCode);
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get All Facilities
exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ createdAt: -1 });
        return successResponse(res, { facilities }, 'Facilities fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error));
    }
};

// Get Facility by ID
exports.getFacilityById = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) return errorResponse(res, 'Facility not found', 404);
        return successResponse(res, { facility }, 'Facility fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error));
    }
};

// Delete Facility
exports.deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.findByIdAndDelete(req.params.id);
        if (!facility) return errorResponse(res, 'Facility not found', 404);

        // Delete associated image from S3
        if (facility.image) {
            await deleteFromS3(facility.image);
        }

        return successResponse(res, { facility }, 'Facility deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error));
    }
};
