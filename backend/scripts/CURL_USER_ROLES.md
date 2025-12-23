# User Roles API - cURL Examples

## Quick Reference

### Base URL
```
http://localhost:3000/api
```

## 1. Add Role to User (Create User Role)

**POST** `/user-roles`

### Minimal Request (Required Fields Only)
```bash
curl -X POST http://localhost:3000/api/user-roles \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "society_id": "society-uuid-here",
    "role_id": "role-uuid-here"
  }'
```

### Full Request (All Fields)
```bash
curl -X POST http://localhost:3000/api/user-roles \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "society_id": "society-uuid-here",
    "role_id": "role-uuid-here",
    "assigned_by": "admin-user-uuid-here",
    "valid_from": "2024-01-01",
    "valid_until": "2025-12-31",
    "is_active": true
  }'
```

### Example: Assign superAdmin Role to User
```bash
curl -X POST http://localhost:3000/api/user-roles \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "bb553396-f631-4cb0-b810-b63ab84ada01",
    "society_id": "2931b673-91e5-4811-886b-f81b94607e4e",
    "role_id": "role-uuid-for-superAdmin",
    "assigned_by": "admin-user-uuid",
    "valid_from": "2024-01-01",
    "is_active": true
  }'
```

### Example: Assign Member Role to User
```bash
curl -X POST http://localhost:3000/api/user-roles \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "society_id": "society-uuid-here",
    "role_id": "role-uuid-for-member",
    "valid_from": "2024-01-01",
    "is_active": true
  }'
```

---

## 2. Get All User Roles

**GET** `/user-roles`

```bash
curl -X GET http://localhost:3000/api/user-roles
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/user-roles | jq .
```

---

## 3. Get Active User Roles

**GET** `/user-roles/active`

```bash
curl -X GET http://localhost:3000/api/user-roles/active
```

---

## 4. Get User Roles by User ID

**GET** `/user-roles/user/:user_id`

```bash
curl -X GET http://localhost:3000/api/user-roles/user/{user-uuid-here}
```

### Example
```bash
curl -X GET http://localhost:3000/api/user-roles/user/bb553396-f631-4cb0-b810-b63ab84ada01
```

### Get Active User Roles by User ID
```bash
curl -X GET http://localhost:3000/api/user-roles/user/{user-uuid-here}/active
```

---

## 5. Get User Roles by Society ID

**GET** `/user-roles/society/:society_id`

```bash
curl -X GET http://localhost:3000/api/user-roles/society/{society-uuid-here}
```

### Get Active User Roles by Society ID
```bash
curl -X GET http://localhost:3000/api/user-roles/society/{society-uuid-here}/active
```

---

## 6. Get User Roles by Role ID

**GET** `/user-roles/role/:role_id`

```bash
curl -X GET http://localhost:3000/api/user-roles/role/{role-uuid-here}
```

### Get Active User Roles by Role ID
```bash
curl -X GET http://localhost:3000/api/user-roles/role/{role-uuid-here}/active
```

---

## 7. Get User Roles by User and Society

**GET** `/user-roles/user/:user_id/society/:society_id`

```bash
curl -X GET http://localhost:3000/api/user-roles/user/{user-uuid}/society/{society-uuid}
```

---

## 8. Search User Roles (Advanced)

**GET** `/user-roles/search`

### Search by User ID
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?user_id={user-uuid}"
```

### Search by Society ID
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?society_id={society-uuid}"
```

### Search by Role ID
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?role_id={role-uuid}"
```

### Search Active Roles Only
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?is_active=true"
```

### Search Multiple Filters
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?user_id={user-uuid}&society_id={society-uuid}&is_active=true"
```

### Search Valid Roles for Current Date
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?current_date=2024-12-16&is_active=true"
```

---

## 9. Update User Role

**PUT** `/user-roles/:id`

```bash
curl -X PUT http://localhost:3000/api/user-roles/{user-role-uuid} \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false,
    "valid_until": "2024-12-31"
  }'
```

### Example: Deactivate User Role
```bash
curl -X PUT http://localhost:3000/api/user-roles/{user-role-uuid} \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

### Example: Update Role Assignment
```bash
curl -X PUT http://localhost:3000/api/user-roles/{user-role-uuid} \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": "new-role-uuid",
    "assigned_by": "admin-user-uuid",
    "valid_until": "2025-12-31"
  }'
```

---

## 10. Delete User Role

**DELETE** `/user-roles/:id`

```bash
curl -X DELETE http://localhost:3000/api/user-roles/{user-role-uuid}
```

---

## PowerShell Examples

### Add Role to User
```powershell
$body = @{
    user_id = "bb553396-f631-4cb0-b810-b63ab84ada01"
    society_id = "2931b673-91e5-4811-886b-f81b94607e4e"
    role_id = "role-uuid-here"
    assigned_by = "admin-user-uuid"
    valid_from = "2024-01-01"
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/user-roles" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Get User Roles by User ID
```powershell
$userId = "bb553396-f631-4cb0-b810-b63ab84ada01"
Invoke-RestMethod -Uri "http://localhost:3000/api/user-roles/user/$userId" `
    -Method Get
```

### Search User Roles
```powershell
$userId = "bb553396-f631-4cb0-b810-b63ab84ada01"
Invoke-RestMethod -Uri "http://localhost:3000/api/user-roles/search?user_id=$userId&is_active=true" `
    -Method Get
```

### Update User Role
```powershell
$userRoleId = "user-role-uuid-here"
$body = @{
    is_active = $false
    valid_until = "2024-12-31"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/user-roles/$userRoleId" `
    -Method Put `
    -Body $body `
    -ContentType "application/json"
```

### Delete User Role
```powershell
$userRoleId = "user-role-uuid-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/user-roles/$userRoleId" `
    -Method Delete
```

---

## Quick Copy-Paste Examples

### Add Role to User (One-liner)
```bash
curl -X POST http://localhost:3000/api/user-roles -H "Content-Type: application/json" -d '{"user_id":"bb553396-f631-4cb0-b810-b63ab84ada01","society_id":"2931b673-91e5-4811-886b-f81b94607e4e","role_id":"role-uuid","valid_from":"2024-01-01","is_active":true}'
```

### Get All Roles for a User
```bash
curl -X GET http://localhost:3000/api/user-roles/user/bb553396-f631-4cb0-b810-b63ab84ada01
```

### Search Active Roles for User
```bash
curl -X GET "http://localhost:3000/api/user-roles/search?user_id=bb553396-f631-4cb0-b810-b63ab84ada01&is_active=true"
```

---

## Important Notes

- **Required Fields**: `user_id`, `society_id`, `role_id` (all UUIDs)
- **Validation**: The API verifies that user, society, and role exist before creating
- **Unique Constraint**: A user can only have one role per society (combination of user_id, society_id, role_id must be unique)
- **Date Format**: Use `YYYY-MM-DD` format for dates (valid_from, valid_until)
- **Boolean Values**: Use `true` or `false` for `is_active`
- **Optional Fields**: `assigned_by`, `valid_from` (defaults to current date), `valid_until`, `is_active` (defaults to true)

---

## Field Descriptions

- **user_id** (required, UUID): The user to assign the role to
- **society_id** (required, UUID): The society context for the role
- **role_id** (required, UUID): The role to assign (must exist in roles table)
- **assigned_by** (optional, UUID): User who assigned this role
- **valid_from** (optional, default: today): Date when role becomes valid (YYYY-MM-DD)
- **valid_until** (optional): Date when role expires (YYYY-MM-DD)
- **is_active** (optional, default: true): Whether the role assignment is active

---

## Testing

### Using Node.js Script
```bash
npm run test-user-roles
```

### Using cURL
```bash
# Replace UUIDs with actual values from your database
curl -X POST http://localhost:3000/api/user-roles \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "bb553396-f631-4cb0-b810-b63ab84ada01",
    "society_id": "2931b673-91e5-4811-886b-f81b94607e4e",
    "role_id": "role-uuid-here",
    "valid_from": "2024-01-01",
    "is_active": true
  }'
```

