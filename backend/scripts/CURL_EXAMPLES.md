# cURL Examples for User Registration

## Basic Registration (cURL - Linux/Mac)

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "1234567890"
  }'
```

## Minimal Registration (Only Required Fields)

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Full Registration (All Fields)

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_smith",
    "email": "jane.smith@example.com",
    "password": "securepass123",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "5551234567",
    "status": "active",
    "email_verified": true,
    "phone_verified": true,
    "failed_login_attempts": 0
  }'
```

## PowerShell (Windows)

```powershell
$body = @{
    username = "john_doe"
    email = "john.doe@example.com"
    password = "password123"
    first_name = "John"
    last_name = "Doe"
    phone = "1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/user/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## With Pretty Print (jq on Linux/Mac)

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }' | jq .
```

## Save Response to File

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }' -o response.json
```

## With Verbose Output

```bash
curl -v -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

## Important Notes

1. **Use `password`, NOT `password_hash`** - The backend will hash it automatically
2. **Email must be unique** - Duplicate emails will return 409 Conflict
3. **Username must be 3-50 characters**
4. **Password can be any length** (no minimum requirement)

## Expected Success Response (201)

```json
{
  "id": "uuid-here",
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password_hash": "$2b$10$...",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "status": "pending_verification",
  "email_verified": false,
  "phone_verified": false,
  "created_at": "2025-12-11T...",
  "updated_at": "2025-12-11T..."
}
```

## Error Responses

**400 Bad Request:**
```json
{
  "message": "Password is required"
}
```

**409 Conflict:**
```json
{
  "message": "User already exists with this email"
}
```

