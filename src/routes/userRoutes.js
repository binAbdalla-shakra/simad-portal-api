const express = require('express');
const router = express.Router();
const authController = require('../auth/controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.getUsers);
router.get('/:id', authController.getUserById);


router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.patch('/change-password', authenticate, authController.changePassword);

module.exports = router;