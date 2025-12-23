# Members API cURL Examples

## Quick Reference

### Base URL
```
http://localhost:3000/api
```

## 1. Create Member (Insert Record)

**POST** `/members`

### Minimal Request (Required Fields Only)
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "society_id": "uuid-here",
    "member_type": "Owner",
    "first_name": "John",
    "last_name": "Doe",
    "primary_phone": "+911234567890",
    "joining_date": "2024-01-01"
  }'
```

### Full Request (All Fields)
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "society_id": "uuid-here",
    "user_id": "uuid-here",
    "member_type": "Owner",
    "first_name": "John",
    "middle_name": "Michael",
    "last_name": "Doe",
    "date_of_birth": "1985-05-15",
    "gender": "Male",
    "nationality": "Indian",
    "primary_phone": "+911234567890",
    "secondary_phone": "+911234567891",
    "email": "john.doe@example.com",
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_phone": "+911234567892",
    "permanent_address": "123 Main Street, Mumbai, Maharashtra 400001",
    "current_address": "123 Main Street, Mumbai, Maharashtra 400001",
    "aadhar_number": "123456789012",
    "pan_number": "ABCDE1234F",
    "passport_number": "A1234567",
    "occupation": "Software Engineer",
    "organization": "Tech Corp",
    "designation": "Senior Developer",
    "membership_number": "MEM-2024-001",
    "joining_date": "2024-01-01",
    "leaving_date": null,
    "is_active": true,
    "has_voting_rights": true,
    "profile_image_url": "https://example.com/profile.jpg",
    "bio": "Experienced software engineer"
  }'
```

---

## 2. Get All Members

**GET** `/members`

```bash
curl -X GET http://localhost:3000/api/members
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/members | jq .
```

---

## 3. Get Member by ID

**GET** `/members/:id`

```bash
curl -X GET http://localhost:3000/api/members/{uuid-here}
```

### Example
```bash
curl -X GET http://localhost:3000/api/members/2931b673-91e5-4811-886b-f81b94607e4e
```

---

## 4. Get Active Members

**GET** `/members/active`

```bash
curl -X GET http://localhost:3000/api/members/active
```

---

## 5. Get Members by Society ID

**GET** `/members/society/:society_id`

```bash
curl -X GET http://localhost:3000/api/members/society/{society-uuid}
```

### Example
```bash
curl -X GET http://localhost:3000/api/members/society/2931b673-91e5-4811-886b-f81b94607e4e
```

---

## 6. Get Active Members by Society ID

**GET** `/members/society/:society_id/active`

```bash
curl -X GET http://localhost:3000/api/members/society/{society-uuid}/active
```

---

## 7. Get Members by User ID

**GET** `/members/user/:user_id`

```bash
curl -X GET http://localhost:3000/api/members/user/{user-uuid}
```

---

## 8. Update Member

**PUT** `/members/:id`

```bash
curl -X PUT http://localhost:3000/api/members/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John Updated",
    "occupation": "Senior Software Engineer"
  }'
```

---

## 9. Delete Member

**DELETE** `/members/:id`

```bash
curl -X DELETE http://localhost:3000/api/members/{uuid-here}
```

---

## PowerShell Examples

### Create Member
```powershell
$body = @{
    society_id = "uuid-here"
    member_type = "Owner"
    first_name = "John"
    last_name = "Doe"
    primary_phone = "+911234567890"
    email = "john.doe@example.com"
    joining_date = "2024-01-01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/members" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Get All Members
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/members" `
    -Method Get
```

### Get Members by Society ID
```powershell
$societyId = "uuid-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/members/society/$societyId" `
    -Method Get
```

---

## Important Notes

- **society_id is required** - Must be a valid UUID from the societies table
- **Email uniqueness** - Email must be unique per society (composite unique constraint)
- **Membership number uniqueness** - Membership number must be unique across all members
- **Date format** - All dates should be in YYYY-MM-DD format
- **Phone validation** - Phone numbers are validated for format
- **URL validation** - profile_image_url must be a valid URL if provided

---

## Testing

### Using Node.js Script
```bash
npm run test-members
```

### Using cURL Script
```bash
bash scripts/curlInsertMember.sh
```

