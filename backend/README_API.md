# Society Management System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "status": "pending_verification"
    },
    "token": "jwt-token"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```
OR
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  }
}
```

### Get Profile
```http
GET /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

### Logout
```http
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer <token>`

---

## User Management

### Get All Users
```http
GET /api/users?page=1&limit=10&search=john&status=active
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `users.read`

### Get User by ID
```http
GET /api/users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `users.read`

### Update User
```http
PUT /api/users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `users.update`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "status": "active"
}
```

### Delete User
```http
DELETE /api/users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `users.delete`

### Change Password
```http
POST /api/users/:id/change-password
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Society Management

### Get All Societies
```http
GET /api/societies?page=1&limit=10&search=valley&status=active&city=Mumbai
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `societies.read`

### Get Society by ID
```http
GET /api/societies/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `societies.read`

### Create Society
```http
POST /api/societies
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `societies.create`

**Request Body:**
```json
{
  "society_name": "Green Valley Apartments",
  "registration_number": "REG000001",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "phone": "9876543210",
  "email": "info@greenvalley.com",
  "total_flats": 100,
  "description": "Beautiful residential complex"
}
```

### Update Society
```http
PUT /api/societies/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `societies.update`

### Delete Society
```http
DELETE /api/societies/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `societies.delete`

---

## Member Management

### Get All Members
```http
GET /api/members?society_id=uuid&page=1&limit=10&search=john&status=active&member_type=owner
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `members.read`

### Get Member by ID
```http
GET /api/members/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `members.read`

### Create Member
```http
POST /api/members
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `members.create`

**Request Body:**
```json
{
  "society_id": "uuid",
  "membership_number": "MEM000001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "flat_number": "101A",
  "floor_number": 1,
  "building_name": "Tower A",
  "member_type": "owner",
  "ownership_percentage": 100
}
```

### Update Member
```http
PUT /api/members/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `members.update`

### Delete Member
```http
DELETE /api/members/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `members.delete`

---

## Asset Management

### Get All Assets
```http
GET /api/assets?society_id=uuid&asset_type=equipment&status=active
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `assets.read`

### Get Asset by ID
```http
GET /api/assets/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `assets.read`

### Create Asset
```http
POST /api/assets
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `assets.create`

### Update Asset
```http
PUT /api/assets/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `assets.update`

### Delete Asset
```http
DELETE /api/assets/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `assets.delete`

---

## Maintenance Management

### Get Maintenance Requests
```http
GET /api/maintenance/requests?society_id=uuid&status=pending&priority=high&member_id=uuid
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `maintenance.read`

### Create Maintenance Request
```http
POST /api/maintenance/requests
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `maintenance.create`

**Request Body:**
```json
{
  "society_id": "uuid",
  "member_id": "uuid",
  "request_type": "repair",
  "title": "Water Leakage",
  "description": "Water leaking from ceiling",
  "location": "Flat 101A",
  "priority": "urgent"
}
```

### Update Maintenance Request
```http
PUT /api/maintenance/requests/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `maintenance.update`

**Request Body:**
```json
{
  "status": "in_progress",
  "assigned_to": "user-uuid",
  "estimated_cost": 5000
}
```

### Get Maintenance Bills
```http
GET /api/maintenance/bills?society_id=uuid&member_id=uuid&status=pending
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `maintenance_bills.read`

### Get Bill Details
```http
GET /api/maintenance/bills/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `maintenance_bills.read`

---

## Visitor Management

### Get Visitors
```http
GET /api/visitors?society_id=uuid&status=inside&member_id=uuid
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `visitors.read`

### Check In Visitor
```http
POST /api/visitors
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `visitors.create`

**Request Body:**
```json
{
  "society_id": "uuid",
  "member_id": "uuid",
  "flat_number": "101A",
  "visitor_name": "Jane Doe",
  "visitor_phone": "9876543210",
  "purpose_of_visit": "meeting",
  "vehicle_number": "MH01AB1234",
  "vehicle_type": "car"
}
```

### Check Out Visitor
```http
PUT /api/visitors/:id/checkout
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `visitors.check_out`

**Request Body:**
```json
{
  "exit_gate": "Main Gate"
}
```

### Pre-register Visitor
```http
POST /api/visitors/pre-register
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `visitors.pre_register`

---

## Notifications

### Get Notifications
```http
GET /api/notifications?is_read=false
```
**Headers:** `Authorization: Bearer <token>`

### Mark Notification as Read
```http
PUT /api/notifications/:id/read
```
**Headers:** `Authorization: Bearer <token>`

### Mark All as Read
```http
PUT /api/notifications/read-all
```
**Headers:** `Authorization: Bearer <token>`

---

## Subscriptions

### Get Subscription Plans
```http
GET /api/subscriptions/plans
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `plans.read`

### Get Society Subscriptions
```http
GET /api/subscriptions?society_id=uuid
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `subscriptions.read`

---

## Payments

### Get Payments
```http
GET /api/payments?society_id=uuid&subscription_id=uuid&payment_status=completed
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `payments.read`

### Process Maintenance Payment
```http
POST /api/payments/maintenance
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `maintenance_payments.process`

**Request Body:**
```json
{
  "bill_id": "uuid",
  "payment_amount": 5000,
  "payment_method": "online",
  "payment_reference": "TXN123456"
}
```

---

## Configuration

### Get Config
```http
GET /api/config?society_id=uuid&category=financial&config_key=maintenance_due_days
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `config.read`

### Update Config
```http
PUT /api/config/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `config.update`

---

## Roles & Permissions

### Get Roles
```http
GET /api/roles?society_id=uuid
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `roles.read`

### Get Permissions
```http
GET /api/roles/permissions
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `permissions.read`

### Assign Role to User
```http
POST /api/roles/assign
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** `roles.assign`

**Request Body:**
```json
{
  "user_id": "uuid",
  "role_id": "uuid",
  "society_id": "uuid",
  "valid_until": "2025-12-31"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-12-23T20:00:00.000Z"
}
```

