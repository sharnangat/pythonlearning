# Request & Response Logging

## Overview

The application logs all HTTP requests and responses to separate files for debugging and monitoring purposes.

## Log Files

### `logs/requests.log`
Contains all incoming HTTP requests with:
- Request ID (unique identifier)
- Timestamp
- HTTP method (GET, POST, PUT, DELETE, etc.)
- URL
- IP address
- User agent
- User ID (if authenticated)
- Headers (excluding sensitive data)
- Query parameters
- Route parameters
- Request body (sanitized)

### `logs/responses.log`
Contains all HTTP responses with:
- Request ID (matches request)
- Timestamp
- HTTP method
- URL
- Status code
- Duration (response time)
- IP address
- User ID (if authenticated)
- Response headers
- Response body (sanitized)

## Log Format

Each log entry is a JSON object on a single line:

```json
{
  "requestId": "1703347200000-abc123xyz",
  "timestamp": "2025-12-23T15:30:00.000Z",
  "method": "POST",
  "url": "/api/auth/login",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "headers": { "content-type": "application/json" },
  "query": {},
  "params": {},
  "body": { "username": "user@example.com", "password": "***REDACTED***" }
}
```

## Security Features

### Sensitive Data Redaction

The following fields are automatically redacted from logs:
- `password`
- `passwordHash`
- `password_hash`
- `token`
- `secret`
- `apiKey`
- `api_key`
- `creditCard`
- `credit_card`
- `cvv`
- `ssn`
- `otp`
- `verificationCode`

### Headers Excluded

The following headers are excluded from logs:
- `authorization` (contains JWT tokens)
- `cookie` (contains session data)
- `x-api-key` (API keys)

## API Endpoints

### Get Recent Requests
```
GET /api/logs/requests?limit=100
```
Returns recent requests (default: 100, max: 1000)

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [...],
    "count": 100
  }
}
```

### Get Recent Responses
```
GET /api/logs/responses?limit=100
```
Returns recent responses (default: 100, max: 1000)

**Response:**
```json
{
  "success": true,
  "data": {
    "responses": [...],
    "count": 100
  }
}
```

### Get Request-Response Pair
```
GET /api/logs/pair/:requestId
```
Returns both request and response for a specific requestId

**Response:**
```json
{
  "success": true,
  "data": {
    "pair": {
      "request": {...},
      "response": {...}
    }
  }
}
```

## Access Control

- Only `superAdmin` and `societyAdmin` roles can access log endpoints
- All requests require authentication

## Usage Examples

### View Recent Requests
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/logs/requests?limit=50
```

### View Recent Responses
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/logs/responses?limit=50
```

### Find Request-Response Pair
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/logs/pair/1703347200000-abc123xyz
```

## File Management

### Log File Location
- `backend/logs/requests.log`
- `backend/logs/responses.log`

### Log Rotation
- Log files are appended to continuously
- Consider implementing log rotation for production:
  - Use tools like `logrotate` (Linux)
  - Or implement custom rotation based on file size
  - Archive old logs for compliance

### Viewing Logs Directly

```bash
# View last 100 lines
tail -n 100 logs/requests.log

# Follow logs in real-time
tail -f logs/requests.log

# Search for specific requests
grep "POST /api/auth/login" logs/requests.log

# Pretty print JSON logs
tail -n 100 logs/requests.log | jq '.'

# Count requests by method
grep -o '"method":"[^"]*"' logs/requests.log | sort | uniq -c
```

## Performance Considerations

- Logging is asynchronous and non-blocking
- Large response bodies are truncated (>5000 chars)
- String responses are limited (>2000 chars)
- Sensitive data is automatically redacted

## Best Practices

1. **Regular Monitoring**: Review logs regularly for errors and suspicious activity
2. **Log Rotation**: Implement log rotation to prevent disk space issues
3. **Access Control**: Only admins should access log endpoints
4. **Data Retention**: Define retention policies based on compliance requirements
5. **Privacy**: Ensure sensitive data is properly redacted
6. **Performance**: Monitor log file sizes and disk usage

## Troubleshooting

### Logs Not Appearing
- Check that `logs/` directory exists and is writable
- Verify file permissions
- Check application logs for errors

### Large Log Files
- Implement log rotation
- Consider archiving old logs
- Review what's being logged

### Missing Request/Response Pairs
- Request and response are logged separately
- Use `requestId` to match them
- Check both files if one is missing

## Integration with Monitoring Tools

These log files can be integrated with:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Datadog**
- **New Relic**
- **CloudWatch** (AWS)
- **Application Insights** (Azure)

Simply configure your monitoring tool to tail these log files.

