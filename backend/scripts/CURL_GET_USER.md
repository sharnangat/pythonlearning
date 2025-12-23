# Get User API cURL Examples

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

## 1. Get All Users

**GET** `/users`

Retrieves all users from the database.

### cURL Command
```bash
curl -X GET http://localhost:3000/api/users
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/users | jq .
```

### With Headers
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Accept: application/json"
```

### Save to File
```bash
curl -X GET http://localhost:3000/api/users -o users.json
```

### Verbose Output
```bash
curl -v -X GET http://localhost:3000/api/users
```

---

## 2. Get User by ID

**GET** `/users/:id`

Retrieves a specific user by their UUID.

### cURL Command
```bash
curl -X GET http://localhost:3000/api/users/{uuid-here}
```

### Example
```bash
curl -X GET http://localhost:3000/api/users/3f5c3cea-35ab-4e3d-8be2-d0966ecb9014
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/users/{uuid-here} | jq .
```

### With Headers
```bash
curl -X GET http://localhost:3000/api/users/{uuid-here} \
  -H "Accept: application/json"
```

---

## PowerShell Examples

### Get All Users
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
    -Method Get
```

### Get All Users (Formatted)
```powershell
$users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get
$users | ConvertTo-Json -Depth 10
```

### Get User by ID
```powershell
$userId = "3f5c3cea-35ab-4e3d-8be2-d0966ecb9014"
Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" `
    -Method Get
```

### Get User by ID (Formatted)
```powershell
$userId = "3f5c3cea-35ab-4e3d-8be2-d0966ecb9014"
$user = Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" -Method Get
$user | ConvertTo-Json -Depth 10
```

---

## Response Examples

### Success Response - Get All Users (200 OK)
```json
[
  {
    "id": "3f5c3cea-35ab-4e3d-8be2-d0966ecb9014",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "1234567890",
    "status": "active",
    "email_verified": true,
    "phone_verified": false,
    "failed_login_attempts": 0,
    "created_at": "2025-12-11T01:47:53.708Z",
    "updated_at": "2025-12-11T01:47:53.708Z"
  },
  {
    "id": "a156e28f-4ba0-4c56-8c44-4b2293804d62",
    "username": "jane_smith",
    "email": "jane.smith@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "9876543210",
    "status": "pending_verification",
    "email_verified": false,
    "phone_verified": false,
    "failed_login_attempts": 0,
    "created_at": "2025-12-11T01:48:20.123Z",
    "updated_at": "2025-12-11T01:48:20.123Z"
  }
]
```

### Success Response - Get User by ID (200 OK)
```json
{
  "id": "3f5c3cea-35ab-4e3d-8be2-d0966ecb9014",
  "username": "john_doe",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "status": "active",
  "email_verified": true,
  "phone_verified": false,
  "failed_login_attempts": 0,
  "account_locked_until": null,
  "password_reset_token": null,
  "password_reset_expires": null,
  "email_verification_token": "abc123...",
  "email_verification_expires": "2025-12-18T01:47:53.708Z",
  "last_login": "2025-12-11T02:00:00.000Z",
  "last_login_ip": "192.168.1.1",
  "created_by": null,
  "created_at": "2025-12-11T01:47:53.708Z",
  "updated_at": "2025-12-11T01:47:53.708Z"
}
```

### Error Response - User Not Found (404 Not Found)
```json
{
  "message": "User not found"
}
```

### Error Response - Server Error (500 Internal Server Error)
```json
{
  "message": "Internal Server Error"
}
```

---

## Using Scripts

### Bash Script
```bash
bash scripts/curlGetUser.sh
```

### PowerShell Script
```powershell
.\scripts\curlGetUser.ps1
```

---

## Notes

- **Password hash is NOT included** in the response for security reasons
- All timestamps are in UTC format
- UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Empty array `[]` is returned if no users exist
- The API does not require authentication (currently)

---

## Advanced Examples

### Filter with jq (Get only active users)
```bash
curl -X GET http://localhost:3000/api/users | jq '.[] | select(.status == "active")'
```

### Get only email addresses
```bash
curl -X GET http://localhost:3000/api/users | jq '.[].email'
```

### Count total users
```bash
curl -X GET http://localhost:3000/api/users | jq 'length'
```

### Get user count (PowerShell)
```powershell
$users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get
Write-Host "Total users: $($users.Count)"
```

### Search by email (using jq)
```bash
curl -X GET http://localhost:3000/api/users | jq '.[] | select(.email == "john.doe@example.com")'
```

---

## Common Use Cases

1. **List all users** - Use `GET /api/users`
2. **Get specific user details** - Use `GET /api/users/:id`
3. **Check if user exists** - Use `GET /api/users/:id` and check response status
4. **Get user count** - Use `GET /api/users` and count array length
5. **Filter users** - Use `GET /api/users` and filter client-side with jq or similar tools

