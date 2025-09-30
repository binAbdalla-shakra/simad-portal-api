const News = require('../../models/news.model');
const Event = require('../../models/Event.model');
const { successResponse, errorResponse } = require('../../utils/response');


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


// Get active events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .select('title image date duration startTime location description')
            ;
        return successResponse(res, events, 'Events fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};