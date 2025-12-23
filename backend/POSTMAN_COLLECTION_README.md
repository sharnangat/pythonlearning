# Postman Collection

## Overview

Complete Postman collection for Society Management System API with all endpoints organized by folders.

## Files

- **`Society_Management_API.postman_collection.json`** - Main Postman collection file
- **`generate_postman_collection.js`** - Script to generate/update the collection

## Importing the Collection

1. Open Postman
2. Click **Import** button
3. Select **File** tab
4. Choose `Society_Management_API.postman_collection.json`
5. Click **Import**

## Collection Structure

The collection is organized into the following folders:

### 1. Health Check
- GET `/health` - Server health check

### 2. Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- POST `/api/auth/logout` - Logout user

### 3. Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user
- POST `/api/users/change-password` - Change password

### 4. Societies
- GET `/api/societies` - Get all societies
- GET `/api/societies/:id` - Get society by ID
- POST `/api/societies` - Create society
- PUT `/api/societies/:id` - Update society
- DELETE `/api/societies/:id` - Delete society

### 5. Members
- GET `/api/members` - Get all members
- GET `/api/members/:id` - Get member by ID
- POST `/api/members` - Create member
- PUT `/api/members/:id` - Update member
- DELETE `/api/members/:id` - Delete member

## Collection Variables

The collection includes the following variables:

- `base_url` - API base URL (default: `http://localhost:3000`)
- `auth_token` - JWT authentication token (auto-set on login/register)
- `user_id` - Current user ID (auto-set on login/register)
- `society_id` - Society ID (auto-set when creating society)
- `member_id` - Member ID (auto-set when creating member)

## Authentication

The collection uses **Bearer Token** authentication. The token is automatically saved to the `auth_token` variable when you:
- Register a new user
- Login

All protected endpoints use this token automatically.

## Auto-Save Variables

The collection includes test scripts that automatically save IDs to variables:

- **Register/Login**: Saves `auth_token` and `user_id`
- **Create Society**: Saves `society_id`
- **Create Member**: Saves `member_id`

## Usage

1. **Set Base URL**: Update `base_url` variable if your server runs on a different port
2. **Register/Login**: Run Register or Login request to get authentication token
3. **Use Protected Endpoints**: All other endpoints will use the saved token automatically

## Example Workflow

1. Run **Health Check** to verify server is running
2. Run **Register User** or **Login** to authenticate
3. Create a **Society** (saves `society_id`)
4. Create a **Member** (saves `member_id`)
5. Use other endpoints as needed

## Updating the Collection

To regenerate the collection with all endpoints:

```bash
node generate_postman_collection.js
```

This will create/update `Society_Management_API.postman_collection.json` with all current endpoints.

## Notes

- All POST/PUT requests include example request bodies
- Query parameters are included where applicable
- Authentication is automatically applied to protected endpoints
- Variables are automatically updated when creating resources

## Additional Endpoints

The collection includes endpoints for:
- Assets
- Maintenance (Requests, Bills, Charges)
- Visitors
- Notifications
- Roles & Permissions
- Subscriptions
- Payments
- Audit Logs
- Configuration
- Logs

All endpoints follow the same pattern with proper authentication and variable management.

