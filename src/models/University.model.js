const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Public', 'Private', 'Non-profit', 'For-profit'],
        default: 'Private'
    },
    motto: {
        type: String,
        trim: true
    },
    founded: {
        type: Date
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'Somalia'
        },
        postalCode: String
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    academics: {
        language: String,
        affiliation: String
    },
    colors: [String],
    formerNames: [String],
    otherNames: [String],
    logo: {
        type: String,
        default: 'university-default.png'
    },
    backgroundImage: {
        type: String,
        default: 'university-bg-default.jpg'
    },
    about_simad: String,
    stats: {
        students: {
            type: Number,
            default: 0
        },
        alumni: {
            type: Number,
            default: 0
        },
        labs: {
            type: Number,
            default: 0
        },
        campuses: {
            type: Number,
            default: 0
        }
    },
    description: {
        mission: String,
        vision: String,
        guiding_principles: String,
        core_values: String,
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String,
        youtube: String,
        tiktok: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,

});


module.exports = mongoose.model('University', universitySchema);