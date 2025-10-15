const { upload } = require('../service/upload.service');

// Middleware
exports.uploadFile = (fieldName) => upload.single(fieldName);


exports.uploadSchoolImages = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);



exports.uploadInstitutionImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);


exports.uploadUniversityProfileImages = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]);