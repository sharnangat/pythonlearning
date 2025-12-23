# Permissions API Documentation

## Overview

The Permissions API manages system permissions that can be assigned to roles for access control. Permissions are organized by modules (users, societies, members, assets, roles, etc.) and have unique codes and names.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Create Permission

**POST** `/permissions`

Create a new permission.

**Request Body:**
```json
{
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users",
  "description": "View user list and details",
  "is_active": true
}
```

**Required Fields:**
- `permission_name` (string, max 100 chars): Display name of the permission
- `permission_code` (string, max 50 chars): Unique code identifier
- `module` (string, max 50 chars): Module the permission belongs to

**Optional Fields:**
- `description` (text): Detailed description
- `is_active` (boolean, default: true): Whether permission is active

**Response:** `201 Created`
```json
{
  "permission_id": "uuid",
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users",
  "description": "View user list and details",
  "is_active": true,
  "created_at": "2024-12-18T00:00:00.000Z"
}
```

---

### 2. Get All Permissions

**GET** `/permissions`

Get all permissions in the system.

**Response:** `200 OK`
```json
[
  {
    "permission_id": "uuid",
    "permission_name": "View Users",
    "permission_code": "VIEW_USERS",
    "module": "users",
    "description": "View user list and details",
    "is_active": true,
    "created_at": "2024-12-18T00:00:00.000Z"
  }
]
```

---

### 3. Get Active Permissions

**GET** `/permissions/active`

Get all active permissions.

**Response:** `200 OK`
```json
[
  {
    "permission_id": "uuid",
    "permission_name": "View Users",
    "permission_code": "VIEW_USERS",
    "module": "users",
    "is_active": true,
    "created_at": "2024-12-18T00:00:00.000Z"
  }
]
```

---

### 4. Get Permission by ID

**GET** `/permissions/:id`

Get a specific permission by UUID.

**Parameters:**
- `id` (path, UUID): Permission ID

**Response:** `200 OK`
```json
{
  "permission_id": "uuid",
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users",
  "description": "View user list and details",
  "is_active": true,
  "created_at": "2024-12-18T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid UUID format
- `404`: Permission not found

---

### 5. Get Permission by Code

**GET** `/permissions/code/:code`

Get a permission by its unique code.

**Parameters:**
- `code` (path, string): Permission code (e.g., VIEW_USERS)

**Response:** `200 OK`
```json
{
  "permission_id": "uuid",
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users",
  "description": "View user list and details",
  "is_active": true,
  "created_at": "2024-12-18T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid code
- `404`: Permission not found

---

### 6. Get Permission by Name

**GET** `/permissions/name/:name`

Get a permission by its display name.

**Parameters:**
- `name` (path, string): Permission name (e.g., "View Users")

**Response:** `200 OK`

**Error Responses:**
- `400`: Invalid name
- `404`: Permission not found

---

### 7. Get Permissions by Module

**GET** `/permissions/module/:module`

Get all permissions for a specific module.

**Parameters:**
- `module` (path, string): Module name (e.g., users, societies, members)

**Response:** `200 OK`
```json
[
  {
    "permission_id": "uuid",
    "permission_name": "View Users",
    "permission_code": "VIEW_USERS",
    "module": "users",
    "is_active": true
  },
  {
    "permission_id": "uuid",
    "permission_name": "Create Users",
    "permission_code": "CREATE_USERS",
    "module": "users",
    "is_active": true
  }
]
```

---

### 8. Get Active Permissions by Module

**GET** `/permissions/module/:module/active`

Get all active permissions for a specific module.

**Parameters:**
- `module` (path, string): Module name

**Response:** `200 OK`

---

### 9. Update Permission

**PUT** `/permissions/:id`

Update a permission's details.

**Parameters:**
- `id` (path, UUID): Permission ID

**Request Body** (all fields optional):
```json
{
  "permission_name": "View Users Updated",
  "permission_code": "VIEW_USERS_V2",
  "module": "users",
  "description": "Updated description",
  "is_active": false
}
```

**Response:** `200 OK`
```json
{
  "permission_id": "uuid",
  "permission_name": "View Users Updated",
  "permission_code": "VIEW_USERS_V2",
  "module": "users",
  "description": "Updated description",
  "is_active": false,
  "created_at": "2024-12-18T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid data or validation error
- `404`: Permission not found
- `409`: Duplicate permission name or code

---

### 10. Delete Permission

**DELETE** `/permissions/:id`

Delete a permission from the system.

**Parameters:**
- `id` (path, UUID): Permission ID

**Response:** `200 OK`
```json
{
  "message": "Permission deleted successfully"
}
```

**Error Responses:**
- `400`: Invalid UUID format
- `404`: Permission not found

---

## Common Modules

- `users`: User management permissions
- `societies`: Society management permissions
- `members`: Member management permissions
- `assets`: Asset management permissions
- `roles`: Role management permissions
- `company_config`: Company configuration permissions

---

## Common Permission Patterns

### CRUD Permissions
- `VIEW_{MODULE}`: View/read permission
- `CREATE_{MODULE}`: Create permission
- `EDIT_{MODULE}`: Update/edit permission
- `DELETE_{MODULE}`: Delete permission
- `MANAGE_{MODULE}`: Full management (create, edit, delete)

### Special Permissions
- `ASSIGN_ROLES`: Assign roles to users
- `MANAGE_ROLES`: Manage role definitions

---

## Example Permission Sets

### Users Module
```json
{
  "permission_name": "View Users",
  "permission_code": "VIEW_USERS",
  "module": "users"
},
{
  "permission_name": "Create Users",
  "permission_code": "CREATE_USERS",
  "module": "users"
},
{
  "permission_name": "Edit Users",
  "permission_code": "EDIT_USERS",
  "module": "users"
},
{
  "permission_name": "Delete Users",
  "permission_code": "DELETE_USERS",
  "module": "users"
}
```

### Societies Module
```json
{
  "permission_name": "View Societies",
  "permission_code": "VIEW_SOCIETIES",
  "module": "societies"
},
{
  "permission_name": "Create Societies",
  "permission_code": "CREATE_SOCIETIES",
  "module": "societies"
},
{
  "permission_name": "Edit Societies",
  "permission_code": "EDIT_SOCIETIES",
  "module": "societies"
},
{
  "permission_name": "Delete Societies",
  "permission_code": "DELETE_SOCIETIES",
  "module": "societies"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Permission name is required and must be a non-empty string"
}
```

### 404 Not Found
```json
{
  "message": "Permission not found"
}
```

### 409 Conflict
```json
{
  "message": "Permission with this code already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Validation Rules

1. **permission_name**:
   - Required
   - Must be a non-empty string
   - Maximum 100 characters
   - Must be unique

2. **permission_code**:
   - Required
   - Must be a non-empty string
   - Maximum 50 characters
   - Must be unique
   - Convention: UPPERCASE_WITH_UNDERSCORES

3. **module**:
   - Required
   - Must be a non-empty string
   - Maximum 50 characters
   - Convention: lowercase

4. **is_active**:
   - Optional (default: true)
   - Must be boolean

---

## Testing

### Using Node.js Script
```bash
npm run test-permissions
```

### Using cURL Scripts

**Bash:**
```bash
bash scripts/curlInsertPermissions.sh
```

**PowerShell:**
```powershell
.\scripts\curlInsertPermissions.ps1
```

---

## Notes

- Permissions are typically assigned to roles, not directly to users
- Use consistent naming conventions for permission codes
- Group permissions by module for better organization
- Inactive permissions can be retained for audit purposes
- Permission codes should be descriptive and follow UPPERCASE_SNAKE_CASE format

