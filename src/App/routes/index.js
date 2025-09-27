const express = require('express');
const router = express.Router();

const roleRoutes = require('./role.routes');


const universityRoutes = require('./university.routes');

router.use('/roles', roleRoutes);



// ========================== ABOUT UNIVERSITY ROUTES ==========================
// The API exposes two levels of endpoints for "About University":
// 1. General consolidated info (all in one payload): 
//    -> /about-university
//       Combines University, Why SIMAD, History, Senate, and Accreditations data.
router.use('/about-university', require('./about_university.routes'));

// 2. Specific resource endpoints (CRUD operations per module):
//    -> /university        : University general info
//    -> /why-simad         : Why SIMAD highlights
//    -> /history           : Historical milestones
//    -> /senate            : Senate members & structure
//    -> /accreditations    : Accreditation details

router.use('/university', universityRoutes);
router.use('/why-simad', require('./whySimad.routes'));
router.use('/history', require('./history.routes'));
router.use('/senate', require('./senate.routes'));
router.use('/accreditations', require('./accreditation.routes'));
// ===============================END ABOUT UNIVERSITY ROUTES=============================================


// Upload Config Section
router.use('/save-default-upload-configs', require('./UploadConfig.routes'));


router.use('/program-categories', require('./ProgramController.routes'));

router.use('/schools', require('./school.routes'));

router.use('/departments', require('./department.routes'));
router.use('/programs', require('./program.routes'));
router.use('/staffs', require('./staff.routes'));




module.exports = router;
