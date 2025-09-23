// models/UploadConfig.js
const mongoose = require('mongoose');

const uploadConfigSchema = new mongoose.Schema({
    configName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    fieldName: {
        type: String,
        required: true,
        trim: true
    },
    uploadPath: {
        type: String,
        required: true,
        trim: true
    },
    maxFiles: {
        type: Number,
        min: 1,
        default: 10
    },
    fileType: {
        type: String,
        required: true,
        enum: ['image', 'document', 'video', 'audio', 'archive', 'all'],
        default: 'image'
    },

    maxFileSize: {
        type: Number, // in bytes
        required: true,
        default: 5 * 1024 * 1024 // 5MB default
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});


// Static method to get config by name
uploadConfigSchema.statics.getConfigByName = async function (configName) {
    return await this.findOne({
        configName: configName.toUpperCase(),
        isActive: true
    });
};

// Instance method to get full upload path
uploadConfigSchema.methods.getFullUploadPath = function (filename = '') {
    return `${this.uploadPath}${filename}`;
};


const UploadConfig = mongoose.model('UploadConfig', uploadConfigSchema);

module.exports = UploadConfig;