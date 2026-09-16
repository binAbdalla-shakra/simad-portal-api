const Role = require('../../models/Role.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Create Role
exports.createRole = async (req, res) => {
    try {
        const roleData = req.body;

        // Check if type already exists
        const existingRole = await Role.findOne({
            type: roleData.type
        });

        if (existingRole) {
            return errorResponse(res, 'Role with this type already exists', 400);
        }

        const newRole = new Role(roleData);
        await newRole.save();

        return successResponse(res, { role: newRole }, 'Role created successfully', 201);
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get All Roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return successResponse(res, { roles });

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Update Role
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const role = await Role.findById(id);
        if (!role) {
            return errorResponse(res, 'Role not found', 404);
        }

        // If type is being updated, check for duplicates
        if (updateData.type && updateData.type !== role.type) {
            const existingRole = await Role.findOne({
                type: updateData.type,
                isActive: true,
                _id: { $ne: id }
            });

            if (existingRole) {
                return errorResponse(res, 'Another Role with this type already exists', 400);
            }
        }

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return successResponse(res, { role: updatedRole }, 'Role updated successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete Role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return errorResponse(res, 'Role not found', 404);
        }
        return successResponse(res, null, 'Role deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};


