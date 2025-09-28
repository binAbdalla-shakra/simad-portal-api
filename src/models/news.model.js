const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: { type: String, required: true, trim: true },
    image: { type: String, default: '' }, // Image URL
    toWhom: { type: String, enum: ['students', 'staff', 'public', 'all'], default: 'all' },
    infoLink: { type: String, default: '' }, // external link to more details
    date: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    // Additional optional fields for scalability
    description: { type: String, default: '' },
    category: { type: String, default: '' }, // e.g., "Announcement", "Press Release"
    createdBy: { type: String, default: '' },
    updatedBy: { type: String, default: '' }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

module.exports = News;
