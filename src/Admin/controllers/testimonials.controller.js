const Testimonial = require('../models/Testimonial.model');
const { successResponse, errorResponse } = require('../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Get all testimonials with optional filtering
exports.getAllTestimonials = async (req, res) => {
    try {
        const {
            program,
            school,
            isFeatured,
            isActive = true
        } = req.query;

        const filter = { isActive };
        if (program) filter.program = program;
        if (school) filter.school = school;
        if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

        const testimonials = await Testimonial.find(filter)
            .populate('program', 'name')
            .populate('school', 'name')
            .sort({ order: 1, isFeatured: -1, createdAt: -1 });

        return successResponse(res, { testimonials });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get single testimonial by ID
exports.getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id)
            .populate('program', 'name')
            .populate('school', 'name');

        if (!testimonial) {
            return errorResponse(res, 'Testimonial not found', 404);
        }

        return successResponse(res, { testimonial });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Create new testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const testimonialData = req.body;

        const newTestimonial = new Testimonial(testimonialData);
        await newTestimonial.save();

        await newTestimonial.populate('program school');

        return successResponse(res, { testimonial: newTestimonial }, 'Testimonial created successfully', 201);
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return errorResponse(res, 'Testimonial not found', 404);
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('program school');

        return successResponse(res, { testimonial: updatedTestimonial }, 'Testimonial updated successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Delete testimonial (soft delete)
exports.deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return errorResponse(res, 'Testimonial not found', 404);
        }

        testimonial.isActive = false;
        await testimonial.save();

        return successResponse(res, null, 'Testimonial deleted successfully');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get featured testimonials
exports.getFeaturedTestimonials = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const testimonials = await Testimonial.find({
            isFeatured: true,
            isActive: true
        })
            .populate('program', 'name')
            .populate('school', 'name')
            .sort({ order: 1, createdAt: -1 })
            .limit(parseInt(limit));

        return successResponse(res, { testimonials });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Get testimonials by program
exports.getTestimonialsByProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const { isActive = true } = req.query;

        const testimonials = await Testimonial.find({
            program: programId,
            isActive
        })
            .populate('school', 'name')
            .sort({ order: 1, isFeatured: -1 });

        return successResponse(res, { testimonials });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};

// Toggle testimonial featured status
exports.toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return errorResponse(res, 'Testimonial not found', 404);
        }

        testimonial.isFeatured = !testimonial.isFeatured;
        await testimonial.save();

        return successResponse(res, {
            testimonial,
            message: `Testimonial ${testimonial.isFeatured ? 'featured' : 'unfeatured'} successfully`
        });
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};