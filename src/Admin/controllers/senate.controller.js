const Senate = require('../../models/Senate.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');

// Create or Update Senate
exports.createOrUpdateSenate = async (req, res) => {
    try {
        const { _id } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToS3(req.file, 'senates');
        }

        const senateData = {
            ...req.body,
        };

        delete senateData._id;

        let existingSenate;

        if (_id) {
            existingSenate = await Senate.findById(_id);
            if (!existingSenate) {
                return errorResponse(res, 'Senate member not found for update', 404);
            }
        }

        if (req.file) {
            senateData.image = imageUrl;

            // Delete old image if updating
            if (_id && existingSenate?.image) {
                await deleteFromS3(existingSenate.image);
            }
        } else if (_id) {
            senateData.image = existingSenate?.image || '';
        } else {
            senateData.image = '';
        }

        let resultSenate;

        if (_id) {
            resultSenate = await Senate.findByIdAndUpdate(
                _id,
                {
                    ...senateData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            const newSenate = new Senate(senateData);
            resultSenate = await newSenate.save();
        }

        const message = _id
            ? 'Senate member updated successfully'
            : 'Senate member created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { senate: resultSenate }, message, statusCode);

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get All Senate Members
exports.getAllSenates = async (req, res) => {
    try {
        const senates = await Senate.find().sort({ order: 1 });
        return successResponse(res, { senates }, 'Senate members fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get Senate Member by ID
exports.getSenateById = async (req, res) => {
    try {
        const senate = await Senate.findById(req.params.id);
        if (!senate) return errorResponse(res, 'Senate member not found', 404);
        return successResponse(res, senate, 'Senate member fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete Senate Member
exports.deleteSenate = async (req, res) => {
    try {
        const senate = await Senate.findByIdAndDelete(req.params.id);
        if (!senate) return errorResponse(res, 'Senate member not found', 404);

        if (senate.image) {
            await deleteFromS3(senate.image);
        }

        return successResponse(res, null, 'Senate member deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
