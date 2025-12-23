# Database Schema Documentation

## Society Management System - Database Structure

This document describes the database schema for the Society Management System with Role-Based Access Control (RBAC) and Permission-Based Access Control.

## Database Tables Overview

### Core Tables

1. **users** - User account information
2. **societies** - Society/housing society information
3. **roles** - Role definitions with hierarchy
4. **permissions** - Permission definitions
5. **role_permissions** - Links roles to permissions
6. **user_roles** - Links users to roles (can be society-specific)
7. **members** - Society member information
8. **assets** - Society assets and maintenance
9. **company_config** - Configuration settings
10. **maintenance_requests** - Maintenance and repair requests
11. **audit_logs** - Audit trail
12. **notifications** - User notifications
13. **subscription_plans** - Subscription plan definitions
14. **society_subscriptions** - Active subscriptions for societies
15. **payments** - Payment transactions
16. **payment_methods** - Stored payment methods

## Key Features

### Role-Based Access Control (RBAC)
- Hierarchical role system with `hierarchy_level`
- Society-specific roles (roles can be assigned per society)
- System roles that cannot be deleted
- Role validity periods (valid_from, valid_until)

### Permission-Based Access Control
- Granular permissions for resources and actions
- Resource-based permissions (users, members, societies, assets, etc.)
- Action-based permissions (create, read, update, delete, approve)
- Permissions assigned to roles, not directly to users

### Society Management
- Multiple societies support
- Society-specific configurations
- Society-specific roles and permissions
- Member management per society
- **Super Admin Control**: Super admin can access and manage all societies

### Subscription Management
- **Monthly Subscription Model**: Based on member count
- **Flexible Pricing**: Base price + price per member
- **Multiple Plans**: Basic, Standard, Premium, Enterprise
- **Automatic Billing**: Monthly billing cycle management
- **Payment Tracking**: Complete payment history and invoices
- **Auto-renewal**: Automatic subscription renewal
- **Member Count Tracking**: Automatic recalculation when members change

## Default Roles

1. **superAdmin** (Level 100) - System-wide administrator
2. **societyAdmin** (Level 80) - Society administrator
3. **secretary** (Level 60) - Society secretary
4. **treasurer** (Level 60) - Society treasurer
5. **committeeMember** (Level 40) - Committee member
6. **member** (Level 20) - Regular member
7. **tenant** (Level 10) - Tenant with limited access

## Default Permissions

Permissions are organized by resource:
- **users** - User management
- **societies** - Society management
- **members** - Member management
- **roles** - Role management
- **permissions** - Permission management
- **assets** - Asset management
- **maintenance** - Maintenance requests
- **config** - Configuration management
- **financials** - Financial management
- **reports** - Reports and analytics
- **subscriptions** - Subscription management
- **payments** - Payment processing
- **plans** - Plan management

## Subscription Plans

### Default Plans

1. **Basic Plan** - ₹500/month + ₹10/member (1-50 members)
2. **Standard Plan** - ₹1000/month + ₹8/member (51-200 members) - Default
3. **Premium Plan** - ₹2000/month + ₹5/member (201+ members)
4. **Enterprise Plan** - ₹5000/month + ₹3/member (500+ members)

### Pricing Calculation
```
Monthly Amount = Base Price + (Price per Member × Active Member Count)
```

### Subscription Features
- Automatic member count tracking
- Monthly billing cycle management
- Payment method storage
- Invoice generation
- Payment history
- Auto-renewal support
- Trial period support

## Usage

### Setup Database

```sql
-- Run the schema file
\i dbscript/schema.sql
```

### Create a Super Admin User

```sql
-- Insert super admin user (password should be hashed)
INSERT INTO users (username, email, password_hash, first_name, last_name, status, email_verified)
VALUES ('superadmin', 'admin@society.com', '$2b$10$hashedpassword', 'Super', 'Admin', 'active', TRUE);

-- Assign superAdmin role
INSERT INTO user_roles (user_id, role_id, is_active)
SELECT u.id, r.id, TRUE
FROM users u, roles r
WHERE u.username = 'superadmin' AND r.role_name = 'superAdmin';
```

### Create a Society

```sql
INSERT INTO societies (society_name, registration_number, address, city, state, status)
VALUES ('Green Valley Society', 'REG123456', '123 Main Street', 'Mumbai', 'Maharashtra', 'active');
```

### Assign Role to User for a Society

```sql
INSERT INTO user_roles (user_id, role_id, society_id, is_active)
SELECT u.id, r.id, s.id, TRUE
FROM users u, roles r, societies s
WHERE u.username = 'john_doe' 
  AND r.role_name = 'societyAdmin'
  AND s.society_name = 'Green Valley Society';
```

### Create Subscription for a Society

```sql
-- Get member count
SELECT COUNT(*) INTO member_count FROM members WHERE society_id = 'society-uuid' AND status = 'active';

-- Create subscription
INSERT INTO society_subscriptions (
    society_id, 
    plan_id, 
    member_count, 
    monthly_amount,
    billing_cycle_start,
    billing_cycle_end,
    next_billing_date,
    status
)
SELECT 
    'society-uuid',
    p.id,
    member_count,
    calculate_subscription_amount(p.id, member_count),
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 month' - INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '1 month',
    'active'
FROM subscription_plans p
WHERE p.plan_name = 'standard';
```

### Super Admin Access to All Societies

Super admin users have access to all societies automatically through their role permissions. The system checks:
1. If user has `superAdmin` role (no society_id restriction)
2. Super admin can view/manage all societies regardless of user_roles table entries
3. All subscription and payment permissions are granted to superAdmin

## Security Considerations

1. **Password Storage**: Always hash passwords using bcrypt or similar
2. **Audit Trail**: All changes are logged in `audit_logs` table
3. **Role Hierarchy**: Higher hierarchy levels have more authority
4. **Society Isolation**: Users can have different roles in different societies
5. **Permission Checks**: Always verify permissions before allowing actions

## Indexes

All tables have appropriate indexes for:
- Foreign keys
- Frequently queried columns
- Search fields (email, username, membership_number, etc.)
- Status fields for filtering

## Triggers

- Automatic `updated_at` timestamp updates on all tables
- Can be extended for audit logging on data changes

## Notes

- Uses UUID for primary keys for better distribution and security
- JSONB columns for flexible document/image storage
- Check constraints for data validation
- Cascade deletes for referential integrity
- Unique constraints to prevent duplicates

