const express = require('express');
const router = express.Router();
const {

    createRole,
    updateRole,
    deleteRole,
    getAllRoles
} = require('../controllers/role.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllRoles);

router.post('/', createRole);


// PUT /api/accreditations - Update accreditations
router.put('/:id', updateRole);

router.delete('/:id', deleteRole);

// router.get('/:id', getRoleById);





module.exports = router;