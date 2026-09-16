const News = require('../../models/news.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3, deleteFromS3 } = require('../../service/upload.service');
const { getReadableMessage } = require('../../utils/error-messages');
exports.createOrUpdateNews = async (req, res) => {
    try {
        const { _id } = req.body;

        // Handle image upload (e.g. news cover image)
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToS3(req.file, 'news');
        }

        const newsData = {
            ...req.body,
        };

        delete newsData._id; // Avoid accidentally overwriting _id

        let existingNews;
        if (_id) {
            existingNews = await News.findById(_id);
            if (!existingNews) {
                return errorResponse(res, 'News not found for update', 404);
            }
        }

        if (req.file) {
            // If a new image was uploaded, use it
            newsData.image = imageUrl;

            // Delete old image from S3 if updating
            if (_id && existingNews?.image) {
                await deleteFromS3(existingNews.image);
            }
        } else if (_id) {
            // If updating and no new image was uploaded, retain existing image
            newsData.image = existingNews?.image || '';
        } else {
            // Creating without image
            newsData.image = '';
        }

        let resultNews;

        if (_id) {
            // UPDATE operation
            resultNews = await News.findByIdAndUpdate(
                _id,
                {
                    ...newsData,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            );
        } else {
            // CREATE operation
            const newNews = new News(newsData);
            resultNews = await newNews.save();
        }

        const message = _id
            ? 'News updated successfully'
            : 'News created successfully';

        const statusCode = _id ? 200 : 201;

        return successResponse(res, { news: resultNews }, message, statusCode);

    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

//  Get All News
exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        return successResponse(res, { news }, 'News fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error));
    }
};

//  Get Single News by ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return errorResponse(res, 'News not found', 404);
        return successResponse(res, news, 'News fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error));
    }
};


//  Delete News
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return errorResponse(res, 'News not found', 404);
        if (news.image) {
            await deleteFromS3(news.image);
        }
        return successResponse(res, news, 'News deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error));
    }
};
