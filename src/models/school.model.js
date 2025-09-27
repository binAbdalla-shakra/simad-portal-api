
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    tagline: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    dean: { type: Schema.Types.ObjectId, ref: 'Staff' },
    category: { type: Schema.Types.ObjectId, ref: 'ProgramCategory', required: true },
    // Contact information embedded directly
    contactInfo: {
        phone: String,
        email: String,
        location: String,
        website: String
    },

    facts_and_figures: {
        academic_staff: Number,
        student_population: String,
        founded_year: String
    },
    // Mission and vision embedded directly
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    // School testimonials
    student_testimonials: [{
        student_name: { type: String },
        message: { type: String },
        student_program_shortName: { type: String, default: '' }
    }],
    programs_sec_title: { type: String },
    programs_sec_icon: { type: String },
    programs_sec_subtitle: { type: String },

    vison_and_mission_sec_title: { type: String },
    vison_and_mission_sec_subtitle: { type: String },
    vison_and_mission_sec_icon: { type: String },

    dean_message_sec_title: { type: String },
    dean_message_sec_subtitle: { type: String },
    dean_message_sec_icon: { type: String },
    dean_message_sec_text: { type: String },


    facts_message_sec_title: { type: String },
    facts_message_sec_subtitle: { type: String },
    facts_message_sec_icon: { type: String },

    testimonials_message_sec_title: { type: String },
    testimonials_message_sec_subtitle: { type: String },
    testimonials_message_sec_icon: { type: String },

    contact_message_sec_title: { type: String },
    contact_message_sec_subtitle: { type: String },
    contact_message_sec_icon: { type: String },

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