const authService = require('../services/auth.service');
const { catchAsync } = require('../../utils/error-handler');
const { successResponse, errorResponse } = require('../../utils/response');

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    return successResponse(res, { user }, 'User registered successfully', 201);
});

const login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(username, password);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return successResponse(res, { user, accessToken, status: "success" }, 'Login successful');
});

// const refreshToken = catchAsync(async (req, res) => {
//     const { refreshToken } = req.cookies;
//     const { accessToken } = await authService.refreshAccessToken(refreshToken);
//     return successResponse(res, { accessToken }, 'Token refreshed successfully');
// });

// const logout = catchAsync(async (req, res) => {
//     await authService.logout(req.user.id);
//     res.clearCookie('refreshToken');
//     return successResponse(res, null, 'Logout successful', 204);
// });

const changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    return successResponse(res, null, 'Password changed successfully', 204);
});



const getUsers = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { users, total } = await authService.getUsers(page, limit);
    return successResponse(res, { users, total }, 'Users fetched successfully');
});

const getUserById = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.params.id);
    return successResponse(res, { user }, 'User details fetched successfully');
});

const deleteUser = catchAsync(async (req, res) => {
    await authService.deleteUser(req.params.id);
    return successResponse(res, null, 'User deleted successfully');
});


const updateUser = catchAsync(async (req, res) => {
    const user = await authService.updateUser(req.params.id, req.body);
    return successResponse(res, { user }, 'User updated successfully');
});





module.exports = {
    register,
    login,
    changePassword,
    getUsers,
    getUserById,
    updateUser,
    deleteUser

};