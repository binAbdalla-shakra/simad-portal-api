const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/', authenticate, menuController.getAllMenus);
router.post('/', authenticate, menuController.createMenu);
router.put('/:id', authenticate, menuController.updateMenu);
router.delete('/:id', authenticate, menuController.deleteMenu);

module.exports = router;
