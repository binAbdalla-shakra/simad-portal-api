const Staff = require('../../models/Staff.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all staff members with optional filtering
exports.getAllStaff = async (req, res) => {
    try {

        const staff = await Staff.find({})
            .populate('school', 'name')
            .sort({ createdAt: -1 });

        return successResponse(res, { staff });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single staff member by ID
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findById(id);
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
            email: staffData.email
        });

        if (existingStaff) {
            return errorResponse(res, 'Staff member with this email already exists', 400);
        }

        const newStaff = new Staff(staffData);
        await newStaff.save();

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
        );

        return successResponse(res, { staff: updatedStaff }, 'Staff member updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete staff member 
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

