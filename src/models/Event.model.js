const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        date: {
            type: Date,
            required: true,
        },
        duration: {
            type: String, // e.g. "2 hours", "3 days"
            default: '',
        },
        startTime: {
            type: String, // e.g. "10:00 AM"
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: String,
            default: 'system',
        },
        updatedBy: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
