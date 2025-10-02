const Program = require('../../models/program.model');
const { deleteFromS3, uploadToS3 } = require('../../service/upload.service');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all programs with optional filtering
exports.getAllPrograms = async (req, res) => {
    try {

        const programs = await Program.find({})
            .populate('school', 'name')
            .sort({ order: 1 });

        return successResponse(res, { programs });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single program by ID
exports.getProgramById = async (req, res) => {
    try {
        const { id } = req.params;
        const program = await Program.findById(id);

        if (!program) {
            return errorResponse(res, 'Program not found', 404);
        }

        return successResponse(res, { program });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.createOrUpdateProgram = async (req, res) => {
    try {
        const { _id, name } = req.body;

        let coverImageUrl = '';

        if (req.file) {
            // Upload new cover image first
            coverImageUrl = await uploadToS3(req.file, 'programs/covers');
        }

        const programData = {
            ...req.body,
        };

        delete programData._id;

        let existingProgram;

        if (_id) {
            // Fetch existing program to get old cover image URL
            existingProgram = await Program.findById(_id);
            if (!existingProgram) {
                return errorResponse(res, 'Program not found', 404);
            }

            // Check for duplicate name excluding current program
            const duplicate = await Program.findOne({ name, _id: { $ne: _id } });
            if (duplicate) {
                return errorResponse(res, 'Another program with this name already exists', 400);
            }
        } else {
            // On create, check duplicate name
            const existingName = await Program.findOne({ name });
            if (existingName) {
                return errorResponse(res, 'Program with this name already exists', 400);
            }
        }

        // Handle cover image URL update and possible deletion of old image
        if (req.file) {
            // New image uploaded, set new URL
            programData.coverImage = coverImageUrl;

            // Delete old image if updating
            if (_id && existingProgram.coverImage) {
                await deleteFromS3(existingProgram.coverImage);
            }
        } else if (_id) {
            // No new image uploaded, keep old one
            programData.coverImage = existingProgram.coverImage || '';
        } else {
            // Create without image
            programData.coverImage = '';
        }

        let resultProgram;

        if (_id) {
            // UPDATE
            resultProgram = await Program.findByIdAndUpdate(
                _id,
                {
                    ...programData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            // CREATE
            const newProgram = new Program(programData);
            resultProgram = await newProgram.save();
        }

        const message = _id
            ? 'Program updated successfully'
            : 'Program created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { program: resultProgram }, message, statusCode);

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


// Delete program (soft delete)
exports.deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const program = await Program.findByIdAndDelete(id);
        if (!program) {
            return errorResponse(res, 'Program not found', 404);
        }

        return successResponse(res, null, 'Program deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
