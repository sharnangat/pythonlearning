# Roles API cURL Examples

## Quick Reference

### Base URL
```
http://localhost:3000/api
```

## 1. Create Role (Insert Record)

**POST** `/roles`

### Minimal Request (Required Fields Only)
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "admin",
    "display_name": "Administrator"
  }'
```

### Full Request (All Fields)
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

### Example: Create Member Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "member",
    "display_name": "Member",
    "description": "Regular member with basic permissions",
    "hierarchy_level": 5,
    "is_active": true
  }'
```

### Example: Create Chairman Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "chairman",
    "display_name": "Chairman",
    "description": "Society chairman with highest authority",
    "hierarchy_level": 0,
    "is_active": true
  }'
```

### Example: Create Secretary Role
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "secretary",
    "display_name": "Secretary",
    "description": "Society secretary with administrative permissions",
    "hierarchy_level": 2,
    "is_active": true
  }'
```

---

## 2. Get All Roles

**GET** `/roles`

```bash
curl -X GET http://localhost:3000/api/roles
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/roles | jq .
```

---

## 3. Get Active Roles

**GET** `/roles/active`

```bash
curl -X GET http://localhost:3000/api/roles/active
```

---

## 4. Get Role by ID

**GET** `/roles/:id`

```bash
curl -X GET http://localhost:3000/api/roles/{uuid-here}
```

### Example
```bash
curl -X GET http://localhost:3000/api/roles/123e4567-e89b-12d3-a456-426614174000
```

---

## 5. Update Role

**PUT** `/roles/:id`

```bash
curl -X PUT http://localhost:3000/api/roles/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Administrator Updated",
    "description": "Updated description",
    "hierarchy_level": 0
  }'
```

### Example: Deactivate Role
```bash
curl -X PUT http://localhost:3000/api/roles/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

---

## 6. Delete Role

**DELETE** `/roles/:id`

```bash
curl -X DELETE http://localhost:3000/api/roles/{uuid-here}
```

---

## PowerShell Examples

### Create Role
```powershell
$body = @{
    role_name = "admin"
    display_name = "Administrator"
    description = "Full system administrator with all permissions"
    hierarchy_level = 1
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/roles" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Get All Roles
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/roles" `
    -Method Get
```

### Get Active Roles
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/roles/active" `
    -Method Get
```

### Get Role by ID
```powershell
$roleId = "uuid-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/roles/$roleId" `
    -Method Get
```

### Update Role
```powershell
$roleId = "uuid-here"
$body = @{
    display_name = "Administrator Updated"
    description = "Updated description"
    hierarchy_level = 0
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/roles/$roleId" `
    -Method Put `
    -Body $body `
    -ContentType "application/json"
```

### Delete Role
```powershell
$roleId = "uuid-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/roles/$roleId" `
    -Method Delete
```

---

## Quick Copy-Paste Examples

### Insert Admin Role
```bash
curl -X POST http://localhost:3000/api/roles -H "Content-Type: application/json" -d '{"role_name":"admin","display_name":"Administrator","description":"Full system administrator","hierarchy_level":1,"is_active":true}'
```

### Insert Member Role
```bash
curl -X POST http://localhost:3000/api/roles -H "Content-Type: application/json" -d '{"role_name":"member","display_name":"Member","description":"Regular member","hierarchy_level":5,"is_active":true}'
```

### Insert Chairman Role
```bash
curl -X POST http://localhost:3000/api/roles -H "Content-Type: application/json" -d '{"role_name":"chairman","display_name":"Chairman","description":"Society chairman","hierarchy_level":0,"is_active":true}'
```

### Insert Secretary Role
```bash
curl -X POST http://localhost:3000/api/roles -H "Content-Type: application/json" -d '{"role_name":"secretary","display_name":"Secretary","description":"Society secretary","hierarchy_level":2,"is_active":true}'
```

### Insert Treasurer Role
```bash
curl -X POST http://localhost:3000/api/roles -H "Content-Type: application/json" -d '{"role_name":"treasurer","display_name":"Treasurer","description":"Society treasurer","hierarchy_level":3,"is_active":true}'
```

---

## Important Notes

- **role_name is required** - Must be unique across all roles
- **display_name is required** - Maximum 100 characters
- **hierarchy_level** - Lower numbers indicate higher priority/authority (default: 0)
- **is_active** - Default is true, set to false to deactivate a role
- **Unique constraint** - role_name must be unique across all roles

---

## Testing

### Using Node.js Script
```bash
npm run test-roles
```

### Using cURL Scripts
```bash
# Bash
bash scripts/curlInsertRole.sh

# PowerShell
.\scripts\curlInsertRole.ps1
```

---

## Field Descriptions

- **role_name** (required, unique): Internal identifier for the role (e.g., "admin", "member")
- **display_name** (required, max 100 chars): Human-readable name (e.g., "Administrator", "Member")
- **description** (optional): Detailed description of the role's permissions and responsibilities
- **hierarchy_level** (optional, default: 0): Numeric level indicating role priority (0 = highest, higher numbers = lower priority)
- **is_active** (optional, default: true): Whether the role is currently active and can be assigned

---

## Common Role Hierarchy Examples

```
0 - Chairman (Highest authority)
1 - Administrator
2 - Secretary
3 - Treasurer
4 - Committee Member
5 - Member (Lowest authority)
```

