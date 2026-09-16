const { successResponse } = require('../../utils/response');
const { isSuperAdmin } = require('../../middlewares/auth.middleware');

// req.user.roles is already populated (with permissions.menu / permissions.subMenus)
// by the authenticate middleware, so this just needs to flatten it.
exports.getMyPermissions = async (req, res) => {
    if (isSuperAdmin(req.user)) {
        return successResponse(res, { isSuperAdmin: true, permittedLinks: [] }, 'Permissions fetched successfully');
    }

    const permittedLinks = new Set();
    (req.user.roles || []).forEach((role) => {
        (role.permissions || []).forEach((perm) => {
            if (!perm.hasAccess) return;
            if (perm.menu?.link) permittedLinks.add(perm.menu.link);
            (perm.subMenus || []).forEach((sub) => {
                if (sub?.link) permittedLinks.add(sub.link);
            });
        });
    });

    return successResponse(res, {
        isSuperAdmin: false,
        permittedLinks: Array.from(permittedLinks)
    }, 'Permissions fetched successfully');
};
