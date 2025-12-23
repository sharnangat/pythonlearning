# Members API Documentation

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Member (Insert Record)
**POST** `/members`

Creates a new member.

**Request Body:**
```json
{
  "society_id": "uuid-here",
  "member_type": "Owner",
  "first_name": "John",
  "last_name": "Doe",
  "primary_phone": "+911234567890",
  "email": "john.doe@example.com",
  "joining_date": "2024-01-01"
}
```

**Required Fields:**
- `society_id` (UUID) - Reference to societies table
- `member_type` (string) - Type of member (e.g., "Owner", "Tenant")
- `first_name` (string, max 100)
- `last_name` (string, max 100)
- `primary_phone` (string, valid phone format)
- `joining_date` (date string YYYY-MM-DD, default: current date)

**Optional Fields:**
- `user_id` (UUID) - Reference to users table
- `middle_name` (string, max 100)
- `date_of_birth` (date string YYYY-MM-DD)
- `gender` (string, max 10)
- `nationality` (string, default: "Indian")
- `secondary_phone` (string, valid phone format)
- `email` (string, valid email format) - Must be unique per society
- `emergency_contact_name` (string)
- `emergency_contact_phone` (string, valid phone format)
- `permanent_address` (text)
- `current_address` (text)
- `aadhar_number` (string, max 12)
- `pan_number` (string, max 10)
- `passport_number` (string, max 20)
- `occupation` (string)
- `organization` (string)
- `designation` (string)
- `membership_number` (string, max 50) - Must be unique
- `leaving_date` (date string YYYY-MM-DD)
- `is_active` (boolean, default: true)
- `has_voting_rights` (boolean, default: true)
- `profile_image_url` (string, valid URL, max 500)
- `bio` (text)

**Response (201 Created):**
```json
{
  "id": "uuid-here",
  "society_id": "uuid-here",
  "member_type": "Owner",
  "first_name": "John",
  "last_name": "Doe",
  "primary_phone": "+911234567890",
  "email": "john.doe@example.com",
  "joining_date": "2024-01-01",
  "is_active": true,
  "has_voting_rights": true,
  "created_at": "2025-12-11T...",
  "updated_at": "2025-12-11T..."
}
```

---

### 2. Get All Members
**GET** `/members`

Retrieves all members.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "society_id": "uuid-here",
    "first_name": "John",
    "last_name": "Doe",
    ...
  }
]
```

---

### 3. Get Member by ID
**GET** `/members/:id`

Retrieves a specific member by ID.

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "society_id": "uuid-here",
  "first_name": "John",
  ...
}
```

---

### 4. Get Active Members
**GET** `/members/active`

Retrieves all active members.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "is_active": true,
    ...
  }
]
```

---

### 5. Get Members by Society ID
**GET** `/members/society/:society_id`

Retrieves all members for a specific society.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "society_id": "uuid-here",
    ...
  }
]
```

---

### 6. Get Active Members by Society ID
**GET** `/members/society/:society_id/active`

Retrieves all active members for a specific society.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "society_id": "uuid-here",
    "is_active": true,
    ...
  }
]
```

---

### 7. Get Members by User ID
**GET** `/members/user/:user_id`

Retrieves all members associated with a specific user.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "user_id": "uuid-here",
    ...
  }
]
```

---

### 8. Update Member
**PUT** `/members/:id`

Updates a member.

**Request Body:**
```json
{
  "first_name": "John Updated",
  "occupation": "Senior Software Engineer"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "first_name": "John Updated",
  ...
}
```

---

### 9. Delete Member
**DELETE** `/members/:id`

Deletes a member.

**Response (200 OK):**
```json
{
  "message": "Member deleted successfully"
}
```

---

## cURL Examples

### Create Member (Insert Record)
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "society_id": "uuid-here",
    "member_type": "Owner",
    "first_name": "John",
    "last_name": "Doe",
    "primary_phone": "+911234567890",
    "email": "john.doe@example.com",
    "joining_date": "2024-01-01"
  }'
```

### Get All Members
```bash
curl -X GET http://localhost:3000/api/members
```

### Get Member by ID
```bash
curl -X GET http://localhost:3000/api/members/{uuid-here}
```

### Get Active Members
```bash
curl -X GET http://localhost:3000/api/members/active
```

### Get Members by Society ID
```bash
curl -X GET http://localhost:3000/api/members/society/{society-uuid}
```

### Get Active Members by Society ID
```bash
curl -X GET http://localhost:3000/api/members/society/{society-uuid}/active
```

### Update Member
```bash
curl -X PUT http://localhost:3000/api/members/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John Updated",
    "occupation": "Senior Software Engineer"
  }'
```

### Delete Member
```bash
curl -X DELETE http://localhost:3000/api/members/{uuid-here}
```

## Validation Rules

- **Email**: Must be valid email format (if provided)
- **Phone**: Must be valid phone format (if provided)
- **URL**: Must be valid URL format for profile_image_url (if provided)
- **UUID fields**: `society_id` and `user_id` must be valid UUIDs
- **Date fields**: Must be in format YYYY-MM-DD
- **Unique constraints**:
  - `membership_number` must be unique across all members
  - `(society_id, email)` combination must be unique (email can be null)

## Testing

### Using Node.js Script
```bash
npm run test-members
# or
node scripts/testMembersAPI.js
```

### Using cURL Script
```bash
bash scripts/curlInsertMember.sh
```

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated for `id`
- `society_id` must exist in societies table
- `user_id` is optional but must exist in users table if provided
- Email uniqueness is enforced per society (composite unique constraint)
- Membership number must be unique across all members

