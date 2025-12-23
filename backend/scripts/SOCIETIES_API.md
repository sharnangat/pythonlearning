# Societies API Documentation

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Society
**POST** `/societies`

Creates a new society.

**Request Body:**
```json
{
  "name": "Green Valley Housing Society",
  "society_type": "Residential",
  "registration_number": "REG-2024-001",
  "registration_date": "2024-01-15",
  "established_date": "2020-05-10",
  "address_line1": "123 Main Street",
  "address_line2": "Block A",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "primary_phone": "+912234567890",
  "secondary_phone": "+912234567891",
  "email": "info@greenvalley.com",
  "website": "https://www.greenvalley.com",
  "pan_number": "ABCDE1234F",
  "tan_number": "TAN123456",
  "gst_number": "27ABCDE1234F1Z5",
  "bank_name": "State Bank of India",
  "bank_account_number": "1234567890123456",
  "bank_ifsc": "SBIN0001234",
  "bank_branch": "Mumbai Main Branch",
  "founded_by": "uuid-here",
  "current_chairman": "uuid-here",
  "total_units": 100,
  "total_area_sqft": 50000.00,
  "common_area_sqft": 5000.00,
  "maintenance_due_day": 5,
  "late_fee_percentage": 2.5,
  "grace_period_days": 7,
  "is_active": true
}
```

**Required Fields:**
- `name` (string) - Society name
- `society_type` (string) - Type of society (e.g., "Residential", "Commercial")
- `address_line1` (string) - Primary address
- `city` (string) - City name
- `state` (string) - State name
- `pincode` (string, max 10 characters) - Postal code

**Optional Fields:**
- `registration_number` (string, unique) - Registration number
- `registration_date` (date string YYYY-MM-DD)
- `established_date` (date string YYYY-MM-DD)
- `address_line2` (string)
- `country` (string, default: "India")
- `primary_phone` (string, valid phone format)
- `secondary_phone` (string, valid phone format)
- `email` (string, valid email format)
- `website` (string, valid URL)
- `pan_number` (string, max 10)
- `tan_number` (string, max 10)
- `gst_number` (string, max 15)
- `bank_name` (string)
- `bank_account_number` (string, max 50)
- `bank_ifsc` (string, max 11)
- `bank_branch` (string)
- `founded_by` (UUID) - Reference to users table
- `current_chairman` (UUID) - Reference to users table
- `total_units` (integer, default: 0)
- `total_area_sqft` (decimal)
- `common_area_sqft` (decimal)
- `maintenance_due_day` (integer, 1-31, default: 1)
- `late_fee_percentage` (decimal, 0-100, default: 0)
- `grace_period_days` (integer, default: 5)
- `is_active` (boolean, default: true)

**Response (201 Created):**
```json
{
  "id": "uuid-here",
  "name": "Green Valley Housing Society",
  "society_type": "Residential",
  "registration_number": "REG-2024-001",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "total_units": 100,
  "is_active": true,
  "created_at": "2025-12-11T...",
  "updated_at": "2025-12-11T..."
}
```

---

### 2. Get All Societies
**GET** `/societies`

Retrieves all societies.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "name": "Green Valley Housing Society",
    "society_type": "Residential",
    ...
  }
]
```

---

### 3. Get Society by ID
**GET** `/societies/:id`

Retrieves a specific society by ID.

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "name": "Green Valley Housing Society",
  ...
}
```

**Error (404 Not Found):**
```json
{
  "message": "Society not found"
}
```

---

### 4. Get Active Societies
**GET** `/societies/active`

Retrieves all active societies.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "name": "Green Valley Housing Society",
    "is_active": true,
    ...
  }
]
```

---

### 5. Get Societies by State
**GET** `/societies/state/:state`

Retrieves all societies in a specific state.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "name": "Green Valley Housing Society",
    "state": "Maharashtra",
    ...
  }
]
```

---

### 6. Update Society
**PUT** `/societies/:id`

Updates a society.

**Request Body:**
```json
{
  "name": "Updated Society Name",
  "total_units": 120,
  "maintenance_due_day": 10
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "name": "Updated Society Name",
  "total_units": 120,
  ...
}
```

**Error (404 Not Found):**
```json
{
  "message": "Society not found"
}
```

**Error (409 Conflict):**
```json
{
  "message": "Society with this registration number already exists"
}
```

---

### 7. Delete Society
**DELETE** `/societies/:id`

Deletes a society.

**Response (200 OK):**
```json
{
  "message": "Society deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Society not found"
}
```

---

## cURL Examples

### Create Society
```bash
curl -X POST http://localhost:3000/api/societies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Green Valley Housing Society",
    "society_type": "Residential",
    "address_line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }'
```

### Get All Societies
```bash
curl -X GET http://localhost:3000/api/societies
```

### Get Active Societies
```bash
curl -X GET http://localhost:3000/api/societies/active
```

### Get Societies by State
```bash
curl -X GET http://localhost:3000/api/societies/state/Maharashtra
```

### Get Society by ID
```bash
curl -X GET http://localhost:3000/api/societies/{uuid-here}
```

### Update Society
```bash
curl -X PUT http://localhost:3000/api/societies/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Society Name",
    "total_units": 120
  }'
```

### Delete Society
```bash
curl -X DELETE http://localhost:3000/api/societies/{uuid-here}
```

## Validation Rules

- **Email**: Must be valid email format (if provided)
- **Phone**: Must be valid phone format (if provided)
- **Website**: Must be valid URL format (if provided)
- **UUID fields**: `founded_by` and `current_chairman` must be valid UUIDs (if provided)
- **Numeric fields**: 
  - `total_units`: Must be non-negative integer
  - `total_area_sqft`, `common_area_sqft`: Must be non-negative numbers
  - `maintenance_due_day`: Must be between 1 and 31
  - `late_fee_percentage`: Must be between 0 and 100
  - `grace_period_days`: Must be non-negative integer
- **Registration number**: Must be unique (if provided)

## Testing

### Using Node.js Script
```bash
npm run test-societies
# or
node scripts/testSocietiesAPI.js
```

### Using cURL Script
```bash
bash scripts/curlSocieties.sh
```

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated
- Registration number must be unique
- Foreign key references (`founded_by`, `current_chairman`) must exist in users table
- Date fields should be in format: YYYY-MM-DD

