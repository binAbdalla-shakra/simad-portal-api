const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    // Link to the parent school
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    // Department head (staff member)
    head: {
        type: Schema.Types.ObjectId,
        ref: 'Staff'
    },
    // Contact information for department
    contactInfo: {
        phone: String,
        email: String,
        location: String
    },
    // Specializations offered
    specializations: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }
}, { timestamps: true });





const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;