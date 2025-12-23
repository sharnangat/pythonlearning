# Company Config API Documentation

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Company Config
**POST** `/company-config`

Creates a new company configuration.

**Request Body:**
```json
{
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
  "payment_gateway_key": "optional_key",
  "whatsapp_api_key": "optional_key",
  "email_api_key": "optional_key",
  "is_active": true
}
```

**Required Fields:**
- `company_email` (string, valid email format)
- `company_phone` (string, valid phone format)

**Optional Fields:**
- `company_name` (string, default: "Society Management Solutions")
- `company_address` (text)
- `default_rate_per_member` (decimal, default: 20.00)
- `currency` (string, default: "INR")
- `trial_period_days` (integer, default: 30)
- `max_free_members` (integer, default: 10)
- `support_email` (string, valid email format)
- `support_phone` (string, valid phone format)
- `sales_email` (string, valid email format)
- `sales_phone` (string, valid phone format)
- `payment_gateway_key` (string, max 500)
- `whatsapp_api_key` (string, max 500)
- `email_api_key` (string, max 500)
- `is_active` (boolean, default: true)

**Response (201 Created):**
```json
{
  "id": "uuid-here",
  "company_name": "Society Management Solutions",
  "company_email": "info@societysys.com",
  "company_phone": "+911234567890",
  "company_address": "123 Main Street, City, State, 12345",
  "default_rate_per_member": "20.00",
  "currency": "INR",
  "trial_period_days": 30,
  "max_free_members": 10,
  "support_email": "support@societysys.com",
  "support_phone": "+911234567891",
  "sales_email": "sales@societysys.com",
  "sales_phone": "+911234567892",
  "is_active": true,
  "created_at": "2025-12-11T...",
  "updated_at": "2025-12-11T..."
}
```

---

### 2. Get All Company Configs
**GET** `/company-config`

Retrieves all company configurations.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "company_name": "Society Management Solutions",
    "company_email": "info@societysys.com",
    ...
  }
]
```

---

### 3. Get Company Config by ID
**GET** `/company-config/:id`

Retrieves a specific company configuration by ID.

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "company_name": "Society Management Solutions",
  ...
}
```

**Error (404 Not Found):**
```json
{
  "message": "Company config not found"
}
```

---

### 4. Get Active Company Config
**GET** `/company-config/active`

Retrieves the currently active company configuration.

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "company_name": "Society Management Solutions",
  "is_active": true,
  ...
}
```

**Error (404 Not Found):**
```json
{
  "message": "No active company config found"
}
```

---

### 5. Update Company Config
**PUT** `/company-config/:id`

Updates a company configuration.

**Request Body:**
```json
{
  "company_name": "Updated Company Name",
  "default_rate_per_member": 25.00,
  "is_active": false
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "company_name": "Updated Company Name",
  "default_rate_per_member": "25.00",
  ...
}
```

**Error (404 Not Found):**
```json
{
  "message": "Company config not found"
}
```

---

### 6. Delete Company Config
**DELETE** `/company-config/:id`

Deletes a company configuration.

**Response (200 OK):**
```json
{
  "message": "Company config deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Company config not found"
}
```

---

## cURL Examples

### Create Company Config
```bash
curl -X POST http://localhost:3000/api/company-config \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Society Management Solutions",
    "company_email": "info@societysys.com",
    "company_phone": "+911234567890"
  }'
```

### Get All Company Configs
```bash
curl -X GET http://localhost:3000/api/company-config
```

### Get Active Company Config
```bash
curl -X GET http://localhost:3000/api/company-config/active
```

### Get Company Config by ID
```bash
curl -X GET http://localhost:3000/api/company-config/{id}
```

### Update Company Config
```bash
curl -X PUT http://localhost:3000/api/company-config/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Updated Name",
    "default_rate_per_member": 25.00
  }'
```

### Delete Company Config
```bash
curl -X DELETE http://localhost:3000/api/company-config/{id}
```

## Validation Rules

- **Email fields**: Must be valid email format
- **Phone fields**: Must be valid phone format
- **Numeric fields**: 
  - `default_rate_per_member`: Must be a positive number
  - `trial_period_days`: Must be a positive integer
  - `max_free_members`: Must be a positive integer

## Testing

### Using Node.js Script
```bash
node scripts/testCompanyConfigAPI.js
```

### Using cURL Script
```bash
bash scripts/curlCompanyConfig.sh
```

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated
- Multiple company configs can exist, but typically only one should be active
- API keys are stored as plain text (consider encryption in production)

