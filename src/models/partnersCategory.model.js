const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnersCategorySchema = new Schema({
    categoryName: { type: String, required: true, unique: true, trim: true },
    desc: { type: String, default: '' },
    createdBy: { type: String },
    updatedBy: { type: String }
}, { timestamps: true });

const PartnersCategory = mongoose.model('PartnersCategory', partnersCategorySchema);

module.exports = PartnersCategory;
