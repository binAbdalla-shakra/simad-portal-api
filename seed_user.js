require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./src/Admin/config/db');
const User = require('./src/models/User.model');
const Role = require('./src/models/Role.model');

const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const firstName = process.env.ADMIN_FIRST_NAME || 'System';
const lastName = process.env.ADMIN_LAST_NAME || 'Administrator';
const roleType = process.env.ADMIN_ROLE || 'Admin';

async function seedAdmin() {
    if (!password || password.length < 8) {
        throw new Error('Set ADMIN_PASSWORD to a value with at least 8 characters');
    }

    await connectDB();

    let role = await Role.findOne({ type: roleType });
    if (!role) {
        role = await Role.create({
            type: roleType,
            description: 'System administrator',
            CreatedBy: 'seed_user.js'
        });
    }

    let user = await User.findOne({ username });
    if (!user) {
        user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            roles: [role._id],
            isActive: true
        });
    } else {
        user.email = email;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;
        user.roles = [role._id];
        user.isActive = true;
    }

    await user.save();
    console.log(`Admin user ready: ${user.username}`);
}

seedAdmin()
    .catch((error) => {
        console.error('Admin seed failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });