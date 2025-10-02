const { ApiError } = require('../utils/error-handler');
const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message);
    }

    // ✅ Add CORS headers manually here
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    return errorResponse(
        res,
        error.message,
        error.statusCode
    );
};

module.exports = errorHandler;


// const { ApiError } = require('../utils/error-handler');
// const { errorResponse } = require('../utils/response');

// const errorHandler = (err, req, res, next) => {
//     let error = err;

//     if (!(error instanceof ApiError)) {
//         const statusCode = error.statusCode || 500;
//         const message = error.message || 'Internal Server Error';
//         error = new ApiError(statusCode, message);
//     }

//     return errorResponse(
//         res,
//         error.message,
//         error.statusCode
//     );
// };

// module.exports = errorHandler;