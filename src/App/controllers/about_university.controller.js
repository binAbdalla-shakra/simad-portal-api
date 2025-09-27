const University = require('../../models/University.model');
const WhySimad = require('../../models/WhySimad.model');
const History = require('../../models/History.model');
const Senate = require('../../models/Senate.model');
const Accreditation = require('../../models/Accreditation.model');
const cheerio = require("cheerio");

const striptags = require('striptags');
const { JSDOM } = require('jsdom');
const { successResponse, errorResponse } = require('../../utils/response');

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


exports.getWhySimadData = async (req, res) => {
    try {

        const whySimadItems = await WhySimad.find({ isActive: true }).sort({ order: 1 }).select('title description image');


        return successResponse(res, {

            whySimadItems,

        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }

}

exports.getRectorsMessage = async (req, res) => {
    try {

        const RectorMessage = await Senate.findOne({ isActive: true, position: "The Rector" }).sort({ order: 1 }).select('name position image bio message email');

        return successResponse(res, {
            RectorMessage,
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }

}

exports.getSenateList = async (req, res) => {
    try {
        const senateList = await Senate.find({ isActive: true }).sort({ order: 1 }).select('name position image bio message email');

        return successResponse(res, {
            senateList,
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }

}

exports.getHistoryAwardData = async (req, res) => {
    try {
        const historyItems = await History.find({ isActive: true }).sort({ year: -1 }).select('year events');

        return successResponse(res, {
            historyItems,
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }

}


exports.getAccreditationsData = async (req, res) => {
    try {
        const accreditations = await Accreditation.find({ isActive: true }).sort({ order: 1 }).select('name logo message');

        return successResponse(res, {
            accreditations,
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }

}




exports.getUniVisionAndMission = async (req, res) => {
    try {
        const university = await University.findOne({}).select("description");

        if (!university || !university.description) {
            return res.status(404).json({ success: false, message: "No data found" });
        }

        const { mission, vision, guiding_principles, core_values } =
            university.description;

        // Helper function to extract text & points from HTML
        const parseSection = (html) => {
            const $ = cheerio.load(html || "");
            const text = $("p")
                .map((_, el) => $(el).text().trim())
                .get()
                .join(" ");
            const points = $("li")
                .map((_, el) => $(el).text().trim())
                .get();
            return { text: text || null, points };
        };

        const responseData = {
            vision: cheerio.load(vision || "")("p").text().trim(),
            mission: parseSection(mission),
            guidingPrinciples: parseSection(guiding_principles),
            coreValues: parseSection(core_values),
        };

        return res.json({
            statusCode: 200,
            data: responseData,
            message: "Success",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
