# ✅ Request & Response Logging Setup Complete

## Summary

Request and response logging to files has been successfully implemented. All HTTP requests and responses are now logged to separate files with full details.

## Files Created

1. **`utils/requestResponseLogger.js`** - Utility for logging requests/responses
   - `logRequest()` - Logs request details
   - `logResponse()` - Logs response details
   - `readRequests()` - Read requests from log file
   - `readResponses()` - Read responses from log file
   - `getRequestResponsePair()` - Get matching request/response pair

2. **`routes/logRoutes.js`** - API endpoints to view logs
   - `GET /api/logs/requests` - Get recent requests
   - `GET /api/logs/responses` - Get recent responses
   - `GET /api/logs/pair/:requestId` - Get request-response pair

3. **`REQUEST_RESPONSE_LOGGING.md`** - Comprehensive documentation

## Files Updated

1. **`middleware/requestLogger.js`** - Enhanced to log full request/response details
   - Logs request headers, body, query params, route params
   - Logs response headers and body
   - Captures response body by intercepting res.send/res.json
   - Sanitizes sensitive data automatically

2. **`server.js`** - Added log routes

## Log Files

### `logs/requests.log`
Each line is a JSON object containing:
- `requestId` - Unique identifier
- `timestamp` - ISO timestamp
- `method` - HTTP method
- `url` - Request URL
- `ip` - Client IP
- `userAgent` - User agent string
- `userId` - Authenticated user ID (if any)
- `headers` - Request headers (sensitive ones excluded)
- `query` - Query parameters
- `params` - Route parameters
- `body` - Request body (sanitized)

### `logs/responses.log`
Each line is a JSON object containing:
- `requestId` - Matches request ID
- `timestamp` - ISO timestamp
- `method` - HTTP method
- `url` - Request URL
- `statusCode` - HTTP status code
- `duration` - Response time in milliseconds
- `ip` - Client IP
- `userId` - Authenticated user ID (if any)
- `responseHeaders` - Response headers
- `responseBody` - Response body (sanitized)

## Security Features

### Automatic Data Sanitization

Sensitive fields are automatically redacted:
- `password`, `passwordHash`, `password_hash`
- `token`, `secret`
- `apiKey`, `api_key`
- `creditCard`, `credit_card`, `cvv`
- `ssn`, `otp`, `verificationCode`

### Headers Excluded

- `authorization` (JWT tokens)
- `cookie` (session data)
- `x-api-key` (API keys)

## API Endpoints

### Get Recent Requests
```bash
GET /api/logs/requests?limit=100
```
**Access:** Admin only (superAdmin, societyAdmin)

### Get Recent Responses
```bash
GET /api/logs/responses?limit=100
```
**Access:** Admin only (superAdmin, societyAdmin)

### Get Request-Response Pair
```bash
GET /api/logs/pair/:requestId
```
**Access:** Admin only (superAdmin, societyAdmin)

## Usage Examples

### View Logs via API
```bash
# Get recent requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/logs/requests?limit=50

# Get recent responses
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/logs/responses?limit=50

# Get specific request-response pair
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/logs/pair/1703347200000-abc123xyz
```

### View Logs Directly
```bash
# View last 100 requests
tail -n 100 logs/requests.log | jq '.'

# Follow requests in real-time
tail -f logs/requests.log | jq '.'

# Search for specific endpoint
grep "POST /api/auth/login" logs/requests.log | jq '.'

# Count requests by method
grep -o '"method":"[^"]*"' logs/requests.log | sort | uniq -c

# Find slow requests (>1000ms)
grep -E '"duration":"[0-9]{4,}ms"' logs/responses.log | jq '.'
```

## Features

✅ **Full Request Logging** - Headers, body, query, params  
✅ **Full Response Logging** - Headers, body, status, duration  
✅ **Request-Response Matching** - Linked by requestId  
✅ **Data Sanitization** - Sensitive data automatically redacted  
✅ **Non-Blocking** - Asynchronous file writes  
✅ **API Access** - View logs via REST API  
✅ **Admin Only** - Secure access control  

## Log Format Example

### Request Log Entry
```json
{
  "requestId": "1703347200000-abc123xyz",
  "timestamp": "2025-12-23T15:30:00.000Z",
  "method": "POST",
  "url": "/api/auth/login",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "userId": null,
  "headers": {
    "content-type": "application/json",
    "accept": "application/json"
  },
  "query": {},
  "params": {},
  "body": {
    "username": "user@example.com",
    "password": "***REDACTED***"
  }
}
```

### Response Log Entry
```json
{
  "requestId": "1703347200000-abc123xyz",
  "timestamp": "2025-12-23T15:30:00.150Z",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "duration": "150ms",
  "ip": "127.0.0.1",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "responseHeaders": {
    "content-type": "application/json"
  },
  "responseBody": {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {...},
      "token": "***REDACTED***"
    }
  }
}
```

## Performance

- **Asynchronous Logging** - Non-blocking file writes
- **Size Limits** - Large bodies truncated (>5000 chars for objects, >2000 for strings)
- **Efficient** - JSON lines format for easy parsing

## Status

✅ Request logging active  
✅ Response logging active  
✅ Log files created automatically  
✅ API endpoints available  
✅ Server running successfully  

**Request & Response logging is fully operational!** 🎉

