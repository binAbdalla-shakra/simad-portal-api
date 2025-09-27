
const School = require('../../models/school.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all schools
exports.getAllSchools = async (req, res) => {
    try {

        const schools = await School.find({})
            .populate('dean', 'name')
            .populate('category', 'name')
            .sort({ order: 1 });

        return successResponse(res, { schools });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single school by ID
exports.getSchoolById = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findById(id)
            .populate('dean', 'name')
            .populate('category', 'name');

        if (!school) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, { school });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create new school
exports.createSchool = async (req, res) => {
    try {
        const schoolData = req.body;

        // Check if school with same name already exists
        const existingSchool = await School.findOne({
            name: schoolData.name
        });

        if (existingSchool) {
            return errorResponse(res, 'School with this name already exists', 400);
        }

        const newSchool = new School(schoolData);
        await newSchool.save();

        // await newSchool.populate('category');

        return successResponse(res, { school: newSchool }, 'School created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update school
exports.updateSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const school = await School.findById(id);
        if (!school) {
            return errorResponse(res, 'School not found', 404);
        }

        // If name is being updated, check for duplicates
        if (updateData.name && updateData.name !== school.name) {
            const existingSchool = await School.findOne({
                name: updateData.name,
                _id: { $ne: id }
            });

            if (existingSchool) {
                return errorResponse(res, 'Another school with this name already exists', 400);
            }
        }

        const updatedSchool = await School.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('dean category');

        return successResponse(res, { school: updatedSchool }, 'School updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete school (soft delete)
exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;

        const school = await School.findByIdAndDelete(id);

        if (!school) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, null, 'School deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
