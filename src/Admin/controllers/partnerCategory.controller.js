const PartnersCategory = require('../../models/partnersCategory.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const category = new PartnersCategory(req.body);
        await category.save();
        return successResponse(res, { category });

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get All Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await PartnersCategory.find();
        return successResponse(res, { categories });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
    try {
        const category = await PartnersCategory.findById(req.params.id);
        if (!category) return errorResponse(res, 'partner category not found', 404);
        return successResponse(res, { category });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const category = await PartnersCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return errorResponse(res, 'partner category not found', 404);
        return successResponse(res, { category });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await PartnersCategory.findByIdAndDelete(req.params.id);
        if (!category) return errorResponse(res, 'partner category not found', 404);
        return successResponse(res, null, "Category deleted successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
