-- =====================================================
-- Society Management System Database Schema
-- Role-Based and Permission-Based Access Control
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending_verification' CHECK (status IN ('active', 'inactive', 'pending_verification', 'suspended', 'locked')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    last_login TIMESTAMP,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- 2. SOCIETIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    registration_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'closed')),
    total_flats INTEGER,
    total_members INTEGER DEFAULT 0,
    description TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_societies_name ON societies(society_name);
CREATE INDEX idx_societies_registration_number ON societies(registration_number);
CREATE INDEX idx_societies_status ON societies(status);

-- =====================================================
-- 3. ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INTEGER DEFAULT 0, -- Higher number = higher authority
    society_id UUID REFERENCES societies(id), -- NULL for global roles like superAdmin
    is_system_role BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    CONSTRAINT unique_role_per_society UNIQUE (role_name, society_id)
);

CREATE INDEX idx_roles_name ON roles(role_name);
CREATE INDEX idx_roles_society ON roles(society_id);
CREATE INDEX idx_roles_hierarchy ON roles(hierarchy_level);

-- =====================================================
-- 4. PERMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code VARCHAR(50) UNIQUE NOT NULL, -- Unique permission code (e.g., 'USR_CREATE', 'MEM_READ')
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL, -- e.g., 'users', 'members', 'societies', 'assets', 'financials'
    action VARCHAR(50) NOT NULL, -- e.g., 'create', 'read', 'update', 'delete', 'approve'
    is_system_permission BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_permissions_code ON permissions(permission_code);
CREATE INDEX idx_permissions_name ON permissions(permission_name);
CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_permissions_action ON permissions(action);

-- =====================================================
-- 5. ROLE_PERMISSIONS TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- =====================================================
-- 6. USER_ROLES TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    society_id UUID REFERENCES societies(id), -- For society-specific roles
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP, -- NULL means no expiration
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by UUID REFERENCES users(id),
    revoked_at TIMESTAMP,
    revoked_by UUID REFERENCES users(id),
    CONSTRAINT unique_user_role_society UNIQUE (user_id, role_id, society_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_user_roles_society ON user_roles(society_id);
CREATE INDEX idx_user_roles_active ON user_roles(is_active);

-- =====================================================
-- 7. MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    membership_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id), -- Link to user account if exists
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    flat_number VARCHAR(50),
    floor_number INTEGER,
    building_name VARCHAR(100),
    wing VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    occupation VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    member_type VARCHAR(50) DEFAULT 'owner' CHECK (member_type IN ('owner', 'tenant', 'family_member', 'other')),
    ownership_percentage DECIMAL(5,2) DEFAULT 100.00,
    joining_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'deceased')),
    is_primary_member BOOLEAN DEFAULT FALSE,
    documents JSONB, -- Store document URLs/metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_members_society ON members(society_id);
CREATE INDEX idx_members_membership_number ON members(membership_number);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_members_flat ON members(society_id, flat_number);
CREATE INDEX idx_members_status ON members(status);

-- =====================================================
-- 8. ASSETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('building', 'vehicle', 'equipment', 'furniture', 'land', 'other')),
    asset_code VARCHAR(100) UNIQUE,
    description TEXT,
    location VARCHAR(255),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    current_value DECIMAL(15,2),
    depreciation_rate DECIMAL(5,2),
    vendor_name VARCHAR(255),
    warranty_expiry DATE,
    maintenance_schedule JSONB, -- Store maintenance schedule details
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_maintenance', 'disposed', 'sold')),
    condition_status VARCHAR(50) CHECK (condition_status IN ('excellent', 'good', 'fair', 'poor', 'needs_repair')),
    images JSONB, -- Store image URLs
    documents JSONB, -- Store document URLs
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_assets_society ON assets(society_id);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_code ON assets(asset_code);
CREATE INDEX idx_assets_status ON assets(status);

-- =====================================================
-- 9. COMPANY_CONFIG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS company_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE, -- NULL for global config
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string' CHECK (config_type IN ('string', 'number', 'boolean', 'json', 'date')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    category VARCHAR(50), -- e.g., 'financial', 'maintenance', 'communication', 'security'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    CONSTRAINT unique_config_key_society UNIQUE (config_key, society_id)
);

CREATE INDEX idx_company_config_society ON company_config(society_id);
CREATE INDEX idx_company_config_key ON company_config(config_key);
CREATE INDEX idx_company_config_category ON company_config(category);

-- =====================================================
-- 10. MAINTENANCE_REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id),
    requested_by UUID REFERENCES users(id),
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('repair', 'installation', 'inspection', 'cleaning', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rejected')),
    assigned_to UUID REFERENCES users(id),
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    completion_date TIMESTAMP,
    images JSONB,
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_maintenance_society ON maintenance_requests(society_id);
CREATE INDEX idx_maintenance_member ON maintenance_requests(member_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);
CREATE INDEX idx_maintenance_assigned ON maintenance_requests(assigned_to);

-- =====================================================
-- 11. AUDIT_LOG TABLE (For tracking all changes)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    resource_type VARCHAR(50) NOT NULL, -- 'user', 'member', 'society', 'role', etc.
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =====================================================
-- 12. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    action_url VARCHAR(500),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_society ON notifications(society_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- =====================================================
-- 13. SUBSCRIPTION_PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Base monthly price
    price_per_member DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Price per member per month
    min_members INTEGER DEFAULT 0, -- Minimum members required
    max_members INTEGER, -- NULL means unlimited
    features JSONB, -- Store plan features as JSON
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    trial_days INTEGER DEFAULT 0, -- Free trial period in days
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX idx_subscription_plans_default ON subscription_plans(is_default);

-- =====================================================
-- 14. SOCIETY_SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS society_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    member_count INTEGER NOT NULL DEFAULT 0, -- Current member count
    monthly_amount DECIMAL(10,2) NOT NULL, -- Calculated monthly amount
    billing_cycle_start DATE NOT NULL, -- Start date of billing cycle
    billing_cycle_end DATE NOT NULL, -- End date of billing cycle
    next_billing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'trial', 'suspended', 'cancelled', 'expired', 'pending_payment')),
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method VARCHAR(50), -- 'credit_card', 'debit_card', 'upi', 'bank_transfer', etc.
    payment_gateway VARCHAR(50), -- Payment gateway used
    subscription_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subscription_end_date DATE, -- NULL for active subscriptions
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE UNIQUE INDEX idx_unique_society_active_subscription ON society_subscriptions(society_id, status) WHERE status = 'active';
CREATE INDEX idx_society_subscriptions_society ON society_subscriptions(society_id);
CREATE INDEX idx_society_subscriptions_plan ON society_subscriptions(plan_id);
CREATE INDEX idx_society_subscriptions_status ON society_subscriptions(status);
CREATE INDEX idx_society_subscriptions_next_billing ON society_subscriptions(next_billing_date);

-- =====================================================
-- 15. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES society_subscriptions(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('subscription', 'renewal', 'upgrade', 'downgrade', 'refund', 'adjustment')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE, -- Gateway transaction ID
    gateway_response JSONB, -- Store gateway response
    invoice_number VARCHAR(100) UNIQUE,
    invoice_url VARCHAR(500),
    receipt_url VARCHAR(500),
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    member_count INTEGER NOT NULL, -- Member count at time of billing
    base_amount DECIMAL(10,2) NOT NULL, -- Base plan amount
    member_amount DECIMAL(10,2) NOT NULL, -- Amount for members
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_at TIMESTAMP,
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_society ON payments(society_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_number);
CREATE INDEX idx_payments_due_date ON payments(due_date);

-- =====================================================
-- 16. PAYMENT_METHODS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('credit_card', 'debit_card', 'upi', 'bank_account', 'wallet')),
    provider VARCHAR(100), -- Payment gateway/provider name
    account_holder_name VARCHAR(255),
    account_number_last4 VARCHAR(4), -- Last 4 digits for security
    expiry_date DATE, -- For cards
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    gateway_token VARCHAR(255), -- Encrypted token from payment gateway
    billing_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payment_methods_society ON payment_methods(society_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(is_default);
CREATE INDEX idx_payment_methods_active ON payment_methods(is_active);

-- =====================================================
-- 17. MAINTENANCE_CHARGES TABLE (Society Maintenance Configuration)
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    charge_name VARCHAR(255) NOT NULL, -- e.g., 'Monthly Maintenance', 'Water Charges', 'Parking Charges'
    charge_type VARCHAR(50) NOT NULL CHECK (charge_type IN ('flat_rate', 'per_sqft', 'per_member', 'per_flat', 'custom')),
    base_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Base charge amount
    per_unit_rate DECIMAL(10,2) DEFAULT 0.00, -- Rate per unit (sqft, member, flat, etc.)
    unit_type VARCHAR(50), -- 'sqft', 'member', 'flat', etc.
    is_active BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT TRUE, -- Recurring monthly charge
    applicable_to VARCHAR(50) DEFAULT 'all' CHECK (applicable_to IN ('all', 'owners', 'tenants', 'both')),
    flat_type_filter JSONB, -- Filter by flat types if needed
    description TEXT,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_until DATE, -- NULL means no end date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_maintenance_charges_society ON maintenance_charges(society_id);
CREATE INDEX idx_maintenance_charges_active ON maintenance_charges(is_active);
CREATE INDEX idx_maintenance_charges_effective ON maintenance_charges(effective_from, effective_until);

-- =====================================================
-- 18. MEMBER_MAINTENANCE_CHARGES TABLE (Individual Member Charges)
-- =====================================================
CREATE TABLE IF NOT EXISTS member_maintenance_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    charge_id UUID REFERENCES maintenance_charges(id) ON DELETE SET NULL, -- NULL for custom charges
    charge_name VARCHAR(255) NOT NULL,
    charge_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    calculation_basis JSONB, -- Store calculation details (sqft, flat_type, etc.)
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_until DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE UNIQUE INDEX idx_unique_member_charge ON member_maintenance_charges(member_id, charge_id, effective_from) WHERE charge_id IS NOT NULL;
CREATE INDEX idx_member_maintenance_charges_society ON member_maintenance_charges(society_id);
CREATE INDEX idx_member_maintenance_charges_member ON member_maintenance_charges(member_id);
CREATE INDEX idx_member_maintenance_charges_charge ON member_maintenance_charges(charge_id);
CREATE INDEX idx_member_maintenance_charges_active ON member_maintenance_charges(is_active);

-- =====================================================
-- 19. MAINTENANCE_BILLS TABLE (Monthly Maintenance Bills)
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    bill_number VARCHAR(100) UNIQUE NOT NULL,
    billing_month DATE NOT NULL, -- First day of billing month
    billing_year INTEGER NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'waived', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    pending_amount DECIMAL(10,2) NOT NULL,
    late_fee DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by UUID REFERENCES users(id),
    paid_at TIMESTAMP,
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_maintenance_bills_society ON maintenance_bills(society_id);
CREATE INDEX idx_maintenance_bills_member ON maintenance_bills(member_id);
CREATE INDEX idx_maintenance_bills_billing_month ON maintenance_bills(billing_month, billing_year);
CREATE INDEX idx_maintenance_bills_status ON maintenance_bills(status);
CREATE INDEX idx_maintenance_bills_due_date ON maintenance_bills(due_date);
CREATE INDEX idx_maintenance_bills_bill_number ON maintenance_bills(bill_number);

-- =====================================================
-- 20. MAINTENANCE_BILL_ITEMS TABLE (Bill Line Items)
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES maintenance_bills(id) ON DELETE CASCADE,
    charge_id UUID REFERENCES maintenance_charges(id),
    charge_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10,2) DEFAULT 1.00, -- For per_unit calculations
    unit_rate DECIMAL(10,2) DEFAULT 0.00,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_bill_items_bill ON maintenance_bill_items(bill_id);
CREATE INDEX idx_maintenance_bill_items_charge ON maintenance_bill_items(charge_id);

-- =====================================================
-- 21. MAINTENANCE_PAYMENTS TABLE (Payment Records for Maintenance)
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES maintenance_bills(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'cheque', 'online', 'upi', 'bank_transfer', 'neft', 'rtgs', 'other')),
    payment_reference VARCHAR(255), -- Cheque number, transaction ID, etc.
    payment_status VARCHAR(20) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    received_by UUID REFERENCES users(id),
    receipt_number VARCHAR(100) UNIQUE,
    receipt_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_maintenance_payments_bill ON maintenance_payments(bill_id);
CREATE INDEX idx_maintenance_payments_society ON maintenance_payments(society_id);
CREATE INDEX idx_maintenance_payments_member ON maintenance_payments(member_id);
CREATE INDEX idx_maintenance_payments_date ON maintenance_payments(payment_date);
CREATE INDEX idx_maintenance_payments_status ON maintenance_payments(payment_status);
CREATE INDEX idx_maintenance_payments_receipt ON maintenance_payments(receipt_number);

-- =====================================================
-- 22. VISITORS TABLE (Visitor Entry/Exit Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id), -- Member/flat being visited
    flat_number VARCHAR(50), -- Flat number being visited
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20),
    visitor_email VARCHAR(255),
    visitor_id_type VARCHAR(50) CHECK (visitor_id_type IN ('aadhaar', 'pan', 'driving_license', 'voter_id', 'passport', 'other')),
    visitor_id_number VARCHAR(100),
    visitor_address TEXT,
    purpose_of_visit VARCHAR(255), -- e.g., 'meeting', 'delivery', 'service', 'guest', 'other'
    number_of_visitors INTEGER DEFAULT 1,
    vehicle_number VARCHAR(50), -- If visitor has vehicle
    vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('car', 'bike', 'auto', 'truck', 'other')),
    entry_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP,
    expected_exit_time TIMESTAMP, -- Expected exit time if provided
    entry_gate VARCHAR(100), -- Gate/entrance used
    exit_gate VARCHAR(100), -- Gate/exit used
    checked_in_by UUID REFERENCES users(id), -- Security guard or admin who checked in
    checked_out_by UUID REFERENCES users(id), -- Security guard or admin who checked out
    visitor_pass_number VARCHAR(100), -- Temporary visitor pass number
    status VARCHAR(20) DEFAULT 'inside' CHECK (status IN ('inside', 'exited', 'expired', 'cancelled')),
    is_expected BOOLEAN DEFAULT FALSE, -- Pre-registered visitor
    expected_by UUID REFERENCES users(id), -- User who pre-registered the visitor
    notes TEXT,
    visitor_photo_url VARCHAR(500), -- Photo if captured
    id_proof_url VARCHAR(500), -- ID proof document URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_visitors_society ON visitors(society_id);
CREATE INDEX idx_visitors_member ON visitors(member_id);
CREATE INDEX idx_visitors_flat ON visitors(society_id, flat_number);
CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_entry_time ON visitors(entry_time);
CREATE INDEX idx_visitors_phone ON visitors(visitor_phone);
CREATE INDEX idx_visitors_vehicle ON visitors(vehicle_number);
CREATE INDEX idx_visitors_pass_number ON visitors(visitor_pass_number);

-- =====================================================
-- 23. VISITOR_PRE_REGISTRATIONS TABLE (Pre-registered Visitors)
-- =====================================================
CREATE TABLE IF NOT EXISTS visitor_pre_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    registered_by UUID NOT NULL REFERENCES users(id), -- Member who registered
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20),
    visitor_email VARCHAR(255),
    purpose_of_visit VARCHAR(255),
    expected_entry_time TIMESTAMP NOT NULL,
    expected_exit_time TIMESTAMP,
    number_of_visitors INTEGER DEFAULT 1,
    vehicle_number VARCHAR(50),
    vehicle_type VARCHAR(50),
    visitor_id_type VARCHAR(50),
    visitor_id_number VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    visitor_id UUID REFERENCES visitors(id), -- Link to actual visitor entry when checked in
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_visitor_pre_reg_society ON visitor_pre_registrations(society_id);
CREATE INDEX idx_visitor_pre_reg_member ON visitor_pre_registrations(member_id);
CREATE INDEX idx_visitor_pre_reg_status ON visitor_pre_registrations(status);
CREATE INDEX idx_visitor_pre_reg_entry_time ON visitor_pre_registrations(expected_entry_time);

-- =====================================================
-- 24. VISITOR_LOGS TABLE (Detailed Visitor Activity Log)
-- =====================================================
CREATE TABLE IF NOT EXISTS visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('entry', 'exit', 'check_in', 'check_out', 'pass_issued', 'pass_returned', 'status_changed')),
    action_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    performed_by UUID REFERENCES users(id), -- User who performed the action
    gate_name VARCHAR(100),
    notes TEXT,
    metadata JSONB -- Store additional information
);

CREATE INDEX idx_visitor_logs_visitor ON visitor_logs(visitor_id);
CREATE INDEX idx_visitor_logs_society ON visitor_logs(society_id);
CREATE INDEX idx_visitor_logs_action ON visitor_logs(action);
CREATE INDEX idx_visitor_logs_action_time ON visitor_logs(action_time);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_societies_updated_at BEFORE UPDATE ON societies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_config_updated_at BEFORE UPDATE ON company_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_society_subscriptions_updated_at BEFORE UPDATE ON society_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_charges_updated_at BEFORE UPDATE ON maintenance_charges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_maintenance_charges_updated_at BEFORE UPDATE ON member_maintenance_charges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_bills_updated_at BEFORE UPDATE ON maintenance_bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_payments_updated_at BEFORE UPDATE ON maintenance_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON visitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitor_pre_registrations_updated_at BEFORE UPDATE ON visitor_pre_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS FOR SUBSCRIPTION CALCULATIONS
-- =====================================================

-- Function to calculate monthly subscription amount
CREATE OR REPLACE FUNCTION calculate_subscription_amount(
    p_plan_id UUID,
    p_member_count INTEGER
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_base_price DECIMAL(10,2);
    v_price_per_member DECIMAL(10,2);
    v_total_amount DECIMAL(10,2);
BEGIN
    SELECT base_price, price_per_member INTO v_base_price, v_price_per_member
    FROM subscription_plans
    WHERE id = p_plan_id AND is_active = TRUE;
    
    IF v_base_price IS NULL THEN
        RETURN 0.00;
    END IF;
    
    v_total_amount := v_base_price + (v_price_per_member * p_member_count);
    RETURN v_total_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscription when member count changes
CREATE OR REPLACE FUNCTION update_subscription_on_member_change()
RETURNS TRIGGER AS $$
DECLARE
    v_subscription_id UUID;
    v_new_amount DECIMAL(10,2);
BEGIN
    -- Get active subscription for the society
    SELECT id INTO v_subscription_id
    FROM society_subscriptions
    WHERE society_id = COALESCE(NEW.society_id, OLD.society_id)
      AND status = 'active'
    LIMIT 1;
    
    IF v_subscription_id IS NOT NULL THEN
        -- Recalculate monthly amount based on new member count
        SELECT calculate_subscription_amount(plan_id, COUNT(*))
        INTO v_new_amount
        FROM society_subscriptions ss
        JOIN members m ON m.society_id = ss.society_id
        WHERE ss.id = v_subscription_id
          AND m.status = 'active';
        
        -- Update subscription
        UPDATE society_subscriptions
        SET member_count = (SELECT COUNT(*) FROM members WHERE society_id = COALESCE(NEW.society_id, OLD.society_id) AND status = 'active'),
            monthly_amount = v_new_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_subscription_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate maintenance charge for a member
CREATE OR REPLACE FUNCTION calculate_member_maintenance(
    p_society_id UUID,
    p_member_id UUID,
    p_billing_month DATE DEFAULT CURRENT_DATE
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_total_amount DECIMAL(10,2) := 0.00;
    v_charge_record RECORD;
    v_member_record RECORD;
    v_calculated_amount DECIMAL(10,2);
BEGIN
    -- Get member details
    SELECT * INTO v_member_record
    FROM members
    WHERE id = p_member_id AND society_id = p_society_id AND status = 'active';
    
    IF v_member_record IS NULL THEN
        RETURN 0.00;
    END IF;
    
    -- Calculate based on active maintenance charges
    FOR v_charge_record IN
        SELECT * FROM maintenance_charges
        WHERE society_id = p_society_id
          AND is_active = TRUE
          AND is_recurring = TRUE
          AND effective_from <= p_billing_month
          AND (effective_until IS NULL OR effective_until >= p_billing_month)
          AND (
            applicable_to = 'all' OR
            (applicable_to = 'owners' AND v_member_record.member_type = 'owner') OR
            (applicable_to = 'tenants' AND v_member_record.member_type = 'tenant') OR
            (applicable_to = 'both')
          )
    LOOP
        CASE v_charge_record.charge_type
            WHEN 'flat_rate' THEN
                v_calculated_amount := v_charge_record.base_amount;
            WHEN 'per_sqft' THEN
                -- Assuming flat area is stored somewhere, using ownership_percentage as proxy
                v_calculated_amount := v_charge_record.base_amount + (v_charge_record.per_unit_rate * COALESCE(v_member_record.ownership_percentage, 100));
            WHEN 'per_member' THEN
                v_calculated_amount := v_charge_record.base_amount + v_charge_record.per_unit_rate;
            WHEN 'per_flat' THEN
                v_calculated_amount := v_charge_record.base_amount + v_charge_record.per_unit_rate;
            ELSE
                v_calculated_amount := v_charge_record.base_amount;
        END CASE;
        
        v_total_amount := v_total_amount + v_calculated_amount;
    END LOOP;
    
    -- Add any custom member-specific charges
    SELECT COALESCE(SUM(amount), 0) INTO v_calculated_amount
    FROM member_maintenance_charges
    WHERE member_id = p_member_id
      AND is_active = TRUE
      AND effective_from <= p_billing_month
      AND (effective_until IS NULL OR effective_until >= p_billing_month);
    
    v_total_amount := v_total_amount + v_calculated_amount;
    
    RETURN v_total_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to generate maintenance bills for a society
CREATE OR REPLACE FUNCTION generate_maintenance_bills(
    p_society_id UUID,
    p_billing_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    p_due_days INTEGER DEFAULT 15
)
RETURNS INTEGER AS $$
DECLARE
    v_member_record RECORD;
    v_bill_id UUID;
    v_bill_number VARCHAR(100);
    v_total_amount DECIMAL(10,2);
    v_due_date DATE;
    v_bills_generated INTEGER := 0;
    v_year INTEGER;
    v_month INTEGER;
BEGIN
    v_year := EXTRACT(YEAR FROM p_billing_month);
    v_month := EXTRACT(MONTH FROM p_billing_month);
    v_due_date := p_billing_month + (p_due_days || ' days')::INTERVAL;
    
    -- Check if bills already exist for this month
    IF EXISTS (
        SELECT 1 FROM maintenance_bills
        WHERE society_id = p_society_id
          AND billing_year = v_year
          AND billing_month = p_billing_month
    ) THEN
        RAISE EXCEPTION 'Bills already generated for this month';
    END IF;
    
    -- Generate bills for all active members
    FOR v_member_record IN
        SELECT * FROM members
        WHERE society_id = p_society_id
          AND status = 'active'
    LOOP
        -- Calculate total maintenance amount
        v_total_amount := calculate_member_maintenance(p_society_id, v_member_record.id, p_billing_month);
        
        IF v_total_amount > 0 THEN
            -- Generate bill number
            v_bill_number := 'BILL-' || v_year || '-' || LPAD(v_month::TEXT, 2, '0') || '-' || 
                           LPAD(v_member_record.membership_number, 8, '0');
            
            -- Create bill
            INSERT INTO maintenance_bills (
                society_id, member_id, bill_number, billing_month, billing_year,
                due_date, total_amount, pending_amount, status
            ) VALUES (
                p_society_id, v_member_record.id, v_bill_number, p_billing_month, v_year,
                v_due_date, v_total_amount, v_total_amount, 'pending'
            ) RETURNING id INTO v_bill_id;
            
            -- Add bill items from active charges
            INSERT INTO maintenance_bill_items (bill_id, charge_id, charge_name, amount)
            SELECT v_bill_id, mc.id, mc.charge_name, 
                   CASE mc.charge_type
                       WHEN 'flat_rate' THEN mc.base_amount
                       WHEN 'per_member' THEN mc.base_amount + mc.per_unit_rate
                       ELSE mc.base_amount
                   END
            FROM maintenance_charges mc
            WHERE mc.society_id = p_society_id
              AND mc.is_active = TRUE
              AND mc.is_recurring = TRUE
              AND mc.effective_from <= p_billing_month
              AND (mc.effective_until IS NULL OR mc.effective_until >= p_billing_month);
            
            v_bills_generated := v_bills_generated + 1;
        END IF;
    END LOOP;
    
    RETURN v_bills_generated;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update subscription when members are added/removed
CREATE TRIGGER trigger_update_subscription_on_member_change
    AFTER INSERT OR UPDATE OR DELETE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_on_member_change();

-- Function to log visitor activities
CREATE OR REPLACE FUNCTION log_visitor_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Log entry when visitor is created
    IF TG_OP = 'INSERT' THEN
        INSERT INTO visitor_logs (visitor_id, society_id, action, action_time, performed_by, gate_name, notes)
        VALUES (NEW.id, NEW.society_id, 'entry', NEW.entry_time, NEW.checked_in_by, NEW.entry_gate, 
                'Visitor checked in: ' || NEW.visitor_name);
    END IF;
    
    -- Log exit when visitor status changes to exited
    IF TG_OP = 'UPDATE' AND OLD.status = 'inside' AND NEW.status = 'exited' THEN
        INSERT INTO visitor_logs (visitor_id, society_id, action, action_time, performed_by, gate_name, notes)
        VALUES (NEW.id, NEW.society_id, 'exit', NEW.exit_time, NEW.checked_out_by, NEW.exit_gate,
                'Visitor checked out: ' || NEW.visitor_name);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log visitor activities
CREATE TRIGGER trigger_log_visitor_activity
    AFTER INSERT OR UPDATE ON visitors
    FOR EACH ROW
    EXECUTE FUNCTION log_visitor_activity();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, display_name, description, base_price, price_per_member, min_members, max_members, is_default, features) VALUES
('basic', 'Basic Plan', 'Basic plan for small societies', 500.00, 10.00, 1, 50, FALSE, '{"features": ["member_management", "basic_reports", "email_support"]}'),
('standard', 'Standard Plan', 'Standard plan for medium societies', 1000.00, 8.00, 51, 200, TRUE, '{"features": ["member_management", "asset_management", "maintenance_requests", "advanced_reports", "priority_support"]}'),
('premium', 'Premium Plan', 'Premium plan for large societies', 2000.00, 5.00, 201, NULL, FALSE, '{"features": ["all_features", "custom_reports", "api_access", "dedicated_support", "white_label"]}'),
('enterprise', 'Enterprise Plan', 'Enterprise plan with custom pricing', 5000.00, 3.00, 500, NULL, FALSE, '{"features": ["all_features", "custom_integrations", "dedicated_account_manager", "sla_guarantee"]}')
ON CONFLICT (plan_name) DO NOTHING;

-- Insert default system roles
INSERT INTO roles (role_name, display_name, description, hierarchy_level, is_system_role, is_active) VALUES
('superAdmin', 'Super Administrator', 'System-wide administrator with all permissions', 100, TRUE, TRUE),
('societyAdmin', 'Society Administrator', 'Administrator for a specific society', 80, TRUE, TRUE),
('secretary', 'Secretary', 'Society secretary with administrative permissions', 60, TRUE, TRUE),
('treasurer', 'Treasurer', 'Society treasurer with financial permissions', 60, TRUE, TRUE),
('committeeMember', 'Committee Member', 'Member of the society committee', 40, TRUE, TRUE),
('member', 'Member', 'Regular society member', 20, TRUE, TRUE),
('tenant', 'Tenant', 'Tenant member with limited permissions', 10, TRUE, TRUE)
ON CONFLICT (role_name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (permission_code, permission_name, display_name, description, resource, action) VALUES
-- User Management
('USR_CREATE', 'users.create', 'Create Users', 'Create new user accounts', 'users', 'create'),
('USR_READ', 'users.read', 'View Users', 'View user information', 'users', 'read'),
('USR_UPDATE', 'users.update', 'Update Users', 'Update user information', 'users', 'update'),
('USR_DELETE', 'users.delete', 'Delete Users', 'Delete user accounts', 'users', 'delete'),

-- Society Management
('SOC_CREATE', 'societies.create', 'Create Societies', 'Create new societies', 'societies', 'create'),
('SOC_READ', 'societies.read', 'View Societies', 'View society information', 'societies', 'read'),
('SOC_UPDATE', 'societies.update', 'Update Societies', 'Update society information', 'societies', 'update'),
('SOC_DELETE', 'societies.delete', 'Delete Societies', 'Delete societies', 'societies', 'delete'),

-- Member Management
('MEM_CREATE', 'members.create', 'Create Members', 'Add new members to society', 'members', 'create'),
('MEM_READ', 'members.read', 'View Members', 'View member information', 'members', 'read'),
('MEM_UPDATE', 'members.update', 'Update Members', 'Update member information', 'members', 'update'),
('MEM_DELETE', 'members.delete', 'Delete Members', 'Remove members from society', 'members', 'delete'),

-- Role Management
('ROL_CREATE', 'roles.create', 'Create Roles', 'Create new roles', 'roles', 'create'),
('ROL_READ', 'roles.read', 'View Roles', 'View role information', 'roles', 'read'),
('ROL_UPDATE', 'roles.update', 'Update Roles', 'Update role information', 'roles', 'update'),
('ROL_DELETE', 'roles.delete', 'Delete Roles', 'Delete roles', 'roles', 'delete'),
('ROL_ASSIGN', 'roles.assign', 'Assign Roles', 'Assign roles to users', 'roles', 'assign'),

-- Permission Management
('PERM_READ', 'permissions.read', 'View Permissions', 'View permission information', 'permissions', 'read'),
('PERM_ASSIGN', 'permissions.assign', 'Assign Permissions', 'Assign permissions to roles', 'permissions', 'assign'),

-- Asset Management
('AST_CREATE', 'assets.create', 'Create Assets', 'Add new assets', 'assets', 'create'),
('AST_READ', 'assets.read', 'View Assets', 'View asset information', 'assets', 'read'),
('AST_UPDATE', 'assets.update', 'Update Assets', 'Update asset information', 'assets', 'update'),
('AST_DELETE', 'assets.delete', 'Delete Assets', 'Remove assets', 'assets', 'delete'),

-- Maintenance Management
('MNT_CREATE', 'maintenance.create', 'Create Maintenance Requests', 'Create maintenance requests', 'maintenance', 'create'),
('MNT_READ', 'maintenance.read', 'View Maintenance Requests', 'View maintenance requests', 'maintenance', 'read'),
('MNT_UPDATE', 'maintenance.update', 'Update Maintenance Requests', 'Update maintenance requests', 'maintenance', 'update'),
('MNT_DELETE', 'maintenance.delete', 'Delete Maintenance Requests', 'Delete maintenance requests', 'maintenance', 'delete'),
('MNT_APPROVE', 'maintenance.approve', 'Approve Maintenance Requests', 'Approve maintenance requests', 'maintenance', 'approve'),

-- Configuration Management
('CFG_READ', 'config.read', 'View Configuration', 'View system configuration', 'config', 'read'),
('CFG_UPDATE', 'config.update', 'Update Configuration', 'Update system configuration', 'config', 'update'),

-- Financial Management
('FIN_READ', 'financials.read', 'View Financials', 'View financial information', 'financials', 'read'),
('FIN_UPDATE', 'financials.update', 'Update Financials', 'Update financial information', 'financials', 'update'),

-- Reports
('RPT_READ', 'reports.read', 'View Reports', 'View and generate reports', 'reports', 'read')
ON CONFLICT (permission_code) DO NOTHING;

-- Assign all permissions to superAdmin role
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'superAdmin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Add subscription-related permissions
INSERT INTO permissions (permission_code, permission_name, display_name, description, resource, action) VALUES
('SUB_CREATE', 'subscriptions.create', 'Create Subscriptions', 'Create new subscriptions', 'subscriptions', 'create'),
('SUB_READ', 'subscriptions.read', 'View Subscriptions', 'View subscription information', 'subscriptions', 'read'),
('SUB_UPDATE', 'subscriptions.update', 'Update Subscriptions', 'Update subscription details', 'subscriptions', 'update'),
('SUB_CANCEL', 'subscriptions.cancel', 'Cancel Subscriptions', 'Cancel subscriptions', 'subscriptions', 'cancel'),
('PAY_READ', 'payments.read', 'View Payments', 'View payment information', 'payments', 'read'),
('PAY_PROCESS', 'payments.process', 'Process Payments', 'Process payment transactions', 'payments', 'process'),
('PLN_READ', 'plans.read', 'View Plans', 'View subscription plans', 'plans', 'read'),
('PLN_UPDATE', 'plans.update', 'Update Plans', 'Update subscription plans', 'plans', 'update'),

-- Maintenance Charges Management (Society Admin)
('MCH_CREATE', 'maintenance_charges.create', 'Create Maintenance Charges', 'Create maintenance charge configurations', 'maintenance_charges', 'create'),
('MCH_READ', 'maintenance_charges.read', 'View Maintenance Charges', 'View maintenance charge configurations', 'maintenance_charges', 'read'),
('MCH_UPDATE', 'maintenance_charges.update', 'Update Maintenance Charges', 'Update maintenance charge configurations', 'maintenance_charges', 'update'),
('MCH_DELETE', 'maintenance_charges.delete', 'Delete Maintenance Charges', 'Delete maintenance charge configurations', 'maintenance_charges', 'delete'),
('MCH_GENERATE', 'maintenance_charges.generate', 'Generate Maintenance Bills', 'Generate monthly maintenance bills', 'maintenance_charges', 'generate'),
('MBILL_READ', 'maintenance_bills.read', 'View Maintenance Bills', 'View maintenance bills', 'maintenance_bills', 'read'),
('MBILL_UPDATE', 'maintenance_bills.update', 'Update Maintenance Bills', 'Update maintenance bills', 'maintenance_bills', 'update'),
('MPAY_PROCESS', 'maintenance_payments.process', 'Process Maintenance Payments', 'Process maintenance bill payments', 'maintenance_payments', 'process'),

-- Visitor Management
('VIS_CREATE', 'visitors.create', 'Create Visitor Entry', 'Register new visitor entry', 'visitors', 'create'),
('VIS_READ', 'visitors.read', 'View Visitors', 'View visitor information and logs', 'visitors', 'read'),
('VIS_UPDATE', 'visitors.update', 'Update Visitor Entry', 'Update visitor information', 'visitors', 'update'),
('VIS_DELETE', 'visitors.delete', 'Delete Visitor Entry', 'Delete visitor records', 'visitors', 'delete'),
('VIS_CHECK_IN', 'visitors.check_in', 'Check In Visitor', 'Check in visitor at gate', 'visitors', 'check_in'),
('VIS_CHECK_OUT', 'visitors.check_out', 'Check Out Visitor', 'Check out visitor at gate', 'visitors', 'check_out'),
('VIS_PRE_REGISTER', 'visitors.pre_register', 'Pre-register Visitor', 'Pre-register expected visitors', 'visitors', 'pre_register'),
('VIS_APPROVE', 'visitors.approve', 'Approve Visitor', 'Approve pre-registered visitors', 'visitors', 'approve')
ON CONFLICT (permission_code) DO NOTHING;

-- Assign subscription permissions to superAdmin
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'superAdmin' 
  AND (p.permission_code LIKE 'SUB_%' 
   OR p.permission_code LIKE 'PAY_%'
   OR p.permission_code LIKE 'PLN_%')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign maintenance charge permissions to societyAdmin
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'societyAdmin' 
  AND (p.permission_code LIKE 'MCH_%' 
   OR p.permission_code LIKE 'MBILL_%'
   OR p.permission_code LIKE 'MPAY_%')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign maintenance charge permissions to secretary
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'secretary' 
  AND (p.permission_code LIKE 'MCH_READ' 
   OR p.permission_code LIKE 'MCH_GENERATE'
   OR p.permission_code LIKE 'MBILL_%'
   OR p.permission_code LIKE 'MPAY_%')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign maintenance charge permissions to treasurer
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'treasurer' 
  AND (p.permission_code LIKE 'MCH_READ' 
   OR p.permission_code LIKE 'MBILL_READ'
   OR p.permission_code LIKE 'MPAY_%')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign visitor management permissions to societyAdmin
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'societyAdmin' 
  AND p.permission_code LIKE 'VIS_%'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign visitor check-in/out permissions to security role (if exists) or committee members
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name IN ('committeeMember', 'secretary')
  AND p.permission_code IN ('VIS_CREATE', 'VIS_READ', 'VIS_CHECK_IN', 'VIS_CHECK_OUT', 'VIS_PRE_REGISTER')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign visitor read permissions to members
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'member' 
  AND p.permission_code IN ('VIS_READ', 'VIS_PRE_REGISTER')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE societies IS 'Stores society/housing society information';
COMMENT ON TABLE roles IS 'Stores role definitions with hierarchy levels';
COMMENT ON TABLE permissions IS 'Stores permission definitions for resources and actions';
COMMENT ON TABLE role_permissions IS 'Many-to-many relationship between roles and permissions';
COMMENT ON TABLE user_roles IS 'Many-to-many relationship between users and roles, can be society-specific';
COMMENT ON TABLE members IS 'Stores society member information';
COMMENT ON TABLE assets IS 'Stores society assets and their maintenance information';
COMMENT ON TABLE company_config IS 'Stores configuration settings for societies or globally';
COMMENT ON TABLE maintenance_requests IS 'Stores maintenance and repair requests';
COMMENT ON TABLE audit_logs IS 'Stores audit trail of all system changes';
COMMENT ON TABLE notifications IS 'Stores user notifications';
COMMENT ON TABLE subscription_plans IS 'Stores subscription plan definitions with member-based pricing';
COMMENT ON TABLE society_subscriptions IS 'Stores active subscriptions for societies with monthly billing';
COMMENT ON TABLE payments IS 'Stores payment transactions for subscriptions';
COMMENT ON TABLE payment_methods IS 'Stores payment methods for societies';
COMMENT ON TABLE maintenance_charges IS 'Stores configurable maintenance charges that society admin can set';
COMMENT ON TABLE member_maintenance_charges IS 'Stores member-specific maintenance charges';
COMMENT ON TABLE maintenance_bills IS 'Stores monthly maintenance bills generated for members';
COMMENT ON TABLE maintenance_bill_items IS 'Stores line items for each maintenance bill';
COMMENT ON TABLE maintenance_payments IS 'Stores payment records for maintenance bills';
COMMENT ON TABLE visitors IS 'Stores visitor entry/exit records with check-in/check-out tracking';
COMMENT ON TABLE visitor_pre_registrations IS 'Stores pre-registered visitor information for approval';
COMMENT ON TABLE visitor_logs IS 'Stores detailed activity log for all visitor actions';

