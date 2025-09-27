const Staff = require('../../models/Staff.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all staff members with optional filtering
exports.getAllStaff = async (req, res) => {
    try {
        const {
            school,
            department,
            role,
            isActive = true,
            isResearchContributor
        } = req.query;

        // Build filter object
        const filter = { isActive };

        if (school) filter.school = school;
        if (department) filter.department = department;
        if (role) filter.role = role;
        if (isResearchContributor !== undefined) {
            filter.isResearchContributor = isResearchContributor === 'true';
        }

        const staff = await Staff.find(filter)
            .populate('school', 'name')
            .populate('department', 'name')
            .sort({ order: 1, createdAt: -1 });

        return successResponse(res, { staff });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single staff member by ID
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findById(id)
            .populate('school', 'name')
            .populate('department', 'name');
        if (!staff) {
            return errorResponse(res, 'Staff member not found', 404);
        }

        return successResponse(res, { staff });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create new staff member
exports.createStaff = async (req, res) => {
    try {
        const staffData = req.body;

        // Check if email already exists
        const existingStaff = await Staff.findOne({
            email: staffData.email,
            isActive: true
        });

        if (existingStaff) {
            return errorResponse(res, 'Staff member with this email already exists', 400);
        }

        const newStaff = new Staff(staffData);
        await newStaff.save();

        // Populate references after save
        await newStaff.populate('school department');

        return successResponse(res, { staff: newStaff }, 'Staff member created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update staff member
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const staff = await Staff.findById(id);
        if (!staff) {
            return errorResponse(res, 'Staff member not found', 404);
        }

        // If email is being updated, check for duplicates
        if (updateData.email && updateData.email !== staff.email) {
            const existingStaff = await Staff.findOne({
                email: updateData.email,
                isActive: true,
                _id: { $ne: id }
            });

            if (existingStaff) {
                return errorResponse(res, 'Another staff member with this email already exists', 400);
            }
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('school department');

        return successResponse(res, { staff: updatedStaff }, 'Staff member updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete staff member (soft delete by setting isActive to false)
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findByIdAndDelete(id);
        if (!staff) {
            return errorResponse(res, 'Staff member not found', 404);
        }

        return successResponse(res, null, 'Staff member deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Bulk update staff members (for reordering, etc.)
// exports.bulkUpdateStaff = async (req, res) => {
//     try {
//         const { updates } = req.body;

//         const bulkOperations = updates.map(update => ({
//             updateOne: {
//                 filter: { _id: update.id },
//                 update: { $set: update.data }
//             }
//         }));

//         await Staff.bulkWrite(bulkOperations);

//         return successResponse(res, null, 'Staff members updated successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Get staff by role
// exports.getStaffByRole = async (req, res) => {
//     try {
//         const { role } = req.params;
//         const { isActive = true } = req.query;

//         const staff = await Staff.find({
//             role,
//             isActive
//         })
//             .populate('school', 'name')
//             .populate('department', 'name')
//             .sort({ order: 1 });

//         return successResponse(res, { staff });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Get staff by school/department
// exports.getStaffByOrganization = async (req, res) => {
//     try {
//         const { schoolId, departmentId } = req.query;
//         const { isActive = true } = req.query;

//         const filter = { isActive };

//         if (schoolId) filter.school = schoolId;
//         if (departmentId) filter.department = departmentId;

//         const staff = await Staff.find(filter)
//             .populate('school', 'name')
//             .populate('department', 'name')
//             .populate('programs', 'name')
//             .sort({ order: 1 });

//         return successResponse(res, { staff });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Get research contributors
// exports.getResearchContributors = async (req, res) => {
//     try {
//         const { isActive = true } = req.query;

//         const staff = await Staff.find({
//             isResearchContributor: true,
//             isActive
//         })
//             .populate('school', 'name')
//             .populate('department', 'name')
//             .populate('programs', 'name')
//             .sort({ order: 1 });

//         return successResponse(res, { staff });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Add publication to staff member
// exports.addPublication = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const publication = req.body;

//         const staff = await Staff.findById(id);
//         if (!staff) {
//             return errorResponse(res, 'Staff member not found', 404);
//         }

//         staff.publications.push(publication);
//         await staff.save();

//         return successResponse(res, { staff }, 'Publication added successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Update publication
// exports.updatePublication = async (req, res) => {
//     try {
//         const { id, publicationId } = req.params;
//         const updateData = req.body;

//         const staff = await Staff.findById(id);
//         if (!staff) {
//             return errorResponse(res, 'Staff member not found', 404);
//         }

//         const publication = staff.publications.id(publicationId);
//         if (!publication) {
//             return errorResponse(res, 'Publication not found', 404);
//         }

//         publication.set(updateData);
//         await staff.save();

//         return successResponse(res, { staff }, 'Publication updated successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Remove publication
// exports.removePublication = async (req, res) => {
//     try {
//         const { id, publicationId } = req.params;

//         const staff = await Staff.findById(id);
//         if (!staff) {
//             return errorResponse(res, 'Staff member not found', 404);
//         }

//         staff.publications.pull(publicationId);
//         await staff.save();

//         return successResponse(res, { staff }, 'Publication removed successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Similar methods can be created for other nested arrays like:
// // addExperience, updateExperience, removeExperience
// // addEducation, updateEducation, removeEducation
// // addAward, updateAward, removeAward

// // Search staff members
// exports.searchStaff = async (req, res) => {
//     try {
//         const { query, isActive = true } = req.query;

//         if (!query) {
//             return errorResponse(res, 'Search query is required', 400);
//         }

//         const staff = await Staff.find({
//             isActive,
//             $or: [
//                 { name: { $regex: query, $options: 'i' } },
//                 { title: { $regex: query, $options: 'i' } },
//                 { email: { $regex: query, $options: 'i' } },
//                 { 'researchInterests': { $regex: query, $options: 'i' } }
//             ]
//         })
//             .populate('school', 'name')
//             .populate('department', 'name')
//             .populate('programs', 'name')
//             .sort({ order: 1 });

//         return successResponse(res, { staff });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };