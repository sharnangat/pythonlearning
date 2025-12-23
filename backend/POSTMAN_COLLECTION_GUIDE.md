# Postman Collection Guide

## ✅ Postman Collection Created Successfully!

**File:** `Society_Management_API.postman_collection.json`  
**Total Folders:** 23  
**Total Endpoints:** 92+

## 📥 How to Import

1. Open **Postman**
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `Society_Management_API.postman_collection.json`
5. Click **Import**

## 📁 Collection Structure

### 1. Health Check
- ✅ GET `/health` - Server health check

### 2. Authentication (4 endpoints)
- ✅ POST `/api/auth/register` - Register new user
- ✅ POST `/api/auth/login` - Login user
- ✅ GET `/api/auth/profile` - Get user profile
- ✅ POST `/api/auth/logout` - Logout user

### 3. Users (5 endpoints)
- ✅ GET `/api/users` - Get all users
- ✅ GET `/api/users/:id` - Get user by ID
- ✅ PUT `/api/users/:id` - Update user
- ✅ DELETE `/api/users/:id` - Delete user
- ✅ POST `/api/users/change-password` - Change password

### 4. Societies (5 endpoints)
- ✅ GET `/api/societies` - Get all societies
- ✅ GET `/api/societies/:id` - Get society by ID
- ✅ POST `/api/societies` - Create society
- ✅ PUT `/api/societies/:id` - Update society
- ✅ DELETE `/api/societies/:id` - Delete society

### 5. Members (5 endpoints)
- ✅ GET `/api/members` - Get all members
- ✅ GET `/api/members/:id` - Get member by ID
- ✅ POST `/api/members` - Create member
- ✅ PUT `/api/members/:id` - Update member
- ✅ DELETE `/api/members/:id` - Delete member

### 6. Roles (6 endpoints)
- ✅ GET `/api/roles` - Get all roles
- ✅ GET `/api/roles/permissions` - Get permissions
- ✅ POST `/api/roles/assign` - Assign role to user
- ✅ POST `/api/roles` - Create role
- ✅ PUT `/api/roles/:id` - Update role
- ✅ DELETE `/api/roles/:id` - Delete role

### 7. Permissions (5 endpoints)
- ✅ GET `/api/permissions` - Get all permissions
- ✅ GET `/api/permissions/:id` - Get permission by ID
- ✅ POST `/api/permissions` - Create permission
- ✅ PUT `/api/permissions/:id` - Update permission
- ✅ DELETE `/api/permissions/:id` - Delete permission

### 8. Role Permissions (4 endpoints)
- ✅ GET `/api/role-permissions` - Get role permissions
- ✅ POST `/api/role-permissions` - Assign permission to role
- ✅ PUT `/api/role-permissions/:id` - Update role permission
- ✅ DELETE `/api/role-permissions/:id` - Remove permission from role

### 9. User Roles (4 endpoints)
- ✅ GET `/api/user-roles` - Get user roles
- ✅ GET `/api/user-roles/:id` - Get user role by ID
- ✅ PUT `/api/user-roles/:id` - Update user role
- ✅ DELETE `/api/user-roles/:id` - Revoke user role

### 10. Assets (5 endpoints)
- ✅ GET `/api/assets` - Get all assets
- ✅ GET `/api/assets/:id` - Get asset by ID
- ✅ POST `/api/assets` - Create asset
- ✅ PUT `/api/assets/:id` - Update asset
- ✅ DELETE `/api/assets/:id` - Delete asset

### 11. Maintenance (5 endpoints)
- ✅ GET `/api/maintenance/requests` - Get maintenance requests
- ✅ POST `/api/maintenance/requests` - Create maintenance request
- ✅ PUT `/api/maintenance/requests/:id` - Update maintenance request
- ✅ GET `/api/maintenance/bills` - Get maintenance bills
- ✅ GET `/api/maintenance/bills/:id` - Get maintenance bill by ID

### 12. Maintenance Charges (5 endpoints)
- ✅ GET `/api/maintenance-charges` - Get maintenance charges
- ✅ GET `/api/maintenance-charges/:id` - Get maintenance charge by ID
- ✅ POST `/api/maintenance-charges` - Create maintenance charge
- ✅ PUT `/api/maintenance-charges/:id` - Update maintenance charge
- ✅ DELETE `/api/maintenance-charges/:id` - Delete maintenance charge

### 13. Member Maintenance Charges (5 endpoints)
- ✅ GET `/api/member-maintenance-charges` - Get member maintenance charges
- ✅ GET `/api/member-maintenance-charges/:id` - Get member maintenance charge by ID
- ✅ POST `/api/member-maintenance-charges` - Create member maintenance charge
- ✅ PUT `/api/member-maintenance-charges/:id` - Update member maintenance charge
- ✅ DELETE `/api/member-maintenance-charges/:id` - Delete member maintenance charge

### 14. Maintenance Bill Items (4 endpoints)
- ✅ GET `/api/maintenance-bill-items/bill/:bill_id` - Get bill items
- ✅ POST `/api/maintenance-bill-items` - Create bill item
- ✅ PUT `/api/maintenance-bill-items/:id` - Update bill item
- ✅ DELETE `/api/maintenance-bill-items/:id` - Delete bill item

### 15. Visitors (4 endpoints)
- ✅ GET `/api/visitors` - Get visitors
- ✅ POST `/api/visitors` - Create visitor entry
- ✅ PUT `/api/visitors/:id/checkout` - Checkout visitor
- ✅ POST `/api/visitors/pre-register` - Pre-register visitor

### 16. Visitor Logs (2 endpoints)
- ✅ GET `/api/visitor-logs` - Get visitor logs
- ✅ GET `/api/visitor-logs/:id` - Get visitor log by ID

### 17. Notifications (3 endpoints)
- ✅ GET `/api/notifications` - Get notifications
- ✅ PUT `/api/notifications/:id/read` - Mark notification as read
- ✅ PUT `/api/notifications/read-all` - Mark all as read

### 18. Subscriptions (6 endpoints)
- ✅ GET `/api/subscriptions/plans` - Get subscription plans
- ✅ POST `/api/subscriptions/plans` - Create subscription plan
- ✅ PUT `/api/subscriptions/plans/:id` - Update subscription plan
- ✅ GET `/api/subscriptions` - Get society subscriptions
- ✅ POST `/api/subscriptions` - Create society subscription
- ✅ PUT `/api/subscriptions/:id` - Update subscription

### 19. Payments (2 endpoints)
- ✅ GET `/api/payments` - Get payments
- ✅ POST `/api/payments/maintenance` - Process maintenance payment

### 20. Payment Methods (5 endpoints)
- ✅ GET `/api/payment-methods` - Get payment methods
- ✅ GET `/api/payment-methods/:id` - Get payment method by ID
- ✅ POST `/api/payment-methods` - Create payment method
- ✅ PUT `/api/payment-methods/:id` - Update payment method
- ✅ DELETE `/api/payment-methods/:id` - Delete payment method

### 21. Audit Logs (2 endpoints)
- ✅ GET `/api/audit-logs` - Get audit logs
- ✅ GET `/api/audit-logs/:id` - Get audit log by ID

### 22. Configuration (2 endpoints)
- ✅ GET `/api/config` - Get configuration
- ✅ PUT `/api/config/:id` - Update configuration

### 23. Logs (3 endpoints)
- ✅ GET `/api/logs/requests` - Get recent requests
- ✅ GET `/api/logs/responses` - Get recent responses
- ✅ GET `/api/logs/pair/:requestId` - Get request-response pair

## 🔐 Authentication

The collection uses **Bearer Token** authentication. The token is automatically saved when you:
- Register a new user
- Login

All protected endpoints use this token automatically via collection-level authentication.

## 📝 Collection Variables

The collection includes these variables:

- `base_url` - API base URL (default: `http://localhost:3000`)
- `auth_token` - JWT token (auto-set on login/register)
- `user_id` - Current user ID (auto-set on login/register)
- `society_id` - Society ID (auto-set when creating society)
- `member_id` - Member ID (auto-set when creating member)
- `role_id` - Role ID
- `permission_id` - Permission ID
- `asset_id` - Asset ID
- `visitor_id` - Visitor ID

## 🚀 Quick Start

1. **Set Base URL**: Update `base_url` variable if needed (default: `http://localhost:3000`)
2. **Run Health Check**: Verify server is running
3. **Register/Login**: Run Register or Login request to authenticate
4. **Use Endpoints**: All other endpoints will use the saved token automatically

## 🔄 Auto-Save Variables

The collection includes test scripts that automatically save IDs:

- **Register/Login**: Saves `auth_token` and `user_id`
- **Create Society**: Saves `society_id`
- **Create Member**: Saves `member_id`
- **Create Asset**: Saves `asset_id`
- **Create Visitor**: Saves `visitor_id`

## 📋 Example Workflow

1. ✅ Run **Health Check** → Verify server is running
2. ✅ Run **Register User** or **Login** → Get authentication token
3. ✅ Run **Create Society** → Saves `society_id`
4. ✅ Run **Create Member** → Saves `member_id`
5. ✅ Use other endpoints as needed

## 🔧 Updating the Collection

To regenerate the collection:

```bash
node create_complete_postman_collection.js
```

This will update `Society_Management_API.postman_collection.json` with all current endpoints.

## ✨ Features

- ✅ **92+ endpoints** organized in 23 folders
- ✅ **Automatic authentication** via Bearer token
- ✅ **Auto-save variables** for IDs
- ✅ **Example request bodies** for all POST/PUT requests
- ✅ **Query parameters** included where applicable
- ✅ **Organized structure** by feature/domain

## 📊 Statistics

- **Total Folders:** 23
- **Total Endpoints:** 92+
- **Authentication:** Bearer Token (JWT)
- **Variables:** 8 collection variables
- **Auto-save Scripts:** 5+ endpoints

## ✅ Status

**Postman collection is complete and ready to use!**

Import the collection into Postman and start testing your APIs immediately.

