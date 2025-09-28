const Program = require('../../models/program.model');
const ProgramCategory = require('../../models/ProgramCategory.model');
const School = require('../../models/school.model');

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




exports.getAvaliableProgramsInfo = async (req, res) => {
    try {
        // Step 1: Get all categories
        const categories = await ProgramCategory.find({ isActive: true })
            .sort({ order: 1 })
            .lean();

        // Step 2: Get all schools linked to categories
        const schools = await School.find()
            .populate('category', 'name description icon')
            .sort({ order: 1 })
            .lean();

        // Step 3: Get all programs linked to schools
        const programs = await Program.find()
            .sort({ order: 1 })
            .lean();

        // Step 4: Build structured response
        const groupedData = {};

        for (const category of categories) {
            groupedData[category._id] = {
                title: category.name,
                color: '#f1f8f2',
                subPrograms: [],
            };
        }

        for (const school of schools) {
            const schoolCategoryId = school.category?._id;
            if (!groupedData[schoolCategoryId]) continue;

            const schoolPrograms = programs
                .filter((p) => String(p.school) === String(school._id))
                .map((p) => ({
                    id: p._id,
                    name: p.name,
                    icon: p.icon || 'school-outline',
                }));

            groupedData[schoolCategoryId].subPrograms.push({
                id: school._id,
                name: school.name,
                type: 'category',
                programs: schoolPrograms,
            });
        }

        // Convert object → response format
        const response = Object.values(groupedData);

        return successResponse(res, { programs: response });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


