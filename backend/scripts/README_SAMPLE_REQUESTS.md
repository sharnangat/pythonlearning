# Sample Registration API Requests

This document contains sample requests to insert records using the registration API.

## Important Notes

⚠️ **CRITICAL**: The API expects `password` (plain text), NOT `password_hash`!
- ✅ Correct: `"password": "mypassword123"`
- ❌ Wrong: `"password_hash": "mypassword123"`

The backend will automatically hash the password and store it as `password_hash` in the database.

## API Endpoint

```
POST http://localhost:3000/api/user/register
Content-Type: application/json
```

## Required Fields

- `username` (string, 3-50 characters)
- `email` (string, valid email format, unique)
- `password` (string, any length - will be hashed automatically)

## Optional Fields

- `first_name` (string, max 100 characters)
- `last_name` (string, max 100 characters)
- `phone` (string, max 15 characters)
- `status` (string, default: 'pending_verification')
- `email_verified` (boolean, default: false)
- `phone_verified` (boolean, default: false)
- `failed_login_attempts` (integer, default: 0)
- `account_locked_until` (date string)
- `password_reset_token` (string, max 255)
- `password_reset_expires` (date string)
- `email_verification_token` (string, max 255)
- `email_verification_expires` (date string)
- `last_login` (date string)
- `last_login_ip` (string, max 45)
- `created_by` (UUID string)

## Sample Request (JSON)

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "status": "active",
  "email_verified": true,
  "phone_verified": false
}
```

## Testing Methods

### 1. Using Node.js Script
```bash
node scripts/testRegistrationAPI.js
```

### 2. Using cURL (Linux/Mac)
```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Using PowerShell (Windows)
```powershell
.\scripts\curlRegistrationExample.ps1
```

### 4. Using Postman/Insomnia
- Method: POST
- URL: `http://localhost:3000/api/user/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "username": "test_user",
  "email": "test@example.com",
  "password": "test123"
}
```

## Expected Response

**Success (201 Created):**
```json
{
  "id": "uuid-here",
  "username": "john_doe",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "status": "active",
  "email_verified": true,
  "phone_verified": false,
  "created_at": "2025-12-10T...",
  "updated_at": "2025-12-10T..."
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Password is required"
}
```

## Common Issues

1. **"Password is required"** - Make sure you're sending `password`, not `password_hash`
2. **"User already exists"** - Email must be unique
3. **"Invalid email address"** - Check email format
4. **"Username must be between 3 and 50 characters"** - Check username length


