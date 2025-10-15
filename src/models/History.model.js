const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    events: [{
        type: String,
        required: true
    }],
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('History', historySchema);