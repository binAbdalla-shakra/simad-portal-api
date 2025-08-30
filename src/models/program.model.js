const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    shortName: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        default: ''
    },

    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    // Program details
    duration: {
        type: String,
        default: ''
    },
    credits: {
        type: Number,
        default: 0
    },
    // Tuition information
    tuition: {
        domestic: Number,
        international: Number,
        tution_fee_per_sem: Number,
        tution_fee_per_month: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    intakePeriods: [{
        type: String,
        trim: true
    }],
    applicationDeadline: Date,
    // Curriculum information
    curriculum: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ''
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Admission requirements
    admissionRequirements: [{
        type: String,
        trim: true
    }],
    // Career paths
    careerPaths: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ''
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Program provider (e.g., SIMAD, Open University Malaysia)
    provider: {
        type: String,
        default: 'SIMAD University'
    },
    iconUrl: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    externalLink: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    // Statistics
    programCount: {
        type: Number,
        default: 0,

    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }
}, { timestamps: true });





const Program = mongoose.model('Program', programSchema);

module.exports = Program;