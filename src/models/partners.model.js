const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    desc: { type: String, default: '' },
    howLong: { type: String, default: '' }, // e.g. "5 years partnership"
    category: { type: Schema.Types.ObjectId, ref: 'PartnersCategory', required: true },
    createdBy: { type: String },
    updatedBy: { type: String }
}, { timestamps: true });

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
