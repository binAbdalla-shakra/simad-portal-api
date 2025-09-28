const Partner = require('../../models/partners.model');
const PartnerCategory = require('../../models/partnersCategory.model');
const { successResponse, errorResponse } = require('../../utils/response');


// Ge// Get partners grouped by category 
exports.getPartnersInfo = async (req, res) => {
    try {
        // Find all categories
        const categories = await PartnerCategory.find({});

        // Prepare result array
        const result = [];

        for (const category of categories) {
            // Find partners for this category
            const partners = await Partner.find({ category: category._id }).sort({ name: 1 });

            // Map partners to required structure
            const formattedPartners = partners.map((partner) => ({
                id: partner._id.toString(),
                name: partner.name,
                description: partner.desc,
                logo: partner.logo,
                howLong: partner.howLong || 'N/A'
            }));

            result.push({
                id: category._id.toString(),
                title: category.categoryName,
                partners: formattedPartners
            });
        }

        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
