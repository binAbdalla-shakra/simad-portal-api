const { upload } = require('../service/upload.service');

// Middleware
exports.uploadFile = (fieldName) => upload.single(fieldName);


exports.uploadSchoolImages = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);
