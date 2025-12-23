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
    updated_by UUID REFERENCES users(id),
    CONSTRAINT unique_society_active_subscription UNIQUE (society_id, status) WHERE status = 'active'
);

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

-- Trigger to update subscription when members are added/removed
CREATE TRIGGER trigger_update_subscription_on_member_change
    AFTER INSERT OR UPDATE OR DELETE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_on_member_change();

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
INSERT INTO permissions (permission_name, display_name, description, resource, action) VALUES
-- User Management
('users.create', 'Create Users', 'Create new user accounts', 'users', 'create'),
('users.read', 'View Users', 'View user information', 'users', 'read'),
('users.update', 'Update Users', 'Update user information', 'users', 'update'),
('users.delete', 'Delete Users', 'Delete user accounts', 'users', 'delete'),

-- Society Management
('societies.create', 'Create Societies', 'Create new societies', 'societies', 'create'),
('societies.read', 'View Societies', 'View society information', 'societies', 'read'),
('societies.update', 'Update Societies', 'Update society information', 'societies', 'update'),
('societies.delete', 'Delete Societies', 'Delete societies', 'societies', 'delete'),

-- Member Management
('members.create', 'Create Members', 'Add new members to society', 'members', 'create'),
('members.read', 'View Members', 'View member information', 'members', 'read'),
('members.update', 'Update Members', 'Update member information', 'members', 'update'),
('members.delete', 'Delete Members', 'Remove members from society', 'members', 'delete'),

-- Role Management
('roles.create', 'Create Roles', 'Create new roles', 'roles', 'create'),
('roles.read', 'View Roles', 'View role information', 'roles', 'read'),
('roles.update', 'Update Roles', 'Update role information', 'roles', 'update'),
('roles.delete', 'Delete Roles', 'Delete roles', 'roles', 'delete'),
('roles.assign', 'Assign Roles', 'Assign roles to users', 'roles', 'assign'),

-- Permission Management
('permissions.read', 'View Permissions', 'View permission information', 'permissions', 'read'),
('permissions.assign', 'Assign Permissions', 'Assign permissions to roles', 'permissions', 'assign'),

-- Asset Management
('assets.create', 'Create Assets', 'Add new assets', 'assets', 'create'),
('assets.read', 'View Assets', 'View asset information', 'assets', 'read'),
('assets.update', 'Update Assets', 'Update asset information', 'assets', 'update'),
('assets.delete', 'Delete Assets', 'Remove assets', 'assets', 'delete'),

-- Maintenance Management
('maintenance.create', 'Create Maintenance Requests', 'Create maintenance requests', 'maintenance', 'create'),
('maintenance.read', 'View Maintenance Requests', 'View maintenance requests', 'maintenance', 'read'),
('maintenance.update', 'Update Maintenance Requests', 'Update maintenance requests', 'maintenance', 'update'),
('maintenance.delete', 'Delete Maintenance Requests', 'Delete maintenance requests', 'maintenance', 'delete'),
('maintenance.approve', 'Approve Maintenance Requests', 'Approve maintenance requests', 'maintenance', 'approve'),

-- Configuration Management
('config.read', 'View Configuration', 'View system configuration', 'config', 'read'),
('config.update', 'Update Configuration', 'Update system configuration', 'config', 'update'),

-- Financial Management
('financials.read', 'View Financials', 'View financial information', 'financials', 'read'),
('financials.update', 'Update Financials', 'Update financial information', 'financials', 'update'),

-- Reports
('reports.read', 'View Reports', 'View and generate reports', 'reports', 'read')
ON CONFLICT (permission_name) DO NOTHING;

-- Assign all permissions to superAdmin role
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'superAdmin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Add subscription-related permissions
INSERT INTO permissions (permission_name, display_name, description, resource, action) VALUES
('subscriptions.create', 'Create Subscriptions', 'Create new subscriptions', 'subscriptions', 'create'),
('subscriptions.read', 'View Subscriptions', 'View subscription information', 'subscriptions', 'read'),
('subscriptions.update', 'Update Subscriptions', 'Update subscription details', 'subscriptions', 'update'),
('subscriptions.cancel', 'Cancel Subscriptions', 'Cancel subscriptions', 'subscriptions', 'cancel'),
('payments.read', 'View Payments', 'View payment information', 'payments', 'read'),
('payments.process', 'Process Payments', 'Process payment transactions', 'payments', 'process'),
('plans.read', 'View Plans', 'View subscription plans', 'plans', 'read'),
('plans.update', 'Update Plans', 'Update subscription plans', 'plans', 'update')
ON CONFLICT (permission_name) DO NOTHING;

-- Assign subscription permissions to superAdmin
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'superAdmin' 
  AND p.permission_name LIKE 'subscriptions%' 
   OR p.permission_name LIKE 'payments%'
   OR p.permission_name LIKE 'plans%'
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

