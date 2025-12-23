const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log error with full details
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        code: err.code,
        name: err.name,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.userId || null,
        body: req.body,
        query: req.query,
    });

    // Database errors
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry. This record already exists.',
            error: err.detail
        });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({
            success: false,
            message: 'Invalid reference. Related record does not exist.',
            error: err.detail
        });
    }

    if (err.code === '23502') { // Not null violation
        return res.status(400).json({
            success: false,
            message: 'Required field is missing.',
            error: err.detail
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired.'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 handler
const notFound = (req, res, next) => {
    logger.warn('Route not found', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found.`
    });
};

module.exports = {
    errorHandler,
    notFound
};

