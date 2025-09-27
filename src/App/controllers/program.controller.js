const Program = require('../../models/program.model');
const { successResponse, errorResponse } = require('../../utils/response');

// Get single program by ID
exports.getProgramsInfoByID = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the program by ID
        const program = await Program.findById(id).lean();
        if (!program) {
            return errorResponse(res, 'Program not found', 404);
        }

        // Map schema → formatted response
        const programDetails = {
            title: program.name,
            subtitle: program.tagline || '',
            about: {
                title: program.about_program_sec_title,
                subtitle: program.about_program_sec_info,
                icon: program.about_program_sec_icon,
            },
            fees: {
                semester: program.sem_fee ? `$${program.sem_fee}` : '$0',
                duration: `${program.duration} Years`,
                section: {
                    duraction_sec_icon: program.duration_sec_icon,
                    duration_sec_title: program.duration_sec_title,
                    sem_sec_icon: program.sem_fee_sec_icon,
                    sem_sec_title: program.sem_fee_sec_title,
                },
            },
            curriculum: {
                title: program.curriculum_sec_title,
                subtitle: program.curriculum_sec_desc,
                icon: program.curriculum_sec_icon,
                list: program.curriculum.map((c) => ({
                    title: c.title,
                    subtitle: c.description,
                    icon: c.icon,
                    order: c.order,
                })),
            },
            admissions: {
                title: program.admissionRequirements_sec_title,
                subtitle: program.admissionRequirements_sec_desc,
                icon: program.admissionRequirements_sec_icon,
                list: program.admissionRequirements,
            },
            careers: {
                title: program.careerPaths_sec_title,
                subtitle: program.careerPaths_sec_desc,
                icon: program.careerPaths_sec_icon,
                list: program.careerPaths.map((c) => ({
                    title: c.title,
                    subtitle: c.description,
                    icon: c.icon,
                    order: c.order,
                })),
            },
            provider: program.provider,
            coverImage: program.coverImage,
            externalLink: program.externalLink,
        };

        return successResponse(res, { program: programDetails });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
