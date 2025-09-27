const Program = require('../../models/program.model');
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

// Create new program
exports.createProgram = async (req, res) => {
    try {
        const programData = req.body;

        // Check if program with same name already exists
        const existingProgram = await Program.findOne({
            name: programData.name
        });

        if (existingProgram) {
            return errorResponse(res, 'Program with this name already exists', 400);
        }

        const newProgram = new Program(programData);
        await newProgram.save();

        return successResponse(res, { program: newProgram }, 'Program created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update program
exports.updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const program = await Program.findById(id);
        if (!program) {
            return errorResponse(res, 'Program not found', 404);
        }

        // If name is being updated, check for duplicates
        if (updateData.name && updateData.name !== program.name) {
            const existingProgram = await Program.findOne({
                name: updateData.name,
                _id: { $ne: id }
            });

            if (existingProgram) {
                return errorResponse(res, 'Another program with this name already exists', 400);
            }
        }

        const updatedProgram = await Program.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return successResponse(res, { program: updatedProgram }, 'Program updated successfully');
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
