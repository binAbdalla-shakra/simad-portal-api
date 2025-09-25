const mongoose = require('mongoose');

// Define the role schema
const roleSchema = new mongoose.Schema({
    type: { type: String, required: true }, // Role type (e.g., Admin, User)
    description: { type: String }, // Description of the role
    permissions: [{
        menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
        subMenus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
        hasAccess: { type: Boolean, default: false }
    }],
    CreatedBy: { type: String, required: true },
    ModifiedBy: String,
}, { timestamps: true });

// Export the Role model
module.exports = mongoose.model('Role', roleSchema);
