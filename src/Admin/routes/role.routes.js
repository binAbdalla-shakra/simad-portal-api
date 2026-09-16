const express = require('express');
const router = express.Router();
const {

    createRole,
    updateRole,
    deleteRole,
    getAllRoles
} = require('../controllers/role.controller');
const { authenticate, requirePermission } = require('../../middlewares/auth.middleware');

const guardRoles = [authenticate, requirePermission('/setting-roles')];

// GET /api/accreditations - Get all accreditations
router.get('/', guardRoles, getAllRoles);

router.post('/', guardRoles, createRole);


// PUT /api/accreditations - Update accreditations
router.put('/:id', guardRoles, updateRole);

router.delete('/:id', guardRoles, deleteRole);

// router.get('/:id', getRoleById);





module.exports = router;