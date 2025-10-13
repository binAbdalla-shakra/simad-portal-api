const mongoose = require("mongoose");

const InstitutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    shortDescription: {
        type: String,
    },
    coverImage: {
        type: String, // URL
    },
    image: {
        type: String, // URL
    },

    // Optional sections
    overview: {
        heading: String,
        content: String,
    },

    visionMission: {
        heading: { type: String, default: "Vision & Mission" },
        content: String,
    },

    keyPrograms: {
        heading: { type: String, default: "Key Programs & Research" },
        programs: [String],
    },


    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model("Institution", InstitutionSchema);
