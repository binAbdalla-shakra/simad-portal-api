const Staff = require('../../models/Staff.model');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { successResponse, errorResponse } = require('../../utils/response');

// Get all staff members with optional filtering
exports.getAllStaff = async (req, res) => {
    try {

        const staff = await Staff.find({})
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
exports.createOrUpdateStaff = async (req, res) => {
    try {
        const { _id, email } = req.body;

        // Handle photo upload
        let photoUrl = '';
        if (req.file) {
            photoUrl = await uploadToS3(req.file, 'staff');
        }

        const staffData = {
            ...req.body,
        };

        delete staffData._id;

        let existingStaff;

        if (_id) {
            // Fetch existing staff for old photo URL
            existingStaff = await Staff.findById(_id);
            if (!existingStaff) {
                return errorResponse(res, 'Staff member not found', 404);
            }

            // Prevent duplicate email on update
            const duplicate = await Staff.findOne({ email, _id: { $ne: _id } });
            if (duplicate) {
                return errorResponse(res, 'Another staff member with this email already exists', 400);
            }
        } else {
            // Prevent duplicate email on create
            const existing = await Staff.findOne({ email });
            if (existing) {
                return errorResponse(res, 'Staff member with this email already exists', 400);
            }
        }

        if (req.file) {
            staffData.photoUrl = photoUrl;

            // Delete old photo from S3 if updating
            if (_id && existingStaff?.photoUrl) {
                await deleteFromS3(existingStaff.photoUrl);
            }
        } else if (_id) {
            staffData.photoUrl = existingStaff?.photoUrl || '';
        } else {
            staffData.photoUrl = '';
        }

        let resultStaff;

        if (_id) {
            // UPDATE
            resultStaff = await Staff.findByIdAndUpdate(
                _id,
                {
                    ...staffData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            // CREATE
            const newStaff = new Staff(staffData);
            resultStaff = await newStaff.save();
        }

        const message = _id
            ? 'Staff member updated successfully'
            : 'Staff member created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { staff: resultStaff }, message, statusCode);

    } catch (error) {
        console.log("error", error);
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

