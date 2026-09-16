const ProgramCategory = require('../../models/ProgramCategory.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Get all program categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await ProgramCategory.find({}).sort({ order: 1 });
        return successResponse(res, { categories });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};


// Get single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ProgramCategory.findById(id);

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        return successResponse(res, { category });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const categoryData = req.body;

        // Check if name already exists
        const existingCategory = await ProgramCategory.findOne({
            name: categoryData.name,
            isActive: true
        });

        if (existingCategory) {
            return errorResponse(res, 'Category with this name already exists', 400);
        }

        const newCategory = new ProgramCategory(categoryData);
        await newCategory.save();

        return successResponse(res, { category: newCategory }, 'Category created successfully', 201);
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const category = await ProgramCategory.findById(id);
        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        // If name is being updated, check for duplicates
        if (updateData.name && updateData.name !== category.name) {
            const existingCategory = await ProgramCategory.findOne({
                name: updateData.name,
                isActive: true,
                _id: { $ne: id }
            });

            if (existingCategory) {
                return errorResponse(res, 'Another category with this name already exists', 400);
            }
        }

        const updatedCategory = await ProgramCategory.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return successResponse(res, { category: updatedCategory }, 'Category updated successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete category (soft delete)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;


        const category = await ProgramCategory.findByIdAndDelete(id);

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};


