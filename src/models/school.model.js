
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tagline: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    shortDescription: {
        type: String,
        default: ''
    },
    logoUrl: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    dean: {
        type: Schema.Types.ObjectId,
        ref: 'Staff'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProgramCategory',
        required: true
    },

    // Contact information embedded directly
    contactInfo: {
        phone: String,
        email: String,
        location: String,
        website: String
    },
    // Mission and vision embedded directly
    mission: {
        type: String,
        default: ''
    },
    vision: {
        type: String,
        default: ''
    },
    // School facilities or highlights
    facilities: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            default: ''
        },
        order: {
            type: Number,
            default: 0
        }
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



const School = mongoose.model('School', schoolSchema);

module.exports = School;