// Turns raw Mongoose/Multer/Mongo driver errors into a message that's safe
// and clear to show directly to an end user, instead of the technical
// "School validation failed: category: Path `category` is required." style
// text those libraries produce by default.
const getReadableMessage = (error) => {
    if (!error) return 'Something went wrong. Please try again.';

    // Mongoose validation errors (missing required field, bad enum, etc.)
    if (error.name === 'ValidationError' && error.errors) {
        return Object.values(error.errors)
            .map((fieldError) => fieldError.message)
            .join(' ');
    }

    // Mongoose cast errors (e.g. an invalid ObjectId passed as an id/ref)
    if (error.name === 'CastError') {
        return `Invalid value provided for "${error.path}".`;
    }

    // MongoDB duplicate key errors (unique index violation)
    if (error.code === 11000 || error.name === 'MongoServerError' && error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0];
        const value = field ? error.keyValue[field] : undefined;
        return field
            ? `"${value}" is already in use for "${field}". Please choose a different value.`
            : 'This record already exists.';
    }

    // Multer upload errors already carry a clear .message ("File too large",
    // "Field value too long", etc.) - use it as-is.
    if (error.name === 'MulterError') {
        return error.message;
    }

    return error.message || 'Something went wrong. Please try again.';
};

module.exports = { getReadableMessage };
