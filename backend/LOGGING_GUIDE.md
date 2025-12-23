# Logging Guide

## Overview

The application uses Winston for comprehensive logging. Logs are written to both files and console (in development).

## Log Files

All logs are stored in the `logs/` directory:

- **combined.log** - All logs (info, warn, error, debug)
- **error.log** - Only error level logs
- **exceptions.log** - Unhandled exceptions
- **rejections.log** - Unhandled promise rejections

## Log Levels

- **error** - Error events that might still allow the application to continue
- **warn** - Warning messages for potentially harmful situations
- **info** - Informational messages highlighting the progress of the application
- **debug** - Detailed information for debugging

## Usage

### Basic Usage

```javascript
const logger = require('../utils/logger');

// Log info message
logger.info('User logged in', { userId: 123, email: 'user@example.com' });

// Log warning
logger.warn('Slow query detected', { duration: '2500ms', query: 'SELECT * FROM users' });

// Log error
logger.error('Failed to create user', { error: err.message, stack: err.stack });

// Log debug (only in development)
logger.debug('Processing request', { method: 'POST', url: '/api/users' });
```

### In Controllers

```javascript
const logger = require('../utils/logger');
const { query } = require('../config/database');

const createUser = async (req, res, next) => {
    try {
        logger.info('Creating user', { email: req.body.email });
        
        const result = await query('INSERT INTO users ...');
        
        logger.info('User created successfully', { userId: result.rows[0].id });
        
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        logger.error('Failed to create user', {
            error: error.message,
            stack: error.stack,
            body: req.body,
        });
        next(error);
    }
};
```

### In Middleware

```javascript
const logger = require('../utils/logger');

const customMiddleware = (req, res, next) => {
    logger.debug('Custom middleware executed', {
        method: req.method,
        url: req.originalUrl,
        userId: req.userId,
    });
    next();
};
```

## Automatic Logging

### Request Logging

All HTTP requests are automatically logged by the `requestLogger` middleware:
- Request method, URL, IP, user agent
- Response status code and duration
- User ID (if authenticated)

### Error Logging

All errors are automatically logged by the `errorHandler` middleware:
- Error message and stack trace
- Request details (method, URL, IP, body, query)
- User ID (if authenticated)

### Database Query Logging

Database queries are automatically logged:
- Slow queries (>1000ms) are logged as warnings
- Query errors are logged as errors
- In development, all queries are logged as debug

## Environment Variables

- **LOG_LEVEL** - Set log level (default: 'info')
  - Options: 'error', 'warn', 'info', 'debug'
- **NODE_ENV** - Environment (affects console logging)
  - 'development' - Logs to console and files
  - 'production' - Logs only to files

## Log Rotation

Log files are automatically rotated:
- Maximum file size: 5MB
- Maximum files: 5 per log type
- Old files are automatically archived

## Best Practices

1. **Use appropriate log levels**
   - `error` - For errors that need attention
   - `warn` - For warnings that might need investigation
   - `info` - For important events (user actions, system events)
   - `debug` - For detailed debugging information

2. **Include context**
   - Always include relevant context (userId, resourceId, etc.)
   - Include request details when logging in controllers
   - Include error details when logging errors

3. **Don't log sensitive data**
   - Never log passwords, tokens, or sensitive user data
   - Be careful with request bodies that might contain sensitive data

4. **Use structured logging**
   - Always use objects for metadata
   - This makes logs easier to search and parse

## Example Log Output

```
2025-12-23 15:30:11 [info]: User logged in {"userId":123,"email":"user@example.com"}
2025-12-23 15:30:12 [info]: Request completed {"method":"POST","url":"/api/auth/login","statusCode":200,"duration":"150ms"}
2025-12-23 15:30:15 [warn]: Slow query detected {"duration":"2500ms","query":"SELECT * FROM users WHERE..."}
2025-12-23 15:30:20 [error]: Failed to create user {"error":"Duplicate entry","stack":"..."}
```

## Viewing Logs

### In Development
Logs are displayed in the console with colors.

### In Production
View logs from files:
```bash
# View all logs
tail -f logs/combined.log

# View only errors
tail -f logs/error.log

# Search logs
grep "User logged in" logs/combined.log
```

## Log Analysis

For production environments, consider:
- Using log aggregation tools (ELK, Splunk, etc.)
- Setting up log monitoring and alerts
- Regular log rotation and archival
- Log retention policies

