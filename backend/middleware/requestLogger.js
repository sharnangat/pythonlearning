const logger = require('../utils/logger');
const { logRequest, logResponse } = require('../utils/requestResponseLogger');

/**
 * Request logging middleware
 * Logs all HTTP requests with method, URL, status code, response time, IP, headers, body, and response
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store requestId in request object for later use
    req.requestId = requestId;

    // Log request to file
    logRequest(req, requestId);

    // Log request start to console/combined log
    logger.info('Incoming request', {
        requestId,
        method,
        url: originalUrl,
        ip,
        userAgent,
        userId: req.userId || null,
    });

    // Capture response body
    const originalSend = res.send;
    const originalJson = res.json;
    let responseBody = null;

    // Override res.send to capture response body
    res.send = function (data) {
        responseBody = data;
        return originalSend.call(this, data);
    };

    // Override res.json to capture response body
    res.json = function (data) {
        responseBody = data;
        return originalJson.call(this, data);
    };

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;
        const { statusCode } = res;

        // Log response to file
        logResponse(req, res, responseBody, requestId, duration);

        // Determine log level based on status code
        let logLevel = 'info';
        if (statusCode >= 500) {
            logLevel = 'error';
        } else if (statusCode >= 400) {
            logLevel = 'warn';
        }

        // Log response to console/combined log
        logger[logLevel]('Request completed', {
            requestId,
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userId: req.userId || null,
        });

        // Call original end
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

module.exports = requestLogger;
