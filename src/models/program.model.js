const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    tagline: { type: String, },

    school: { type: Schema.Types.ObjectId, ref: 'School' },
    about_program_sec_title: { type: String },
    about_program_sec_icon: { type: String },
    about_program_sec_info: { type: String },

    // Program details
    duration: { type: Number, default: 4 },
    duration_sec_icon: { type: String },
    duration_sec_title: { type: String },

    sem_fee: { type: Number, default: 0 },
    sem_fee_sec_icon: { type: String },
    sem_fee_sec_title: { type: String },

    // Curriculum information
    curriculum_sec_icon: { type: String },
    curriculum_sec_title: { type: String },
    curriculum_sec_desc: { type: String },
    curriculum: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: '' },
        order: { type: Number, default: 0 }
    }],

    // Admission requirements
    admissionRequirements_sec_icon: { type: String },
    admissionRequirements_sec_title: { type: String },
    admissionRequirements_sec_desc: { type: String },
    admissionRequirements: [{
        type: String,
        trim: true
    }],

    // Career paths
    careerPaths_sec_icon: { type: String },
    careerPaths_sec_title: { type: String },
    careerPaths_sec_desc: { type: String },
    careerPaths: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: '' },
        order: { type: Number, default: 0 }
    }],
    // Program provider (e.g., SIMAD, Open University Malaysia)
    provider: { type: String, default: 'SIMAD University' },
    icon: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    externalLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
    createdBy: { type: String },
    updatedBy: { type: String }
}, { timestamps: true });





const Program = mongoose.model('Program', programSchema);

module.exports = Program;