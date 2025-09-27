const School = require('../../models/school.model');
const Program = require('../../models/program.model'); // adjust path

const mongoose = require('mongoose');

const { successResponse, errorResponse } = require('../../utils/response');

// getSchoolsByCategoryID
exports.getSchoolsByCategoryID = async (req, res) => {
    try {
        const { category } = req.params;

        const schools = await School.find(category)
            .sort({ order: 1 }).select('name logoUrl');

        return successResponse(res, { schools });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


exports.getSchoolsInfoByID = async (req, res) => {
    try {
        const { id } = req.params;

        const school = await School.findById(id)
            .populate('dean', 'name title')
            .populate('category', 'name')
            .lean();

        if (!school) {
            return errorResponse(res, 'School not found', 404);
        }

        const programs = await Program.find({ school: new mongoose.Types.ObjectId(id) })
            .select('name shortName icon order')
            .sort({ order: 1 })
            .lean();
        // console.log("ddd", programs)
        const formatted = {
            id: school._id,
            name: school.name,
            tagline: school.tagline,
            shortDescription: school.shortDescription,
            logoUrl: school.logoUrl,
            coverImage: school.coverImage,

            dean: school.dean
                ? {
                    name: school.dean.name,
                    title: school.dean.title,
                    message: school.dean_message_sec_text,
                    section: {
                        title: school.dean_message_sec_title,
                        subtitle: school.dean_message_sec_subtitle,
                        icon: school.dean_message_sec_icon,
                    }
                }
                : null,

            vision: school.vision,
            mission: school.mission,
            visionAndMissionSection: {
                title: school.vison_and_mission_sec_title,
                subtitle: school.vison_and_mission_sec_subtitle,
                icon: school.vison_and_mission_sec_icon,
            },

            facts: {
                academic_programs: programs.length,
                academic_staff: school.facts_and_figures?.academic_staff,
                student_population: school.facts_and_figures?.student_population,
                founded_year: school.facts_and_figures?.founded_year,
            },
            factsSection: {
                title: school.facts_message_sec_title,
                subtitle: school.facts_message_sec_subtitle,
                icon: school.facts_message_sec_icon,
            },

            testimonials: school.student_testimonials?.map(t => ({
                student_name: t.student_name,
                message: t.message,
                program: t.student_program_shortName,
            })),
            testimonialsSection: {
                title: school.testimonials_message_sec_title,
                subtitle: school.testimonials_message_sec_subtitle,
                icon: school.testimonials_message_sec_icon,
            },

            programs: programs,
            programsSection: {
                title: school.programs_sec_title,
                subtitle: school.programs_sec_subtitle,
                icon: school.programs_sec_icon,
            },

            contact: school.contactInfo,
            contactSection: {
                title: school.contact_message_sec_title,
                subtitle: school.contact_message_sec_subtitle,
                icon: school.contact_message_sec_icon,
            },

            order: school.order,
            category: school.category?.name || null,
            createdBy: school.createdBy,
            updatedBy: school.updatedBy,
            createdAt: school.createdAt,
            updatedAt: school.updatedAt,
        };

        return successResponse(res, { school: formatted });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
