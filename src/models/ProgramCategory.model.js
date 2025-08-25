const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }
}, { timestamps: true });



const ProgramCategory = mongoose.model('ProgramCategory', programCategorySchema);

module.exports = ProgramCategory;