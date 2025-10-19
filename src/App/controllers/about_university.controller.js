const University = require('../../models/University.model');
const WhySimad = require('../../models/WhySimad.model');
const History = require('../../models/History.model');
const Senate = require('../../models/Senate.model');
const Accreditation = require('../../models/Accreditation.model');
const cheerio = require("cheerio");

const striptags = require('striptags');
const { JSDOM } = require('jsdom');
const { successResponse, errorResponse } = require('../../utils/response');
const School = require('../../models/school.model');
const Program = require('../../models/program.model');
const Partner = require('../../models/partners.model');




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




        return successResponse(res, {
            vision: vision,
            mission: mission,
            guidingPrinciples: guiding_principles,
            coreValues: core_values,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Helper to convert numbers to "x.xk+" format
function formatCount(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k+';
    }
    return num.toString();
}

exports.getSimadInNumbers = async (req, res) => {
    try {
        const university = await University.findOne({});
        if (!university) {
            return errorResponse(res, 'University data not found', 404);
        }

        const totalCurrentStudents = formatCount(university.stats.students || 0);
        const totalAlumniStudents = formatCount(university.stats.alumni || 0);
        const totalLabs = university.stats.labs || "15+";
        const totalCampuses = university.stats.campuses || "2";

        const schoolsNumberRaw = await School.countDocuments({});
        const programsNumberRaw = await Program.countDocuments({});
        const partnersNumberRaw = await Partner.countDocuments({});

        const schoolsNumber = schoolsNumberRaw + '+';
        const programsNumber = programsNumberRaw + '+';
        const partnersNumber = partnersNumberRaw + '+';

        return successResponse(res, {
            totalCurrentStudents,
            totalAlumniStudents,
            totalLabs,
            totalCampuses,
            schoolsNumber,
            programsNumber,
            partnersNumber
        }, 'SIMAD in Numbers fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};




exports.getAboutSimad = async (req, res) => {
    try {
        const university = await University.findOne().select(
            'name slug type founded motto address contact academics logo backgroundImage about_simad socialMedia'
        );

        if (!university) {
            return errorResponse(res, 'SIMAD University data not found', 404);
        }

        return successResponse(
            res,
            { university },
            'About SIMAD University fetched successfully'
        );

    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

