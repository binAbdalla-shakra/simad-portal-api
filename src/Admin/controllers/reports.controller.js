const mongoose = require('mongoose');
const Program = require('../../models/program.model');
const Partner = require('../../models/partners.model');
const User = require('../../models/User.model');
const News = require('../../models/news.model');
const Event = require('../../models/Event.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

exports.programsBySchool = async (req, res) => {
    try {
        const data = await Program.aggregate([
            { $group: { _id: '$school', count: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'schools',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'school'
                }
            },
            {
                $project: {
                    _id: 0,
                    school: { $ifNull: [{ $arrayElemAt: ['$school.name', 0] }, 'Unassigned'] },
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);
        return successResponse(res, data, 'Programs by school fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

exports.usersByRole = async (req, res) => {
    try {
        const data = await User.aggregate([
            { $unwind: { path: '$roles', preserveNullAndEmptyArrays: true } },
            { $group: { _id: '$roles', count: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'roles',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            {
                $project: {
                    _id: 0,
                    role: { $ifNull: [{ $arrayElemAt: ['$role.type', 0] }, 'Unassigned'] },
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);
        return successResponse(res, data, 'Users by role fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

exports.partnersByCategory = async (req, res) => {
    try {
        const data = await Partner.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'partnerscategories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $project: {
                    _id: 0,
                    category: { $ifNull: [{ $arrayElemAt: ['$category.categoryName', 0] }, 'Uncategorized'] },
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);
        return successResponse(res, data, 'Partners by category fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

const monthlyGroup = (Model) => Model.aggregate([
    {
        $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5, 1)) }
        }
    },
    {
        $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 }
        }
    }
]);

exports.contentActivity = async (req, res) => {
    try {
        const [newsByMonth, eventsByMonth] = await Promise.all([
            monthlyGroup(News),
            monthlyGroup(Event)
        ]);

        const newsMap = Object.fromEntries(newsByMonth.map((m) => [m._id, m.count]));
        const eventsMap = Object.fromEntries(eventsByMonth.map((m) => [m._id, m.count]));

        const months = [];
        const cursor = new Date();
        cursor.setDate(1);
        for (let i = 5; i >= 0; i--) {
            const d = new Date(cursor.getFullYear(), cursor.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.push({
                month: key,
                news: newsMap[key] || 0,
                events: eventsMap[key] || 0
            });
        }

        return successResponse(res, months, 'Content activity fetched successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};
