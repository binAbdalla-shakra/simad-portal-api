const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    subMenuIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    createdBy: { type: String },
    updatedBy: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('RolePermission', rolePermissionSchema);