const express = require('express');
const router = express.Router();
const authController = require('../auth/controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { authenticate, requirePermission } = require('../../middlewares/auth.middleware');

const guardUsers = [authenticate, requirePermission('/setting-users')];

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.patch('/change-password', authController.changePassword);

router.get('/me/permissions', authenticate, userController.getMyPermissions);

router.post('/', guardUsers, authController.register);
router.get('/', guardUsers, authController.getUsers);
router.get('/:id', guardUsers, authController.getUserById);
router.put('/:id', guardUsers, authController.updateUser);
router.delete('/:id', guardUsers, authController.deleteUser);

module.exports = router;