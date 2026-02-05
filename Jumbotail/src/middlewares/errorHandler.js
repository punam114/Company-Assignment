class ApiError extends Error {
    constructor(statusCode, message, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'INTERNAL_ERROR';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
        code = 'VALIDATION_ERROR';
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists`;
        code = 'DUPLICATE_ERROR';
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        code = 'INVALID_ID';
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        code: code
    });
};

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route not found: ${req.originalUrl}`, 'NOT_FOUND');
    next(error);
};

module.exports = {
    ApiError,
    errorHandler,
    notFound
};