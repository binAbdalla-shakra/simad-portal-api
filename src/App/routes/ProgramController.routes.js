const express = require('express');
const router = express.Router();
const {

    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById
} = require('../controllers/ProgramCategory.controller');

// GET /api/accreditations - Get all accreditations
router.get('/', getAllCategories);

router.post('/', createCategory);


// PUT /api/accreditations - Update accreditations
router.put('/:id', updateCategory);

router.delete('/:id', deleteCategory);

router.get('/:id', getCategoryById);





module.exports = router;