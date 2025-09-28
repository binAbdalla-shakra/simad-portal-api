const express = require('express');
const router = express.Router();

// ========================== ABOUT UNIVERSITY ROUTES ==========================
// The API exposes two levels of endpoints for "About University":
// 1. General consolidated info (all in one payload): 
//    -> /about-university
//       Combines University, Why SIMAD, History, Senate, and Accreditations data.
router.use('/about-university', require('./about_university.routes'));

router.use('/program-categories', require('./ProgramCategory.routes'));

router.use('/schools', require('./school.routes'));

router.use('/programs', require('./program.routes'));
router.use('/staffs', require('./staff.routes'));
router.use('/partners', require('./partners.routes'));

router.use('/updates', require('./updates.routes'));




module.exports = router;
