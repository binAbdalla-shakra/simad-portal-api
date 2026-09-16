const News = require('../../models/news.model');
const Event = require('../../models/Event.model');
const { successResponse, errorResponse } = require('../../utils/response');
const Facility = require('../../models/Facility.model');


//  Get active news
exports.getActiveNews = async (req, res) => {
    try {
        const news = await News.find({ isActive: true })
            .sort({ date: -1 })
            .select('_id title image toWhom infoLink date description category'); // select only these fields

        return successResponse(res, news, 'News fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const startOfToday = new Date();
startOfToday.setUTCHours(0, 0, 0, 0);
// Get active events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: startOfToday } })
            .sort({ date: 1 })
            .select('title image date duration startTime location description')
            ;
        return successResponse(res, events, 'Events fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


// get facilities
exports.getFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ createdAt: -1 });
        return successResponse(res, facilities, 'Facilities fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};