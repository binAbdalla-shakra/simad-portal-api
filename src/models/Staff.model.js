const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },

    photoUrl: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    officeLocation: { type: String, default: '' },
    // Professional Experience
    professionalExperience: [{
        position: { type: String, required: true },
        organization: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, default: '' },
        achievements: [{
            type: String
        }]
    }],
    // Research Information
    isResearchContributor: { type: Boolean, default: false },
    researchInterests: [{ type: String, trim: true }],
    publications: [{
        title: { type: String, required: true },
        journalOrConference: { type: String, required: true },
        publicationDate: { type: Date, required: true },
        authors: [{ type: String }],
        link: { type: String, default: '' },
        isSelected: { type: Boolean, default: false }
    }],
    // Education Background
    education: [{
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        institution: { type: String, required: true },
        graduationYear: { type: Number, required: true },
        country: { type: String, default: '' },
        thesisTitle: { type: String, default: '' }
    }],
    // Awards & Honors
    awards: [{
        title: { type: String, required: true },
        awardingBody: { type: String, required: true },
        year: { type: Number, required: true },
        description: { type: String, default: '' }
    }],
    createdBy: { type: String },
    updatedBy: { type: String }
}, { timestamps: true });





const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;