const Department = require('../models/Department.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const { school, isActive = true } = req.query;

        const filter = { isActive };
        if (school) filter.school = school;

        const departments = await Department.find(filter)
            .populate('school', 'name')
            .populate('head', 'name title')
            .sort({ order: 1 });

        return successResponse(res, { departments });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id)
            .populate('school', 'name')
            .populate('head', 'name title email phone');

        if (!department) {
            return errorResponse(res, 'Department not found', 404);
        }

        return successResponse(res, { department });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create new department
exports.createDepartment = async (req, res) => {
    try {
        const departmentData = req.body;

        // Check if department with same name in same school already exists
        const existingDepartment = await Department.findOne({
            name: departmentData.name,
            school: departmentData.school,
            isActive: true
        });

        if (existingDepartment) {
            return errorResponse(res, 'Department with this name already exists in this school', 400);
        }

        const newDepartment = new Department(departmentData);
        await newDepartment.save();

        await newDepartment.populate('school head');

        return successResponse(res, { department: newDepartment }, 'Department created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update department
exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const department = await Department.findById(id);
        if (!department) {
            return errorResponse(res, 'Department not found', 404);
        }

        // If name or school is being updated, check for duplicates
        if ((updateData.name && updateData.name !== department.name) ||
            (updateData.school && updateData.school !== department.school.toString())) {

            const filter = {
                name: updateData.name || department.name,
                school: updateData.school || department.school,
                isActive: true,
                _id: { $ne: id }
            };

            const existingDepartment = await Department.findOne(filter);

            if (existingDepartment) {
                return errorResponse(res, 'Another department with this name already exists in this school', 400);
            }
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('school head');

        return successResponse(res, { department: updatedDepartment }, 'Department updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete department (soft delete)
exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await Department.findByIdAndDelete(id);
        if (!department) {
            return errorResponse(res, 'Department not found', 404);
        }

        return successResponse(res, null, 'Department deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// // Get departments by school
// exports.getDepartmentsBySchool = async (req, res) => {
//     try {
//         const { schoolId } = req.params;
//         const { isActive = true } = req.query;

//         const departments = await Department.find({
//             school: schoolId,
//             isActive
//         })
//             .populate('head', 'name title')
//             .populate('programs', 'name')
//             .sort({ order: 1 });

//         return successResponse(res, { departments });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Add specialization to department
// exports.addSpecialization = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { specialization } = req.body;

//         const department = await Department.findById(id);
//         if (!department) {
//             return errorResponse(res, 'Department not found', 404);
//         }

//         if (!department.specializations.includes(specialization)) {
//             department.specializations.push(specialization);
//             await department.save();
//         }

//         return successResponse(res, { department }, 'Specialization added successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };