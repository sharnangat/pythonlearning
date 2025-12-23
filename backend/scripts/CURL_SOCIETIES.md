# Societies API cURL Examples

## Quick Reference

### Base URL
```
http://localhost:3000/api
```

## 1. Create Society (Insert Record)

**POST** `/societies`

### Minimal Request (Required Fields Only)
```bash
curl -X POST http://localhost:3000/api/societies \
  -H "Content-Type: application/json" \
  -d '{
    "registration_number": "REG-2024-001",
    "name": "Green Valley Housing Society",
    "society_type": "Residential",
    "address_line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }'
```

**Note:** `registration_number` is now required and serves as the primary key.

### Full Request (All Fields)
```bash
curl -X POST http://localhost:3000/api/societies \
  -H "Content-Type: application/json" \
  -d '{
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
    "total_units": 100,
    "total_area_sqft": 50000.00,
    "common_area_sqft": 5000.00,
    "maintenance_due_day": 5,
    "late_fee_percentage": 2.5,
    "grace_period_days": 7,
    "is_active": true
  }'
```

---

## 2. Get All Societies

**GET** `/societies`

```bash
curl -X GET http://localhost:3000/api/societies
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/societies | jq .
```

### Save to File
```bash
curl -X GET http://localhost:3000/api/societies -o societies.json
```

---

## 3. Get Society by ID

**GET** `/societies/:id`

```bash
curl -X GET http://localhost:3000/api/societies/{uuid-here}
```

### Example
```bash
curl -X GET http://localhost:3000/api/societies/2931b673-91e5-4811-886b-f81b94607e4e
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/societies/{uuid-here} | jq .
```

---

## 4. Get Active Societies

**GET** `/societies/active`

```bash
curl -X GET http://localhost:3000/api/societies/active
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/societies/active | jq .
```

---

## 5. Get Societies by State

**GET** `/societies/state/:state`

```bash
curl -X GET http://localhost:3000/api/societies/state/Maharashtra
```

### Example with URL Encoding
```bash
curl -X GET "http://localhost:3000/api/societies/state/Maharashtra"
```

### With Pretty Print (jq)
```bash
curl -X GET http://localhost:3000/api/societies/state/Maharashtra | jq .
```

---

## 6. Update Society

**PUT** `/societies/:id`

```bash
curl -X PUT http://localhost:3000/api/societies/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Society Name",
    "total_units": 120,
    "maintenance_due_day": 10
  }'
```

### Example
```bash
curl -X PUT http://localhost:3000/api/societies/2931b673-91e5-4811-886b-f81b94607e4e \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Green Valley Housing Society Updated",
    "total_units": 120,
    "maintenance_due_day": 10
  }'
```

### With Pretty Print (jq)
```bash
curl -X PUT http://localhost:3000/api/societies/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}' | jq .
```

---

## 7. Delete Society

**DELETE** `/societies/:id`

```bash
curl -X DELETE http://localhost:3000/api/societies/{uuid-here}
```

### Example
```bash
curl -X DELETE http://localhost:3000/api/societies/2931b673-91e5-4811-886b-f81b94607e4e
```

---

## PowerShell Examples

### Create Society
```powershell
$body = @{
    registration_number = "REG-2024-001"
    name = "Green Valley Housing Society"
    society_type = "Residential"
    address_line1 = "123 Main Street"
    city = "Mumbai"
    state = "Maharashtra"
    pincode = "400001"
    primary_phone = "+912234567890"
    email = "info@greenvalley.com"
    total_units = 100
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/societies" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Get All Societies
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/societies" `
    -Method Get
```

### Get Active Societies
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/societies/active" `
    -Method Get
```

### Get Societies by State
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/societies/state/Maharashtra" `
    -Method Get
```

### Get Society by Registration Number
```powershell
$registrationNumber = "REG-2024-001"
Invoke-RestMethod -Uri "http://localhost:3000/api/societies/$registrationNumber" `
    -Method Get
```

### Update Society
```powershell
$registrationNumber = "REG-2024-001"
$body = @{
    name = "Updated Society Name"
    total_units = 120
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/societies/$registrationNumber" `
    -Method Put `
    -Body $body `
    -ContentType "application/json"
```

### Delete Society
```powershell
$registrationNumber = "REG-2024-001"
Invoke-RestMethod -Uri "http://localhost:3000/api/societies/$registrationNumber" `
    -Method Delete
```

---

## Using Scripts

### Bash Script
```bash
bash scripts/curlSocieties.sh
```

### PowerShell Script
```powershell
.\scripts\curlSocieties.ps1
```

---

## Response Examples

### Success Response - Create Society (201 Created)
```json
{
  "id": "2931b673-91e5-4811-886b-f81b94607e4e",
  "name": "Green Valley Housing Society",
  "society_type": "Residential",
  "registration_number": "REG-2024-001",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "total_units": 100,
  "is_active": true,
  "created_at": "2025-12-11T09:34:56.948Z",
  "updated_at": "2025-12-11T09:34:56.948Z"
}
```

### Success Response - Get All Societies (200 OK)
```json
[
  {
    "id": "2931b673-91e5-4811-886b-f81b94607e4e",
    "name": "Green Valley Housing Society",
    "society_type": "Residential",
    ...
  }
]
```

### Error Response - Validation Error (400 Bad Request)
```json
{
  "message": "Society name is required"
}
```

### Error Response - Not Found (404 Not Found)
```json
{
  "message": "Society not found"
}
```

### Error Response - Conflict (409 Conflict)
```json
{
  "message": "Society with this registration number already exists"
}
```

---

## Field Descriptions

### Required Fields
- `registration_number` (string, unique, primary key) - Registration number (REQUIRED)
- `name` (string) - Society name
- `society_type` (string) - Type of society (e.g., "Residential", "Commercial")
- `address_line1` (string) - Primary address
- `city` (string) - City name
- `state` (string) - State name
- `pincode` (string, max 10) - Postal code

### Optional Fields
- `registration_date` (date YYYY-MM-DD)
- `established_date` (date YYYY-MM-DD)
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

---

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated
- Registration number must be unique
- Foreign key references (`founded_by`, `current_chairman`) must exist in users table
- Date fields should be in format: YYYY-MM-DD
- State names are case-sensitive in the filter endpoint

---

## Advanced Examples

### Filter with jq (Get only active societies)
```bash
curl -X GET http://localhost:3000/api/societies | jq '.[] | select(.is_active == true)'
```

### Get only society names
```bash
curl -X GET http://localhost:3000/api/societies | jq '.[].name'
```

### Count total societies
```bash
curl -X GET http://localhost:3000/api/societies | jq 'length'
```

### Get societies by city (using jq)
```bash
curl -X GET http://localhost:3000/api/societies | jq '.[] | select(.city == "Mumbai")'
```

### Get society count by state (PowerShell)
```powershell
$societies = Invoke-RestMethod -Uri "http://localhost:3000/api/societies" -Method Get
$societies | Group-Object state | Select-Object Name, Count
```

