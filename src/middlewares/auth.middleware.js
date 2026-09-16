const { verifyAccessToken } = require('../utils/tokens');
const User = require('../models/User.model');
const { ApiError } = require('../utils/error-handler');
const { errorResponse } = require('../utils/response');

// The role type treated as full-access superadmin, matching seed_user.js's default ADMIN_ROLE.
const SUPERADMIN_ROLE_TYPE = process.env.ADMIN_ROLE || 'Admin';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new ApiError(401, 'Unauthorized - No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.id)
            .select('-password -refreshToken')
            .populate({ path: 'roles', populate: { path: 'permissions.menu permissions.subMenus' } });
        if (!user) {
            throw new ApiError(401, 'Unauthorized - User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, error.message, error.statusCode || 401);
    }
};

const authorize = (...roleTypes) => {
    return (req, res, next) => {
        const userRoleTypes = (req.user.roles || []).map((role) => role.type);
        const hasMatch = userRoleTypes.some((type) => roleTypes.includes(type));
        if (!hasMatch) {
            return errorResponse(res, 'Forbidden - Insufficient permissions', 403);
        }
        next();
    };
};

const isSuperAdmin = (user) => (user.roles || []).some((role) => role.type === SUPERADMIN_ROLE_TYPE);

// Grants access if the user is a superadmin, or any of their roles has
// hasAccess:true on a permission entry whose menu (or one of its subMenus)
// matches the given link.
const requirePermission = (link) => {
    return (req, res, next) => {
        if (isSuperAdmin(req.user)) return next();

        const hasAccess = (req.user.roles || []).some((role) =>
            (role.permissions || []).some((perm) => {
                if (!perm.hasAccess) return false;
                if (perm.menu?.link === link) return true;
                return (perm.subMenus || []).some((sub) => sub.link === link);
            })
        );

        if (!hasAccess) {
            return errorResponse(res, 'Forbidden - Insufficient permissions', 403);
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize,
    requirePermission,
    isSuperAdmin,
    SUPERADMIN_ROLE_TYPE
};