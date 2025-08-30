const Program = require('../models/program.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all programs with optional filtering
exports.getAllPrograms = async (req, res) => {
    try {
        const {
            category,
            school,
            department,
            isActive = true
        } = req.query;

        const filter = { isActive };
        if (category) filter.category = category;
        if (school) filter.school = school;
        if (department) filter.department = department;

        const programs = await Program.find(filter)
            .populate('department', 'name')
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
        const program = await Program.findById(id)
            .populate('department', 'name');

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
            name: programData.name,
            isActive: true
        });

        if (existingProgram) {
            return errorResponse(res, 'Program with this name already exists', 400);
        }

        const newProgram = new Program(programData);
        await newProgram.save();

        await newProgram.populate('department');

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
                isActive: true,
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
        ).populate('department');

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

// // Add curriculum item
// exports.addCurriculumItem = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const curriculumItem = req.body;

//         const program = await Program.findById(id);
//         if (!program) {
//             return errorResponse(res, 'Program not found', 404);
//         }

//         program.curriculum.push(curriculumItem);
//         await program.save();

//         return successResponse(res, { program }, 'Curriculum item added successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Add career path
// exports.addCareerPath = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const careerPath = req.body;

//         const program = await Program.findById(id);
//         if (!program) {
//             return errorResponse(res, 'Program not found', 404);
//         }

//         program.careerPaths.push(careerPath);
//         await program.save();

//         return successResponse(res, { program }, 'Career path added successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Get programs by category
// exports.getProgramsByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params;
//         const { isActive = true } = req.query;

//         const programs = await Program.find({
//             category: categoryId,
//             isActive
//         })
//             .populate('school', 'name')
//             .populate('department', 'name')
//             .sort({ order: 1 });

//         return successResponse(res, { programs });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };