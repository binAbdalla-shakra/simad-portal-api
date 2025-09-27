const Fact = require('../models/Fact.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all facts with optional filtering
exports.getAllFacts = async (req, res) => {
    try {
        const {
            school,
            department,
            program,
            isActive = true
        } = req.query;

        const filter = { isActive };
        if (school) filter.school = school;
        if (department) filter.department = department;
        if (program) filter.program = program;

        const facts = await Fact.find(filter)
            .populate('school', 'name')
            .populate('department', 'name')
            .populate('program', 'name')
            .sort({ order: 1 });

        return successResponse(res, { facts });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single fact by ID
exports.getFactById = async (req, res) => {
    try {
        const { id } = req.params;
        const fact = await Fact.findById(id)
            .populate('school', 'name')
            .populate('department', 'name')
            .populate('program', 'name');

        if (!fact) {
            return errorResponse(res, 'Fact not found', 404);
        }

        return successResponse(res, { fact });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Create new fact
exports.createFact = async (req, res) => {
    try {
        const factData = req.body;

        const newFact = new Fact(factData);
        await newFact.save();

        await newFact.populate('school department program');

        return successResponse(res, { fact: newFact }, 'Fact created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update fact
exports.updateFact = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const fact = await Fact.findById(id);
        if (!fact) {
            return errorResponse(res, 'Fact not found', 404);
        }

        const updatedFact = await Fact.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('school department program');

        return successResponse(res, { fact: updatedFact }, 'Fact updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete fact (soft delete)
exports.deleteFact = async (req, res) => {
    try {
        const { id } = req.params;

        const fact = await Fact.findById(id);
        if (!fact) {
            return errorResponse(res, 'Fact not found', 404);
        }

        fact.isActive = false;
        await fact.save();

        return successResponse(res, null, 'Fact deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get facts by school
exports.getFactsBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { isActive = true } = req.query;

        const facts = await Fact.find({
            school: schoolId,
            isActive
        })
            .populate('department', 'name')
            .populate('program', 'name')
            .sort({ order: 1 });

        return successResponse(res, { facts });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get facts by department
exports.getFactsByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { isActive = true } = req.query;

        const facts = await Fact.find({
            department: departmentId,
            isActive
        })
            .populate('school', 'name')
            .populate('program', 'name')
            .sort({ order: 1 });

        return successResponse(res, { facts });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Bulk update facts order
exports.bulkUpdateFacts = async (req, res) => {
    try {
        const { facts } = req.body;

        const bulkOperations = facts.map(fact => ({
            updateOne: {
                filter: { _id: fact._id },
                update: { $set: { order: fact.order } }
            }
        }));

        await Fact.bulkWrite(bulkOperations);

        return successResponse(res, null, 'Facts order updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};