const { verifyAccessToken } = require('../utils/tokens');
const User = require('../models/User.model');
const ApiError = require('../utils/error-handler');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new ApiError(401, 'Unauthorized - No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError(401, 'Unauthorized - User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, error.message, error.statusCode || 401);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Forbidden - Insufficient permissions', 403);
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};