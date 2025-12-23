# Login API with Role Verification - cURL Examples

## Quick Reference

### Base URL
```
http://localhost:3000/api
```

## Login Endpoint

**POST** `/users/login`

The login endpoint now includes role verification and returns user role details in the response.

## 1. Login with Email

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

## 2. Login with Phone

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "password": "your-password"
  }'
```

## 3. Login Response (with Roles)

The response now includes user role details:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+911234567890",
    "status": "active",
    "email_verified": true,
    "phone_verified": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here",
  "roles": [
    {
      "user_role_id": "uuid",
      "role_id": "uuid",
      "role_name": "superAdmin",
      "display_name": "Super Admin",
      "description": "Society Controller",
      "hierarchy_level": 1,
      "society_id": "uuid",
      "assigned_date": "2024-01-01T00:00:00.000Z",
      "valid_from": "2024-01-01",
      "valid_until": null,
      "is_active": true
    }
  ]
}
```

## 4. Pretty Print Response (with jq)

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }' | jq .
```

## 5. Extract Token Only

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }' | jq -r '.token'
```

## 6. Extract Roles Only

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }' | jq '.roles'
```

## 7. Check for Specific Role (e.g., superAdmin)

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }' | jq '.roles[] | select(.role_name == "superAdmin")'
```

## PowerShell Examples

### Login with Email

```powershell
$body = @{
    email = "user@example.com"
    password = "your-password"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/users/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

# Display full response
$response | ConvertTo-Json -Depth 10

# Extract token
$token = $response.token
Write-Host "Token: $token"

# Extract roles
$roles = $response.roles
$roles | ConvertTo-Json -Depth 10

# Check for specific role
$superAdminRole = $roles | Where-Object { $_.role_name -eq "superAdmin" }
if ($superAdminRole) {
    Write-Host "User has superAdmin role" -ForegroundColor Green
}
```

### Login with Phone

```powershell
$body = @{
    phone = "+911234567890"
    password = "your-password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## Quick Copy-Paste Examples

### Login (One-liner)

```bash
curl -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"your-password"}'
```

### Login and Save Token

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"your-password"}' | jq -r '.token')
echo "Token: $TOKEN"
```

### Login and Check Roles

```bash
RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"your-password"}')
echo "$RESPONSE" | jq '.roles[] | .role_name'
```

## Role Verification Details

The login API now:

1. **Verifies Roles Exist**: Checks that each user role references a valid role in the `roles` table
2. **Checks Role Status**: Only includes active roles (`is_active = true`)
3. **Validates Date Range**: Checks `valid_from` and `valid_until` dates
4. **Returns Role Details**: Includes complete role information in the response
5. **Includes in JWT**: Role names are included in the JWT token payload

## Error Responses

### Invalid Credentials
```json
{
  "message": "Invalid email/phone or password"
}
```

### Account Locked
```json
{
  "message": "Account is locked. Please try again later."
}
```

### Missing Fields
```json
{
  "message": "Email or phone and password are required"
}
```

## Important Notes

- **Email or Phone**: You can use either `email` or `phone` field (email takes priority if both provided)
- **Password**: Required field
- **Roles**: Only active, valid roles are returned
- **Token**: JWT token includes role names in payload
- **Role Verification**: Roles are verified against the `roles` table during login
- **Date Validation**: Only roles valid for the current date are included

## Testing

### Using Node.js Script
```bash
npm run test-login
```

### Using cURL
```bash
# Replace with actual credentials
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

