const User = require('../../../models/User.model');
const { ApiError } = require('../../../utils/error-handler');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../../utils/tokens');
const bcrypt = require('bcryptjs');

class AuthService {
    async register(userData) {
        const user = new User(userData);
        await user.save();
        return user;
    }

    async login(username, password) {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Incorrect username or password');
        }

        const accessToken = generateAccessToken({
            id: user._id,
            username: user.username,
            roles: user.roles
        });

        const refreshToken = generateRefreshToken({ id: user._id });

        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        return { user, accessToken, refreshToken };
    }

    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token missing');
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, 'Refresh token revoked or unrecognized');
        }

        const accessToken = generateAccessToken({
            id: user._id,
            username: user.username,
            roles: user.roles
        });
        const newRefreshToken = generateRefreshToken({ id: user._id });

        user.refreshToken = newRefreshToken;
        await user.save();

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(userId) {
        await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user || !(await user.comparePassword(currentPassword))) {
            throw new Error('Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();
    }
    async getUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find().select('-password -refreshToken').skip(skip).limit(limit),
            User.countDocuments()
        ]);
        return { users, total };
    }

    async getUserById(id) {
        const user = await User.findById(id).select('-password -refreshToken');
        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    async updateUser(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!user) throw new ApiError(404, 'User not found');

        // Prevent email update conflict
        if (updateData.email && (await User.isEmailTaken(updateData.email, userId))) {
            throw new ApiError(400, 'Email already taken');
        }

        return user;
    }


}

module.exports = new AuthService();