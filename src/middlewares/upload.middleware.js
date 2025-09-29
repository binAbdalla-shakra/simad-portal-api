const { upload } = require('../service/upload.service');

// Middleware
exports.uploadPartnerLogo = upload.single('logo');
