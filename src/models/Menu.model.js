const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        required: function () {
            return !this.parentId; // Icon is only required for parent items
        },
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        default: null
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
        type: String,
    },
    updatedBy: {
        type: String,
    }
}, { timestamps: true });



module.exports = mongoose.model('Menu', menuSchema);