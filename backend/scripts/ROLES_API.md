# Roles API Documentation

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Role
**POST** `/roles`

Creates a new role.

**Request Body:**
```json
{
  "role_name": "admin",
  "display_name": "Administrator",
  "description": "Full system administrator with all permissions",
  "hierarchy_level": 1,
  "is_active": true
}
```

**Required Fields:**
- `role_name` (string) - Unique role identifier
- `display_name` (string, max 100) - Human-readable role name

**Optional Fields:**
- `description` (text) - Role description
- `hierarchy_level` (integer, default: 0) - Role hierarchy level (lower numbers = higher priority)
- `is_active` (boolean, default: true) - Whether the role is active

**Response (201 Created):**
```json
{
  "id": "uuid-here",
  "role_name": "admin",
  "display_name": "Administrator",
  "description": "Full system administrator with all permissions",
  "hierarchy_level": 1,
  "is_active": true,
  "role_id": "uuid-here",
  "created_at": "2025-12-16T...",
  "updated_at": "2025-12-16T..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or validation error
- `409 Conflict` - Role with this role_name already exists

---

### 2. Get All Roles
**GET** `/roles`

Retrieves all roles.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "role_name": "admin",
    "display_name": "Administrator",
    "description": "Full system administrator with all permissions",
    "hierarchy_level": 1,
    "is_active": true,
    "role_id": "uuid-here",
    "created_at": "2025-12-16T...",
    "updated_at": "2025-12-16T..."
  }
]
```

---

### 3. Get Active Roles
**GET** `/roles/active`

Retrieves all active roles.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "role_name": "admin",
    "display_name": "Administrator",
    "is_active": true,
    ...
  }
]
```

---

### 4. Get Role by ID
**GET** `/roles/:id`

Retrieves a specific role by ID.

**Parameters:**
- `id` (UUID) - Role ID

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "role_name": "admin",
  "display_name": "Administrator",
  "description": "Full system administrator with all permissions",
  "hierarchy_level": 1,
  "is_active": true,
  "role_id": "uuid-here",
  "created_at": "2025-12-16T...",
  "updated_at": "2025-12-16T..."
}
```

**Error Responses:**
- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - Role not found

---

### 5. Update Role
**PUT** `/roles/:id`

Updates a role.

**Parameters:**
- `id` (UUID) - Role ID

**Request Body:**
```json
{
  "display_name": "Administrator Updated",
  "description": "Updated description",
  "hierarchy_level": 0,
  "is_active": true
}
```

**All fields are optional for update:**
- `role_name` (string) - Must be unique if changed
- `display_name` (string, max 100)
- `description` (text)
- `hierarchy_level` (integer)
- `is_active` (boolean)

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "role_name": "admin",
  "display_name": "Administrator Updated",
  "description": "Updated description",
  "hierarchy_level": 0,
  "is_active": true,
  "role_id": "uuid-here",
  "created_at": "2025-12-16T...",
  "updated_at": "2025-12-16T..."
}
```

**Error Responses:**
- `400 Bad Request` - Invalid UUID format or validation error
- `404 Not Found` - Role not found
- `409 Conflict` - Role with this role_name already exists

---

### 6. Delete Role
**DELETE** `/roles/:id`

Deletes a role.

**Parameters:**
- `id` (UUID) - Role ID

**Response (200 OK):**
```json
{
  "message": "Role deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - Role not found

---

## cURL Examples

### Create Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "admin",
    "display_name": "Administrator",
    "description": "Full system administrator with all permissions",
    "hierarchy_level": 1,
    "is_active": true
  }'
```

### Get All Roles
```bash
curl -X GET http://localhost:3000/api/roles
```

### Get Active Roles
```bash
curl -X GET http://localhost:3000/api/roles/active
```

### Get Role by ID
```bash
curl -X GET http://localhost:3000/api/roles/{uuid-here}
```

### Update Role
```bash
curl -X PUT http://localhost:3000/api/roles/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Administrator Updated",
    "description": "Updated description",
    "hierarchy_level": 0
  }'
```

### Delete Role
```bash
curl -X DELETE http://localhost:3000/api/roles/{uuid-here}
```

## Validation Rules

- **role_name**: 
  - Required
  - Must be a non-empty string
  - Must be unique across all roles
  - Maximum length: 255 characters
  
- **display_name**: 
  - Required
  - Must be a non-empty string
  - Maximum length: 100 characters
  
- **description**: 
  - Optional
  - Text field (no length limit)
  
- **hierarchy_level**: 
  - Optional
  - Must be an integer
  - Default: 0
  - Lower numbers typically indicate higher priority/authority
  
- **is_active**: 
  - Optional
  - Must be a boolean
  - Default: true
  
- **id**: 
  - Must be a valid UUID format for GET, PUT, DELETE operations

## Testing

### Using Node.js Script
```bash
npm run test-roles
# or
node scripts/testRolesAPI.js
```

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated for `id` and `role_id`
- `role_name` must be unique across all roles
- Active roles can be filtered using `/roles/active` endpoint
- Hierarchy levels can be used to determine role precedence (lower = higher priority)
- When updating `role_name`, the new value must not conflict with existing roles
- Deleted roles are permanently removed from the database

## Common Use Cases

1. **Create a new role for administrators:**
   ```json
   {
     "role_name": "super_admin",
     "display_name": "Super Administrator",
     "description": "Highest level administrator",
     "hierarchy_level": 0,
     "is_active": true
   }
   ```

2. **Create a member role:**
   ```json
   {
     "role_name": "member",
     "display_name": "Member",
     "description": "Regular member with basic permissions",
     "hierarchy_level": 5,
     "is_active": true
   }
   ```

3. **Deactivate a role (soft delete):**
   ```json
   PUT /roles/{id}
   {
     "is_active": false
   }
   ```

4. **Update role hierarchy:**
   ```json
   PUT /roles/{id}
   {
     "hierarchy_level": 2
   }
   ```

