const University = require('../models/University.model');
const WhySimad = require('../models/WhySimad.model');
const History = require('../models/History.model');
const Senate = require('../models/Senate.model');
const Accreditation = require('../models/Accreditation.model');
const { successResponse, errorResponse } = require('../utils/response');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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



// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});


// Update all university data in a single transaction with image uploads
exports.updateAllUniversityData = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Use multer middleware for file uploads
        await new Promise((resolve, reject) => {
            upload.any()(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const {
            university: universityData,
            whySimadItems,
            historyItems,
            senateMembers,
            accreditations
        } = req.body;

        // Parse JSON data if it's sent as string
        const parsedUniversityData = typeof universityData === 'string' ? JSON.parse(universityData) : universityData;
        const parsedWhySimadItems = typeof whySimadItems === 'string' ? JSON.parse(whySimadItems) : whySimadItems;
        const parsedHistoryItems = typeof historyItems === 'string' ? JSON.parse(historyItems) : historyItems;
        const parsedSenateMembers = typeof senateMembers === 'string' ? JSON.parse(senateMembers) : senateMembers;
        const parsedAccreditations = typeof accreditations === 'string' ? JSON.parse(accreditations) : accreditations;

        // Get base URL based on environment
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.BASE_URL_PROD
            : process.env.BASE_URL_DV;

        // Process uploaded files
        const uploadedFiles = req.files || [];

        // Function to find file by field name
        const findFile = (fieldName, index = '') => {
            const searchName = index !== '' ? `${fieldName}[${index}]` : fieldName;
            const file = uploadedFiles.find(f => f.fieldname === searchName);
            return file ? `${baseUrl}/${file.filename}` : null;
        };

        // Process WhySimad images
        const processedWhySimadItems = parsedWhySimadItems?.map((item, index) => {
            const imageUrl = findFile('whySimadImage', index);
            return {
                ...item,
                image: imageUrl || item.image // Keep existing image if no new upload
            };
        }) || [];

        // Process Senate member images
        const processedSenateMembers = parsedSenateMembers?.map((member, index) => {
            const imageUrl = findFile('senateImage', index);
            return {
                ...member,
                image: imageUrl || member.image // Keep existing image if no new upload
            };
        }) || [];

        // Process Accreditation logos
        const processedAccreditations = parsedAccreditations?.map((accreditation, index) => {
            const logoUrl = findFile('accreditationLogo', index);
            return {
                ...accreditation,
                logo: logoUrl || accreditation.logo // Keep existing logo if no new upload
            };
        }) || [];

        // Process university logo and background
        const processedUniversityData = {
            ...parsedUniversityData,
            logo: findFile('universityLogo') || parsedUniversityData.logo,
            backgroundImage: findFile('universityBackground') || parsedUniversityData.backgroundImage
        };

        // Validate all data
        const validationErrors = [];

        // Validate university data
        if (!parsedUniversityData || !parsedUniversityData.name) {
            validationErrors.push('University name is required');
        }

        // Validate whySimad items
        if (parsedWhySimadItems && Array.isArray(parsedWhySimadItems)) {
            parsedWhySimadItems.forEach((item, index) => {
                if (!item.title) validationErrors.push(`Why SIMAD item ${index + 1}: Title is required`);
                if (!item.description) validationErrors.push(`Why SIMAD item ${index + 1}: Description is required`);
            });
        }

        // Validate history items
        if (parsedHistoryItems && Array.isArray(parsedHistoryItems)) {
            parsedHistoryItems.forEach((item, index) => {
                if (!item.year) validationErrors.push(`History item ${index + 1}: Year is required`);
                if (!item.events || !Array.isArray(item.events) || item.events.length === 0) {
                    validationErrors.push(`History item ${index + 1}: At least one event is required`);
                }
            });
        }

        // Validate senate members
        if (parsedSenateMembers && Array.isArray(parsedSenateMembers)) {
            parsedSenateMembers.forEach((member, index) => {
                if (!member.name) validationErrors.push(`Senate member ${index + 1}: Name is required`);
                if (!member.position) validationErrors.push(`Senate member ${index + 1}: Position is required`);
            });
        }

        // Validate accreditations
        if (parsedAccreditations && Array.isArray(parsedAccreditations)) {
            parsedAccreditations.forEach((accreditation, index) => {
                if (!accreditation.name) validationErrors.push(`Accreditation ${index + 1}: Name is required`);
                if (!accreditation.validity) validationErrors.push(`Accreditation ${index + 1}: Validity is required`);
            });
        }

        if (validationErrors.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 'Validation failed', 400, validationErrors);
        }

        // Update university data
        let university = await University.findOne({});
        if (university) {
            university = await University.findOneAndUpdate({}, processedUniversityData, {
                new: true,
                runValidators: true,
                session
            });
        } else {
            university = await University.create([processedUniversityData], { session });
            university = university[0];
        }

        // Update WhySimad items
        await WhySimad.deleteMany({}, { session });
        if (processedWhySimadItems.length > 0) {
            await WhySimad.insertMany(processedWhySimadItems, { session });
        }

        // Update History items
        await History.deleteMany({}, { session });
        if (parsedHistoryItems && parsedHistoryItems.length > 0) {
            await History.insertMany(parsedHistoryItems, { session });
        }

        // Update Senate members
        await Senate.deleteMany({}, { session });
        if (processedSenateMembers.length > 0) {
            await Senate.insertMany(processedSenateMembers, { session });
        }

        // Update Accreditations
        await Accreditation.deleteMany({}, { session });
        if (processedAccreditations.length > 0) {
            await Accreditation.insertMany(processedAccreditations, { session });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Get updated data to return
        const updatedWhySimadItems = await WhySimad.find({ isActive: true }).sort({ order: 1 });
        const updatedHistoryItems = await History.find({ isActive: true }).sort({ order: 1 });
        const updatedSenateMembers = await Senate.find({ isActive: true }).sort({ order: 1 });
        const updatedAccreditations = await Accreditation.find({ isActive: true }).sort({ order: 1 });

        return successResponse(res, {
            university,
            whySimadItems: updatedWhySimadItems,
            historyItems: updatedHistoryItems,
            senateMembers: updatedSenateMembers,
            accreditations: updatedAccreditations
        }, 'All university data updated successfully');

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, error.message, 500);
    }
};