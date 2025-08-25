
const School = require('../models/school.model');
const { successResponse, errorResponse } = require('../utils/response');

// Get all schools
exports.getAllSchools = async (req, res) => {
    try {
        const { isActive, search } = req.query;


        const filter = {};

        // apply status filter only if provided
        if (isActive !== undefined && isActive !== "") {
            filter.isActive = isActive === 'true'; // query comes as string
        }

        // optional search filter
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const schools = await School.find(filter)
            // .populate('dean', 'name title')
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
            // .populate('dean', 'name title email phone')
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
            name: schoolData.name,
            isActive: true
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
                isActive: true,
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

// // Add facility to school
// exports.addFacility = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const facility = req.body;

//         const school = await School.findById(id);
//         if (!school) {
//             return errorResponse(res, 'School not found', 404);
//         }

//         school.facilities.push(facility);
//         await school.save();

//         return successResponse(res, { school }, 'Facility added successfully');
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

// // Get schools with programs count
// exports.getSchoolsWithStats = async (req, res) => {
//     try {
//         const schools = await School.find({ isActive: true })
//             .populate({
//                 path: 'programs',
//                 match: { isActive: true },
//                 select: 'name'
//             })
//             .sort({ order: 1 });

//         const schoolsWithStats = schools.map(school => ({
//             ...school.toObject(),
//             programCount: school.programs.length
//         }));

//         return successResponse(res, { schools: schoolsWithStats });
//     } catch (error) {
//         return errorResponse(res, error.message, 500);
//     }
// };

