const University = require('../../models/University.model');
const WhySimad = require('../../models/WhySimad.model');
const History = require('../../models/History.model');
const Senate = require('../../models/Senate.model');
const Accreditation = require('../../models/Accreditation.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
// Get all university data
exports.getAllUniversityData = async (req, res) => {
    try {
        const university = await University.findOne({});
        const whySimadItems = await WhySimad.find({ isActive: true }).sort({ order: 1 });
        const historyItems = await History.find({ isActive: true }).sort({ year: -1 });
        const senateMembers = await Senate.find({ isActive: true }).sort({ order: 1 });
        const accreditations = await Accreditation.find({ isActive: true }).sort({ order: 1 });

        return successResponse(res, {
            university,
            whySimadItems,
            historyItems,
            senateMembers,
            accreditations
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// // Configure AWS S3
// const s3Client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
// });

// // Configure multer with increased limits for multiple files
// const storage = multer.memoryStorage();

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB per file (increased from 5MB)
//         fieldSize: 50 * 1024 * 1024, // 50MB for non-file fields
//         fields: 100, // Maximum number of non-file fields
//         files: 20, // Maximum number of file fields
//     },
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png|gif|webp/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = allowedTypes.test(file.mimetype);

//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed'));
//         }
//     }
// });

// // Helper function to upload file to S3
// const uploadToS3 = async (file, folder = 'university') => {
//     try {
//         const fileExtension = path.extname(file.originalname);
//         const key = `${folder}/${uuidv4()}${fileExtension}`;

//         const uploadParams = {
//             Bucket: process.env.AWS_S3_BUCKET_NAME,
//             Key: key,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//             ACL: 'public-read'
//         };

//         const command = new PutObjectCommand(uploadParams);
//         await s3Client.send(command);

//         return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//     } catch (error) {
//         throw new Error(`S3 upload failed: ${error.message}`);
//     }
// };

// // Helper function to delete file from S3
// const deleteFromS3 = async (url) => {
//     try {
//         if (!url) return;

//         const key = url.split('.amazonaws.com/')[1];
//         if (!key) return;

//         const deleteParams = {
//             Bucket: process.env.AWS_S3_BUCKET_NAME,
//             Key: key
//         };

//         const command = new DeleteObjectCommand(deleteParams);
//         await s3Client.send(command);
//     } catch (error) {
//         console.error('Error deleting file from S3:', error);
//     }
// };

// // Update all university data in a single transaction with S3 uploads
// exports.updateAllUniversityData = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     // Track uploaded files to clean up on error
//     let uploadedFiles = [];

//     try {
//         // Use multer middleware for file uploads with error handling
//         await new Promise((resolve, reject) => {
//             upload.any()(req, res, (err) => {
//                 if (err) {
//                     if (err.code === 'LIMIT_FILE_SIZE') {
//                         reject(new Error('File size too large. Maximum size is 10MB per file.'));
//                     } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//                         reject(new Error('Too many files uploaded. Maximum is 20 files.'));
//                     } else {
//                         reject(err);
//                     }
//                 } else {
//                     resolve();
//                 }
//             });
//         });

//         const {
//             university: universityData,
//             whySimadItems,
//             historyItems,
//             senateMembers,
//             accreditations
//         } = req.body;

//         // Parse JSON data if it's sent as string
//         let parsedUniversityData, parsedWhySimadItems, parsedHistoryItems, parsedSenateMembers, parsedAccreditations;

//         try {
//             parsedUniversityData = typeof universityData === 'string' ? JSON.parse(universityData) : universityData;
//             parsedWhySimadItems = typeof whySimadItems === 'string' ? JSON.parse(whySimadItems) : whySimadItems;
//             parsedHistoryItems = typeof historyItems === 'string' ? JSON.parse(historyItems) : historyItems;
//             parsedSenateMembers = typeof senateMembers === 'string' ? JSON.parse(senateMembers) : senateMembers;
//             parsedAccreditations = typeof accreditations === 'string' ? JSON.parse(accreditations) : accreditations;
//         } catch (parseError) {
//             throw new Error('Invalid JSON data in one or more fields');
//         }

//         // Process uploaded files to S3
//         const files = req.files || [];
//         const uploadPromises = [];
//         const fileUrlMap = {};

//         console.log(`Processing ${files.length} uploaded files`);

//         // Upload all files to S3 sequentially to avoid overwhelming the server
//         for (const file of files) {
//             try {
//                 console.log(`Uploading file: ${file.fieldname}, Size: ${file.size} bytes`);
//                 const url = await uploadToS3(file, 'university');
//                 fileUrlMap[file.fieldname] = url;
//                 uploadedFiles.push(url); // Track for cleanup
//                 console.log(`Successfully uploaded: ${file.fieldname}`);
//             } catch (uploadError) {
//                 console.error(`Failed to upload ${file.fieldname}:`, uploadError);
//                 throw new Error(`Failed to upload ${file.originalname}: ${uploadError.message}`);
//             }
//         }

//         // Function to get uploaded file URL by field name
//         const getUploadedFileUrl = (fieldName, index = '') => {
//             const searchName = index !== '' ? `${fieldName}[${index}]` : fieldName;
//             return fileUrlMap[searchName] || null;
//         };

//         // Process WhySimad images
//         const processedWhySimadItems = (parsedWhySimadItems || []).map((item, index) => ({
//             ...item,
//             image: getUploadedFileUrl('whySimadImage', index) || item.image
//         }));

//         // Process Senate member images
//         const processedSenateMembers = (parsedSenateMembers || []).map((member, index) => ({
//             ...member,
//             image: getUploadedFileUrl('senateImage', index) || member.image
//         }));

//         // Process Accreditation logos
//         const processedAccreditations = (parsedAccreditations || []).map((accreditation, index) => ({
//             ...accreditation,
//             logo: getUploadedFileUrl('accreditationLogo', index) || accreditation.logo
//         }));

//         // Process university logo and background
//         const processedUniversityData = {
//             ...parsedUniversityData,
//             logo: getUploadedFileUrl('universityLogo') || parsedUniversityData.logo,
//             backgroundImage: getUploadedFileUrl('universityBackground') || parsedUniversityData.backgroundImage
//         };

//         // Validate all data
//         const validationErrors = [];

//         // Validate university data
//         if (!parsedUniversityData || !parsedUniversityData.name) {
//             validationErrors.push('University name is required');
//         }

//         // Validate whySimad items
//         if (parsedWhySimadItems && Array.isArray(parsedWhySimadItems)) {
//             parsedWhySimadItems.forEach((item, index) => {
//                 if (!item.title) validationErrors.push(`Why SIMAD item ${index + 1}: Title is required`);
//                 if (!item.description) validationErrors.push(`Why SIMAD item ${index + 1}: Description is required`);
//             });
//         }

//         // Validate history items
//         if (parsedHistoryItems && Array.isArray(parsedHistoryItems)) {
//             parsedHistoryItems.forEach((item, index) => {
//                 if (!item.year) validationErrors.push(`History item ${index + 1}: Year is required`);
//                 if (!item.events || !Array.isArray(item.events) || item.events.length === 0) {
//                     validationErrors.push(`History item ${index + 1}: At least one event is required`);
//                 }
//             });
//         }

//         // Validate senate members
//         if (parsedSenateMembers && Array.isArray(parsedSenateMembers)) {
//             parsedSenateMembers.forEach((member, index) => {
//                 if (!member.name) validationErrors.push(`Senate member ${index + 1}: Name is required`);
//                 if (!member.position) validationErrors.push(`Senate member ${index + 1}: Position is required`);
//             });
//         }

//         // Validate accreditations
//         if (parsedAccreditations && Array.isArray(parsedAccreditations)) {
//             parsedAccreditations.forEach((accreditation, index) => {
//                 if (!accreditation.name) validationErrors.push(`Accreditation ${index + 1}: Name is required`);
//                 if (!accreditation.validity) validationErrors.push(`Accreditation ${index + 1}: Validity is required`);
//             });
//         }

//         if (validationErrors.length > 0) {
//             throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
//         }

//         // Get existing data to clean up old files
//         const existingUniversity = await University.findOne({});
//         const existingWhySimadItems = await WhySimad.find({});
//         const existingSenateMembers = await Senate.find({});
//         const existingAccreditations = await Accreditation.find({});

//         // Arrays to track old files that need to be deleted
//         const filesToDelete = [];

//         // Check for replaced university files
//         if (existingUniversity) {
//             if (processedUniversityData.logo !== existingUniversity.logo && existingUniversity.logo) {
//                 filesToDelete.push(existingUniversity.logo);
//             }
//             if (processedUniversityData.backgroundImage !== existingUniversity.backgroundImage && existingUniversity.backgroundImage) {
//                 filesToDelete.push(existingUniversity.backgroundImage);
//             }
//         }

//         // Update university data
//         let university = existingUniversity;
//         if (university) {
//             university = await University.findOneAndUpdate({}, processedUniversityData, {
//                 new: true,
//                 runValidators: true,
//                 session
//             });
//         } else {
//             university = await University.create([processedUniversityData], { session });
//             university = university[0];
//         }

//         // Update WhySimad items and track old files for deletion
//         const existingWhySimadImages = existingWhySimadItems.map(item => item.image).filter(Boolean);
//         await WhySimad.deleteMany({}, { session });
//         if (processedWhySimadItems.length > 0) {
//             await WhySimad.insertMany(processedWhySimadItems, { session });
//         }

//         // Find replaced WhySimad images
//         const newWhySimadImages = processedWhySimadItems.map(item => item.image).filter(Boolean);
//         existingWhySimadImages.forEach(oldImage => {
//             if (!newWhySimadImages.includes(oldImage)) {
//                 filesToDelete.push(oldImage);
//             }
//         });

//         // Update History items
//         await History.deleteMany({}, { session });
//         if (parsedHistoryItems && parsedHistoryItems.length > 0) {
//             await History.insertMany(parsedHistoryItems, { session });
//         }

//         // Update Senate members and track old files for deletion
//         const existingSenateImages = existingSenateMembers.map(member => member.image).filter(Boolean);
//         await Senate.deleteMany({}, { session });
//         if (processedSenateMembers.length > 0) {
//             await Senate.insertMany(processedSenateMembers, { session });
//         }

//         // Find replaced Senate images
//         const newSenateImages = processedSenateMembers.map(member => member.image).filter(Boolean);
//         existingSenateImages.forEach(oldImage => {
//             if (!newSenateImages.includes(oldImage)) {
//                 filesToDelete.push(oldImage);
//             }
//         });

//         // Update Accreditations and track old files for deletion
//         const existingAccreditationLogos = existingAccreditations.map(accreditation => accreditation.logo).filter(Boolean);
//         await Accreditation.deleteMany({}, { session });
//         if (processedAccreditations.length > 0) {
//             await Accreditation.insertMany(processedAccreditations, { session });
//         }

//         // Find replaced accreditation logos
//         const newAccreditationLogos = processedAccreditations.map(accreditation => accreditation.logo).filter(Boolean);
//         existingAccreditationLogos.forEach(oldLogo => {
//             if (!newAccreditationLogos.includes(oldLogo)) {
//                 filesToDelete.push(oldLogo);
//             }
//         });

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         // Delete old files from S3 (non-blocking)
//         if (filesToDelete.length > 0) {
//             console.log(`Cleaning up ${filesToDelete.length} old files from S3`);
//             Promise.allSettled(filesToDelete.map(url => deleteFromS3(url)))
//                 .then(results => {
//                     const failedDeletes = results.filter(result => result.status === 'rejected');
//                     if (failedDeletes.length > 0) {
//                         console.warn('Some old files could not be deleted from S3:', failedDeletes.length);
//                     } else {
//                         console.log('All old files cleaned up successfully');
//                     }
//                 });
//         }

//         // Get updated data to return
//         const updatedWhySimadItems = await WhySimad.find({ isActive: true }).sort({ order: 1 });
//         const updatedHistoryItems = await History.find({ isActive: true }).sort({ order: 1 });
//         const updatedSenateMembers = await Senate.find({ isActive: true }).sort({ order: 1 });
//         const updatedAccreditations = await Accreditation.find({ isActive: true }).sort({ order: 1 });

//         console.log('University data updated successfully');
//         return successResponse(res, {
//             university,
//             whySimadItems: updatedWhySimadItems,
//             historyItems: updatedHistoryItems,
//             senateMembers: updatedSenateMembers,
//             accreditations: updatedAccreditations
//         }, 'All university data updated successfully');

//     } catch (error) {
//         // Cleanup uploaded files if transaction fails
//         if (uploadedFiles.length > 0) {
//             console.log(`Cleaning up ${uploadedFiles.length} uploaded files due to error`);
//             await Promise.allSettled(uploadedFiles.map(url => deleteFromS3(url)));
//         }

//         await session.abortTransaction();
//         session.endSession();

//         console.error('Error updating university data:', error);
//         return errorResponse(res, error.message, 500);
//     }
// };

