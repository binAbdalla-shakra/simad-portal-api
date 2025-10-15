const WhySimad = require('../../models/WhySimad.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');

// Create or Update WhySimad
exports.createOrUpdateWhySimad = async (req, res) => {
    try {
        const { _id } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToS3(req.file, 'why-simad');
        }

        const data = {
            ...req.body,
        };

        delete data._id;

        let existingEntry;

        if (_id) {
            existingEntry = await WhySimad.findById(_id);
            if (!existingEntry) {
                return errorResponse(res, 'WhySimad entry not found for update', 404);
            }
        }

        if (req.file) {
            data.image = imageUrl;

            // Delete old image if updating
            if (_id && existingEntry?.image) {
                await deleteFromS3(existingEntry.image);
            }
        } else if (_id) {
            data.image = existingEntry?.image || '';
        } else {
            data.image = '';
        }

        let result;

        if (_id) {
            result = await WhySimad.findByIdAndUpdate(
                _id,
                {
                    ...data,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            const newEntry = new WhySimad(data);
            result = await newEntry.save();
        }

        const message = _id
            ? 'WhySimad entry updated successfully'
            : 'WhySimad entry created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { whySimad: result }, message, statusCode);

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get All WhySimad Entries
exports.getAllWhySimad = async (req, res) => {
    try {
        const entries = await WhySimad.find().sort({ order: 1 });
        return successResponse(res, { reasons: entries }, 'WhySimad entries fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get WhySimad by ID
exports.getWhySimadById = async (req, res) => {
    try {
        const entry = await WhySimad.findById(req.params.id);
        if (!entry) return errorResponse(res, 'WhySimad entry not found', 404);
        return successResponse(res, entry, 'WhySimad entry fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete WhySimad Entry
exports.deleteWhySimad = async (req, res) => {
    try {
        const entry = await WhySimad.findByIdAndDelete(req.params.id);
        if (!entry) return errorResponse(res, 'WhySimad entry not found', 404);

        if (entry.image) {
            await deleteFromS3(entry.image);
        }

        return successResponse(res, null, 'WhySimad entry deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
