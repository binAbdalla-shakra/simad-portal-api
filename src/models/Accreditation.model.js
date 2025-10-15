const mongoose = require('mongoose');

const accreditationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
    },
    validity: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Accreditation', accreditationSchema);