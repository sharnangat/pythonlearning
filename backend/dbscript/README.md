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
17. **maintenance_charges** - Configurable maintenance charges (Society Admin)
18. **member_maintenance_charges** - Member-specific maintenance charges
19. **maintenance_bills** - Monthly maintenance bills
20. **maintenance_bill_items** - Bill line items
21. **maintenance_payments** - Payment records for maintenance bills
22. **visitors** - Visitor entry/exit management
23. **visitor_pre_registrations** - Pre-registered visitor requests
24. **visitor_logs** - Detailed visitor activity logs

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
- **Permission Codes**: Each permission has a unique code (e.g., 'USR_CREATE', 'MEM_READ') for easy reference and API usage

### Society Management
- Multiple societies support
- Society-specific configurations
- Society-specific roles and permissions
- Member management per society
- **Super Admin Control**: Super admin can access and manage all societies

### Monthly Maintenance Management
- **Configurable Charges**: Society admin can configure maintenance charges
- **Flexible Pricing**: Flat rate, per sqft, per member, per flat, or custom
- **Automatic Billing**: Generate monthly bills automatically
- **Payment Tracking**: Track payments against maintenance bills
- **Member-Specific Charges**: Custom charges for individual members
- **Bill Generation**: Automated bill generation with line items
- **Payment Processing**: Record and track maintenance payments

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
- **maintenance_charges** - Maintenance charge configuration (Society Admin)
- **maintenance_bills** - Maintenance bill management
- **maintenance_payments** - Maintenance payment processing
- **visitors** - Visitor management and tracking
- **visitor_pre_registrations** - Pre-registration and approval workflow
- **visitor_logs** - Visitor activity audit trail

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

**Quick Setup (Recommended):**

Choose one of the following methods:

1. **PowerShell (Windows):**
   ```powershell
   cd backend/dbscript
   .\setup_database.ps1
   ```

2. **Bash Script (Linux/Mac/Git Bash):**
   ```bash
   cd backend/dbscript
   chmod +x setup_database.sh
   ./setup_database.sh
   ```

3. **Node.js Script (Cross-platform):**
   ```bash
   cd backend/dbscript
   npm install pg dotenv
   node setup_database.js
   ```

4. **Manual Setup (Using psql):**
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE soc_db;"
   
   # Run schema
   psql -U postgres -d soc_db -f backend/dbscript/schema.sql
   ```

For detailed setup instructions, see [README_SETUP.md](README_SETUP.md)

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

### Configure Monthly Maintenance Charges (Society Admin)

```sql
-- Create a flat rate maintenance charge
INSERT INTO maintenance_charges (
    society_id, charge_name, charge_type, base_amount, 
    applicable_to, description, created_by
)
SELECT 
    'society-uuid',
    'Monthly Maintenance',
    'flat_rate',
    2000.00,
    'all',
    'Monthly maintenance charge for all members',
    'admin-user-uuid';

-- Create a per sqft charge
INSERT INTO maintenance_charges (
    society_id, charge_name, charge_type, base_amount, 
    per_unit_rate, unit_type, applicable_to, description
)
SELECT 
    'society-uuid',
    'Maintenance per Sqft',
    'per_sqft',
    500.00,
    5.00,
    'sqft',
    'owners',
    'Maintenance based on flat area',
    'admin-user-uuid';

-- Generate monthly bills for a society
SELECT generate_maintenance_bills(
    'society-uuid'::UUID,
    '2024-01-01'::DATE, -- Billing month
    15 -- Due days
);
```

### Maintenance Charge Types

1. **flat_rate** - Fixed amount for all members
2. **per_sqft** - Based on flat area (requires flat area data)
3. **per_member** - Per member charge
4. **per_flat** - Per flat charge
5. **custom** - Custom calculation logic

### Society Admin Permissions

Society admin (`societyAdmin` role) has permissions to:
- Create, read, update, delete maintenance charges (`MCH_CREATE`, `MCH_READ`, `MCH_UPDATE`, `MCH_DELETE`)
- Generate monthly maintenance bills (`MCH_GENERATE`)
- View and update maintenance bills (`MBILL_READ`, `MBILL_UPDATE`)
- Process maintenance payments (`MPAY_PROCESS`)
- Configure member-specific charges

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

