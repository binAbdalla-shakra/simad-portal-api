const School = require('../../models/school.model');
const Program = require('../../models/program.model');
const ProgramCategory = require('../../models/ProgramCategory.model');
const Staff = require('../../models/Staff.model');
const Institution = require('../../models/Instituion.model');
const Partner = require('../../models/partners.model');
const PartnersCategory = require('../../models/partnersCategory.model');
const Event = require('../../models/Event.model');
const News = require('../../models/news.model');
const Facility = require('../../models/Facility.model');
const Accreditation = require('../../models/Accreditation.model');
const User = require('../../models/User.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

exports.getStats = async (req, res) => {
    try {
        const [
            schools,
            programs,
            programCategories,
            staff,
            institutions,
            partners,
            partnerCategories,
            events,
            news,
            facilities,
            accreditations,
            users,
            activeUsers,
            recentNews,
            recentEvents,
        ] = await Promise.all([
            School.countDocuments(),
            Program.countDocuments(),
            ProgramCategory.countDocuments(),
            Staff.countDocuments(),
            Institution.countDocuments(),
            Partner.countDocuments(),
            PartnersCategory.countDocuments(),
            Event.countDocuments(),
            News.countDocuments(),
            Facility.countDocuments(),
            Accreditation.countDocuments(),
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            News.find().sort({ createdAt: -1 }).limit(5).select('title createdAt'),
            Event.find().sort({ createdAt: -1 }).limit(5).select('title createdAt'),
        ]);

        return successResponse(res, {
            counts: {
                schools,
                programs,
                programCategories,
                staff,
                institutions,
                partners,
                partnerCategories,
                events,
                news,
                facilities,
                accreditations,
                users,
                activeUsers,
            },
            recentActivity: {
                news: recentNews,
                events: recentEvents,
            },
        }, 'Dashboard stats fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
