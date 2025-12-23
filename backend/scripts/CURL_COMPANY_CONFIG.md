# Company Config API cURL Examples

## Quick Reference

### Base URL
```
http://localhost:3000/api
```

## 1. Create Company Config

**POST** `/company-config`

```bash
curl -X POST http://localhost:3000/api/company-config \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Society Management Solutions",
    "company_email": "info@societysys.com",
    "company_phone": "+911234567890",
    "company_address": "123 Main Street, City, State, 12345",
    "default_rate_per_member": 20.00,
    "currency": "INR",
    "trial_period_days": 30,
    "max_free_members": 10,
    "support_email": "support@societysys.com",
    "support_phone": "+911234567891",
    "sales_email": "sales@societysys.com",
    "sales_phone": "+911234567892",
    "is_active": true
  }'
```

**Minimal Request (Required Fields Only):**
```bash
curl -X POST http://localhost:3000/api/company-config \
  -H "Content-Type: application/json" \
  -d '{
    "company_email": "info@societysys.com",
    "company_phone": "+911234567890"
  }'
```

---

## 2. Get All Company Configs

**GET** `/company-config`

```bash
curl -X GET http://localhost:3000/api/company-config
```

**With Pretty Print (jq):**
```bash
curl -X GET http://localhost:3000/api/company-config | jq .
```

---

## 3. Get Company Config by ID

**GET** `/company-config/:id`

```bash
curl -X GET http://localhost:3000/api/company-config/{uuid-here}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/company-config/3f5c3cea-35ab-4e3d-8be2-d0966ecb9014
```

---

## 4. Get Active Company Config

**GET** `/company-config/active`

```bash
curl -X GET http://localhost:3000/api/company-config/active
```

**With Pretty Print (jq):**
```bash
curl -X GET http://localhost:3000/api/company-config/active | jq .
```

---

## 5. Update Company Config

**PUT** `/company-config/:id`

```bash
curl -X PUT http://localhost:3000/api/company-config/{uuid-here} \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Updated Company Name",
    "default_rate_per_member": 25.00,
    "is_active": false
  }'
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/company-config/3f5c3cea-35ab-4e3d-8be2-d0966ecb9014 \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Updated Society Management Solutions",
    "default_rate_per_member": 25.00
  }'
```

---

## 6. Delete Company Config

**DELETE** `/company-config/:id`

```bash
curl -X DELETE http://localhost:3000/api/company-config/{uuid-here}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/company-config/3f5c3cea-35ab-4e3d-8be2-d0966ecb9014
```

---

## PowerShell Examples

### Create Company Config
```powershell
$body = @{
    company_name = "Society Management Solutions"
    company_email = "info@societysys.com"
    company_phone = "+911234567890"
    default_rate_per_member = 20.00
    currency = "INR"
    trial_period_days = 30
    max_free_members = 10
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/company-config" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Get All Company Configs
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/company-config" `
    -Method Get
```

### Get Active Company Config
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/company-config/active" `
    -Method Get
```

### Update Company Config
```powershell
$body = @{
    company_name = "Updated Company Name"
    default_rate_per_member = 25.00
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/company-config/{uuid-here}" `
    -Method Put `
    -Body $body `
    -ContentType "application/json"
```

### Delete Company Config
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/company-config/{uuid-here}" `
    -Method Delete
```

---

## Using Scripts

### Bash Script
```bash
bash scripts/curlCompanyConfig.sh
```

### PowerShell Script
```powershell
.\scripts\curlCompanyConfig.ps1
```

---

## Response Examples

### Success Response (201 Created)
```json
{
  "id": "3f5c3cea-35ab-4e3d-8be2-d0966ecb9014",
  "company_name": "Society Management Solutions",
  "company_email": "info@societysys.com",
  "company_phone": "+911234567890",
  "default_rate_per_member": "20.00",
  "currency": "INR",
  "trial_period_days": 30,
  "max_free_members": 10,
  "is_active": true,
  "created_at": "2025-12-11T01:47:53.708Z",
  "updated_at": "2025-12-11T01:47:53.708Z"
}
```

### Error Response (400 Bad Request)
```json
{
  "message": "Valid company email address is required"
}
```

### Error Response (404 Not Found)
```json
{
  "message": "Company config not found"
}
```

---

## Field Descriptions

### Required Fields
- `company_email` (string) - Valid email address
- `company_phone` (string) - Valid phone number

### Optional Fields
- `company_name` (string, default: "Society Management Solutions")
- `company_address` (text)
- `default_rate_per_member` (decimal, default: 20.00)
- `currency` (string, default: "INR")
- `trial_period_days` (integer, default: 30)
- `max_free_members` (integer, default: 10)
- `support_email` (string) - Valid email format
- `support_phone` (string) - Valid phone format
- `sales_email` (string) - Valid email format
- `sales_phone` (string) - Valid phone format
- `payment_gateway_key` (string, max 500)
- `whatsapp_api_key` (string, max 500)
- `email_api_key` (string, max 500)
- `is_active` (boolean, default: true)

---

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated
- Email and phone fields are validated
- Numeric fields must be positive numbers
- Multiple company configs can exist, but typically only one should be active

