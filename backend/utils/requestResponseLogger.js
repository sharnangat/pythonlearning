const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log request details to file
 */
function logRequest(req, requestId) {
    const { method, originalUrl, ip, headers, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';

    // Prepare request headers (exclude sensitive data)
    const requestHeaders = { ...headers };
    delete requestHeaders.authorization;
    delete requestHeaders.cookie;
    delete requestHeaders['x-api-key'];

    const requestData = {
        requestId,
        timestamp: new Date().toISOString(),
        method,
        url: originalUrl,
        ip,
        userAgent,
        userId: req.userId || null,
        headers: requestHeaders,
        query: Object.keys(query).length > 0 ? query : undefined,
        params: Object.keys(params).length > 0 ? params : undefined,
        body: body && Object.keys(body).length > 0 ? sanitizeBody(body) : undefined,
    };

    writeToFile('requests.log', requestData);
}

/**
 * Log response details to file
 */
function logResponse(req, res, responseBody, requestId, duration) {
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const responseData = {
        requestId,
        timestamp: new Date().toISOString(),
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        ip,
        userId: req.userId || null,
        responseHeaders: res.getHeaders(),
        responseBody: sanitizeResponse(responseBody),
    };

    writeToFile('responses.log', responseData);
}

/**
 * Sanitize request body to remove sensitive data
 */
function sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
        return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = [
        'password',
        'passwordHash',
        'password_hash',
        'token',
        'secret',
        'apiKey',
        'api_key',
        'creditCard',
        'credit_card',
        'cvv',
        'ssn',
        'otp',
        'verificationCode',
    ];

    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '***REDACTED***';
        }
    }

    return sanitized;
}

/**
 * Sanitize response body to remove sensitive data
 */
function sanitizeResponse(body) {
    if (!body) {
        return null;
    }

    try {
        // If body is a string, try to parse it
        let parsedBody = body;
        if (typeof body === 'string') {
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                // If not JSON, limit length
                return body.length > 2000 ? body.substring(0, 2000) + '... [truncated]' : body;
            }
        }

        // If it's an object, sanitize it
        if (typeof parsedBody === 'object') {
            const sanitized = sanitizeBody(parsedBody);
            // Limit depth to prevent huge objects
            return JSON.stringify(sanitized).length > 5000
                ? JSON.stringify(sanitized).substring(0, 5000) + '... [truncated]'
                : sanitized;
        }

        // Limit string length
        if (typeof parsedBody === 'string' && parsedBody.length > 2000) {
            return parsedBody.substring(0, 2000) + '... [truncated]';
        }

        return parsedBody;
    } catch (error) {
        return '[Unable to parse response]';
    }
}

/**
 * Write data to log file
 */
function writeToFile(filename, data) {
    const filePath = path.join(logsDir, filename);
    const logEntry = JSON.stringify(data) + '\n';

    // Append to file asynchronously (non-blocking)
    fs.appendFile(filePath, logEntry, (err) => {
        if (err) {
            logger.error('Failed to write to log file', {
                filename,
                error: err.message,
            });
        }
    });
}

/**
 * Read requests from log file
 */
function readRequests(limit = 100) {
    try {
        const filePath = path.join(logsDir, 'requests.log');
        if (!fs.existsSync(filePath)) {
            return [];
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.trim().split('\n').filter(line => line.trim());
        const requests = lines
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return null;
                }
            })
            .filter(req => req !== null)
            .slice(-limit)
            .reverse();

        return requests;
    } catch (error) {
        logger.error('Failed to read requests log', { error: error.message });
        return [];
    }
}

/**
 * Read responses from log file
 */
function readResponses(limit = 100) {
    try {
        const filePath = path.join(logsDir, 'responses.log');
        if (!fs.existsSync(filePath)) {
            return [];
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.trim().split('\n').filter(line => line.trim());
        const responses = lines
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return null;
                }
            })
            .filter(res => res !== null)
            .slice(-limit)
            .reverse();

        return responses;
    } catch (error) {
        logger.error('Failed to read responses log', { error: error.message });
        return [];
    }
}

/**
 * Get request-response pair by requestId
 */
function getRequestResponsePair(requestId) {
    const requests = readRequests(1000);
    const responses = readResponses(1000);

    const request = requests.find(req => req.requestId === requestId);
    const response = responses.find(res => res.requestId === requestId);

    return { request, response };
}

module.exports = {
    logRequest,
    logResponse,
    readRequests,
    readResponses,
    getRequestResponsePair,
};

