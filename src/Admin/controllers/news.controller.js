const News = require('../../models/news.model');
const { successResponse, errorResponse } = require('../../utils/response');

//  Create News
exports.createNews = async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();
        return successResponse(res, news, 'News created successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

//  Get All News
exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        return successResponse(res, news, 'News fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

//  Get Single News by ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return errorResponse(res, 'News not found', 404);
        return successResponse(res, news, 'News fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

//  Update News
exports.updateNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return errorResponse(res, 'News not found', 404);
        return successResponse(res, news, 'News updated successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

//  Delete News
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return errorResponse(res, 'News not found', 404);
        return successResponse(res, news, 'News deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
