# Postman Collection - Society Management System API

## Overview

This Postman collection contains all API endpoints for the Society Management System, organized into logical folders for easy navigation and testing. The collection includes 90+ endpoints across 8 major modules.

## Collection Structure

### 1. Authentication & Users
- Register User
- Login with Email
- Login with Phone (returns user roles)
- Get All Users
- Get User by ID
- Update User
- Delete User

### 2. Company Configuration
- Create Company Config
- Get All Company Configs
- Get Active Company Config
- Get Company Config by ID
- Update Company Config
- Delete Company Config

### 3. Societies
- Create Society
- Get All Societies
- Get Active Societies
- Get Society by ID
- Update Society
- Delete Society

### 4. Members
- Create Member
- Upload Members via Excel
- Get All Members
- Get Active Members
- Get Members by Society ID
- Get Active Members by Society ID
- Get Members by User ID
- Get Member by ID
- Update Member by ID
- Update Member by Membership Number
- Delete Member

### 5. Roles
- Create Role (Admin, superAdmin, Member, Chairman, Secretary, Treasurer)
- Get All Roles
- Get Active Roles
- Get Role by ID
- Update Role
- Deactivate Role
- Delete Role

### 6. User Roles (Role Assignment)
- Assign Role to User (Minimal & Full)
- Get All User Roles
- Get Active User Roles
- Get User Roles by User ID
- Get Active User Roles by User ID
- Get User Roles by Society ID
- Get Active User Roles by Society ID
- Get User Roles by Role ID
- Get Active User Roles by Role ID
- Get User Roles by User and Society
- Search User Roles
- Get User Role by ID
- Update User Role
- Deactivate User Role
- Delete User Role

### 7. Assets
- Create Asset
- Get All Assets
- Get Active Assets
- Get Assets by Society ID
- Get Asset by Asset Code
- Get Asset by ID
- Update Asset
- Delete Asset

### 8. Permissions
- Create Permission (with multiple examples: VIEW_USERS, CREATE_USERS, EDIT_USERS, DELETE_USERS, VIEW_SOCIETIES, MANAGE_ASSETS, MANAGE_ROLES, ASSIGN_ROLES)
- Get All Permissions
- Get Active Permissions
- Get Permission by ID
- Get Permission by Code
- Get Permission by Name
- Get Permissions by Module (users, societies, members, assets, roles)
- Get Active Permissions by Module
- Update Permission
- Deactivate Permission
- Delete Permission

---

## How to Import

### Method 1: Import JSON File
1. Open Postman
2. Click "Import" button (top left)
3. Select "Upload Files"
4. Choose `Society_Management_API.postman_collection.json`
5. Click "Import"

### Method 2: Import via URL (if hosted on GitHub)
1. Open Postman
2. Click "Import" button
3. Select "Link" tab
4. Paste the raw GitHub URL of the JSON file
5. Click "Continue" then "Import"

---

## Environment Variables

The collection uses a single variable:

- `base_url`: The base URL for the API (default: `http://localhost:3000/api`)

### Setting Up Environment

1. In Postman, click "Environments" in the left sidebar
2. Click "Create Environment" or edit existing
3. Add variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000/api`
   - **Current Value**: `http://localhost:3000/api`
4. Save the environment
5. Select the environment from the dropdown (top right)

---

## Usage Instructions

### 1. Replace UUID Placeholders

Many requests use placeholder UUIDs like `user-uuid-here`, `society-uuid-here`, etc. 

**To get actual UUIDs:**
- Run "Get All Users" to get user IDs
- Run "Get All Societies" to get society IDs
- Run "Get All Roles" to get role IDs
- Copy the UUIDs from responses and paste into subsequent requests

### 2. Typical Workflow

#### Initial Setup:
1. **Register User** → Get user credentials
2. **Create Company Config** → Set up company
3. **Create Society** → Create a society
4. **Create Permissions** → Set up system permissions (VIEW_USERS, CREATE_USERS, etc.)
5. **Create Roles** → Create admin, member, chairman, secretary, treasurer roles

#### User Management:
6. **Login** → Get JWT token and user roles
7. **Assign Role to User** → Add roles to users for specific societies

#### Member Management:
8. **Create Member** → Add individual members
9. **Upload Members via Excel** → Bulk upload members

#### Asset Management:
10. **Create Asset** → Add society assets
11. **Get Assets by Society ID** → View all assets

#### Permission Management:
12. **Get Permissions by Module** → View available permissions for each module
13. **Assign Permissions to Roles** → (Future: role-permission mapping)

### 3. Authentication

Currently, the API endpoints don't require JWT authentication in headers (based on the code), but when authentication is implemented:

1. Login to get the JWT token
2. Copy the token from the response
3. In Postman, go to the Collection > Authorization tab
4. Select "Bearer Token" type
5. Paste the token
6. This will apply to all requests in the collection

---

## Request Examples

### Create a Complete User Workflow

**Step 1: Register User**
```json
POST /users/register
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+911234567890"
}
```

**Step 2: Create Society**
```json
POST /societies
{
  "name": "Green Valley Residency",
  "society_type": "residential",
  "registration_number": "SOC-2024-001",
  "address": "123 Green Valley",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

**Step 3: Create superAdmin Role**
```json
POST /roles
{
  "role_name": "superAdmin",
  "display_name": "Super Administrator",
  "description": "Society Controller",
  "hierarchy_level": 0,
  "is_active": true
}
```

**Step 4: Assign Role to User**
```json
POST /user-roles
{
  "user_id": "user-uuid-from-step-1",
  "society_id": "society-uuid-from-step-2",
  "role_id": "role-uuid-from-step-3",
  "valid_from": "2024-01-01",
  "is_active": true
}
```

**Step 5: Login**
```json
POST /users/login
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

Response will include user details, JWT token, and assigned roles.

---

## Special Endpoints

### Excel Upload for Members

The "Upload Members via Excel" endpoint requires:
- **Content-Type**: `multipart/form-data`
- **File field name**: `file`
- **File type**: Excel (.xlsx, .xls)
- **Query parameters**:
  - `stopOnError`: true/false (stop processing on first error)
  - `skipDuplicates`: true/false (skip duplicate entries)

**In Postman:**
1. Select the request
2. Go to "Body" tab
3. Select "form-data"
4. Add key "file" with type "File"
5. Choose your Excel file
6. Add query parameters in the URL

**Sample Excel template** is available in `scripts/sample_members.xlsx`

---

## Testing Features

### Query Parameters

Many endpoints support query parameters for filtering:

**User Roles Search:**
```
GET /user-roles/search?user_id={uuid}&is_active=true&current_date=2024-12-18
```

**Parameters:**
- `user_id`: Filter by user UUID
- `society_id`: Filter by society UUID
- `role_id`: Filter by role UUID
- `is_active`: true/false
- `current_date`: YYYY-MM-DD (to get roles valid on a specific date)

### Path Parameters

Endpoints with `:id`, `:user_id`, etc. in the path:
- Click on the request
- Go to "Params" tab
- Update the path variable values
- Or directly edit the URL

---

## Response Examples

### Login Response (with Roles)
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+911234567890",
    "status": "active",
    "email_verified": true,
    "phone_verified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roles": [
    {
      "user_role_id": "uuid",
      "role_id": "uuid",
      "role_name": "superAdmin",
      "display_name": "Super Administrator",
      "description": "Society Controller",
      "hierarchy_level": 0,
      "society_id": "uuid",
      "assigned_date": "2024-01-01T00:00:00.000Z",
      "valid_from": "2024-01-01",
      "valid_until": null,
      "is_active": true
    }
  ]
}
```

---

## Error Responses

### Common Error Formats

**400 Bad Request:**
```json
{
  "message": "Valid UUID is required for user_id"
}
```

**404 Not Found:**
```json
{
  "message": "User not found"
}
```

**409 Conflict:**
```json
{
  "message": "User with this email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error"
}
```

---

## Tips & Best Practices

1. **Save Responses**: Use Postman's "Save Response" feature to keep example responses
2. **Use Environment Variables**: Store frequently used IDs in environment variables
3. **Create Tests**: Add Postman tests to validate responses
4. **Use Pre-request Scripts**: Automate token refresh or UUID generation
5. **Organize with Folders**: The collection is already organized, keep it that way
6. **Document Changes**: Add descriptions to your custom requests

---

## Troubleshooting

### Connection Issues
- Verify the server is running on `http://localhost:3000`
- Check the `base_url` environment variable
- Ensure no firewall is blocking the connection

### UUID Errors
- Always use valid UUIDs from actual database records
- Run GET endpoints first to obtain valid IDs
- Don't use placeholder UUIDs in actual tests

### Date Format Errors
- Always use `YYYY-MM-DD` format for dates
- Ensure `valid_from` is before or equal to `valid_until`

### File Upload Issues
- Use correct `multipart/form-data` format
- Ensure field name is exactly "file"
- Check file size limits (10MB max)
- Verify file is valid Excel format

---

## Support

For issues or questions:
- Check the API documentation in `scripts/` folder
- Review test scripts in `scripts/test*.js`
- Check cURL examples in `scripts/curl*.sh` and `scripts/curl*.ps1`

---

## Version

- **Collection Version**: 1.0
- **API Version**: 1.0
- **Last Updated**: December 2024

