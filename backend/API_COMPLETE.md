# Complete API List

## ✅ All Tables Now Have APIs

### Authentication APIs
- ✅ `POST /api/auth/register` - Register user
- ✅ `POST /api/auth/login` - Login
- ✅ `GET /api/auth/profile` - Get profile
- ✅ `POST /api/auth/logout` - Logout

### User Management APIs
- ✅ `GET /api/users` - List users
- ✅ `GET /api/users/:id` - Get user
- ✅ `PUT /api/users/:id` - Update user
- ✅ `DELETE /api/users/:id` - Delete user
- ✅ `POST /api/users/:id/change-password` - Change password

### Society Management APIs
- ✅ `GET /api/societies` - List societies
- ✅ `GET /api/societies/:id` - Get society
- ✅ `POST /api/societies` - Create society
- ✅ `PUT /api/societies/:id` - Update society
- ✅ `DELETE /api/societies/:id` - Delete society

### Member Management APIs
- ✅ `GET /api/members` - List members
- ✅ `GET /api/members/:id` - Get member
- ✅ `POST /api/members` - Create member
- ✅ `PUT /api/members/:id` - Update member
- ✅ `DELETE /api/members/:id` - Delete member

### Role & Permission APIs
- ✅ `GET /api/roles` - List roles
- ✅ `GET /api/roles/permissions` - List permissions
- ✅ `POST /api/roles/assign` - Assign role to user
- ✅ `GET /api/role-permissions` - List role permissions
- ✅ `POST /api/role-permissions` - Assign permission to role
- ✅ `PUT /api/role-permissions/:id` - Update role permission
- ✅ `DELETE /api/role-permissions/:id` - Remove permission from role

### Asset Management APIs
- ✅ `GET /api/assets` - List assets
- ✅ `GET /api/assets/:id` - Get asset
- ✅ `POST /api/assets` - Create asset
- ✅ `PUT /api/assets/:id` - Update asset
- ✅ `DELETE /api/assets/:id` - Delete asset

### Maintenance APIs
- ✅ `GET /api/maintenance/requests` - List maintenance requests
- ✅ `POST /api/maintenance/requests` - Create maintenance request
- ✅ `PUT /api/maintenance/requests/:id` - Update maintenance request
- ✅ `GET /api/maintenance/bills` - List maintenance bills
- ✅ `GET /api/maintenance/bills/:id` - Get bill details
- ✅ `GET /api/maintenance-charges` - List maintenance charges
- ✅ `GET /api/maintenance-charges/:id` - Get maintenance charge
- ✅ `POST /api/maintenance-charges` - Create maintenance charge
- ✅ `PUT /api/maintenance-charges/:id` - Update maintenance charge
- ✅ `DELETE /api/maintenance-charges/:id` - Delete maintenance charge
- ✅ `GET /api/member-maintenance-charges` - List member maintenance charges
- ✅ `GET /api/member-maintenance-charges/:id` - Get member maintenance charge
- ✅ `POST /api/member-maintenance-charges` - Create member maintenance charge
- ✅ `PUT /api/member-maintenance-charges/:id` - Update member maintenance charge
- ✅ `DELETE /api/member-maintenance-charges/:id` - Delete member maintenance charge

### Visitor Management APIs
- ✅ `GET /api/visitors` - List visitors
- ✅ `POST /api/visitors` - Check in visitor
- ✅ `PUT /api/visitors/:id/checkout` - Check out visitor
- ✅ `POST /api/visitors/pre-register` - Pre-register visitor
- ✅ `GET /api/visitor-logs` - List visitor logs
- ✅ `GET /api/visitor-logs/:id` - Get visitor log

### Notification APIs
- ✅ `GET /api/notifications` - List notifications
- ✅ `PUT /api/notifications/:id/read` - Mark notification as read
- ✅ `PUT /api/notifications/read-all` - Mark all as read

### Subscription APIs
- ✅ `GET /api/subscriptions/plans` - List subscription plans
- ✅ `GET /api/subscriptions` - List society subscriptions

### Payment APIs
- ✅ `GET /api/payments` - List payments
- ✅ `POST /api/payments/maintenance` - Process maintenance payment
- ✅ `GET /api/payment-methods` - List payment methods
- ✅ `GET /api/payment-methods/:id` - Get payment method
- ✅ `POST /api/payment-methods` - Create payment method
- ✅ `PUT /api/payment-methods/:id` - Update payment method
- ✅ `DELETE /api/payment-methods/:id` - Delete payment method

### Audit Log APIs
- ✅ `GET /api/audit-logs` - List audit logs (Admin only)
- ✅ `GET /api/audit-logs/:id` - Get audit log (Admin only)

### Configuration APIs
- ✅ `GET /api/config` - Get configurations
- ✅ `PUT /api/config/:id` - Update configuration

## Summary

**Total Tables:** 24
**Tables with APIs:** 24 ✅

All database tables now have corresponding API endpoints!

