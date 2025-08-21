const University = require('../models/University.model');
const WhySimad = require('../models/WhySimad.model');
const History = require('../models/History.model');
const Senate = require('../models/Senate.model');
const Accreditation = require('../models/Accreditation.model');
const { successResponse, errorResponse } = require('../utils/response');
const { default: mongoose } = require('mongoose');

// Get all university data
exports.getAllUniversityData = async (req, res) => {
    try {
        const university = await University.findOne({});
        const whySimadItems = await WhySimad.find({ isActive: true }).sort({ order: 1 });
        const historyItems = await History.find({ isActive: true }).sort({ order: 1 });
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

// Update all university data in a single transaction
exports.updateAllUniversityData = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            university: universityData,
            whySimadItems,
            historyItems,
            senateMembers,
            accreditations
        } = req.body;

        // Validate all data
        const validationErrors = [];

        // Validate university data
        if (!universityData || !universityData.name) {
            validationErrors.push('University name is required');
        }

        // Validate whySimad items
        if (whySimadItems && Array.isArray(whySimadItems)) {
            whySimadItems.forEach((item, index) => {
                if (!item.title) validationErrors.push(`Why SIMAD item ${index + 1}: Title is required`);
                if (!item.description) validationErrors.push(`Why SIMAD item ${index + 1}: Description is required`);
            });
        }

        // Validate history items
        if (historyItems && Array.isArray(historyItems)) {
            historyItems.forEach((item, index) => {
                if (!item.year) validationErrors.push(`History item ${index + 1}: Year is required`);
                if (!item.events || !Array.isArray(item.events) || item.events.length === 0) {
                    validationErrors.push(`History item ${index + 1}: At least one event is required`);
                }
            });
        }

        // Validate senate members
        if (senateMembers && Array.isArray(senateMembers)) {
            senateMembers.forEach((member, index) => {
                if (!member.name) validationErrors.push(`Senate member ${index + 1}: Name is required`);
                if (!member.position) validationErrors.push(`Senate member ${index + 1}: Position is required`);
            });
        }

        // Validate accreditations
        if (accreditations && Array.isArray(accreditations)) {
            accreditations.forEach((accreditation, index) => {
                if (!accreditation.name) validationErrors.push(`Accreditation ${index + 1}: Name is required`);
                if (!accreditation.validity) validationErrors.push(`Accreditation ${index + 1}: Validity is required`);
            });
        }

        // If there are validation errors, return them
        if (validationErrors.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 'Validation failed', 400, validationErrors);
        }

        // Update university data
        let university = await University.findOne({});
        if (university) {
            university = await University.findOneAndUpdate({}, universityData, {
                new: true,
                runValidators: true,
                session
            });
        } else {
            university = await University.create([universityData], { session });
            university = university[0];
        }

        // Update WhySimad items - delete all and recreate
        await WhySimad.deleteMany({}, { session });
        if (whySimadItems && whySimadItems.length > 0) {
            await WhySimad.insertMany(whySimadItems, { session });
        }

        // Update History items - delete all and recreate
        await History.deleteMany({}, { session });
        if (historyItems && historyItems.length > 0) {
            await History.insertMany(historyItems, { session });
        }

        // Update Senate members - delete all and recreate
        await Senate.deleteMany({}, { session });
        if (senateMembers && senateMembers.length > 0) {
            await Senate.insertMany(senateMembers, { session });
        }

        // Update Accreditations - delete all and recreate
        await Accreditation.deleteMany({}, { session });
        if (accreditations && accreditations.length > 0) {
            await Accreditation.insertMany(accreditations, { session });
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