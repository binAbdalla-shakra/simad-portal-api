// routes/university.routes.js
const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
/**
 * @swagger
 * tags:
 *   - name: Universities
 *     description: API for managing universities
 */

/**
 * @swagger
 * /api/v1/university:
 *   get:
 *     summary: Retrieve a university Info
 *     tags: [university]
 *     description: Retrieve a university info, or filter by query parameters.
 *     responses:
 *       200:
 *         description: university info.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The university's unique ID.
 *                   name:
 *                     type: string
 *                     description: The name of the university.
 *                   location:
 *                     type: string
 *                     description: The location of the university.
 *       500:
 *         description: Internal server error.
 */
router.get('/', universityController.getUniversityInfo);

router.post('/', universityController.createUniversity);

router.put('/:slug', universityController.updateUniversity);

module.exports = router;
