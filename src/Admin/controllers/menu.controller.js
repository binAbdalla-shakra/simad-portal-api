const Menu = require('../../models/Menu.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Get all menus (flat list; frontend groups by parentId)
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        return successResponse(res, { menus }, 'Menus fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

exports.createMenu = async (req, res) => {
    try {
        const menu = new Menu(req.body);
        await menu.save();
        return successResponse(res, { menu }, 'Menu created successfully', 201);
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!menu) return errorResponse(res, 'Menu not found', 404);
        return successResponse(res, { menu }, 'Menu updated successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (!menu) return errorResponse(res, 'Menu not found', 404);
        return successResponse(res, null, 'Menu deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
