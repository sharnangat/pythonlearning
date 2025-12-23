#!/usr/bin/env node

/**
 * Insert Mock Data Script
 * Generates and inserts realistic mock data into all tables
 */

const { Client } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'soc_db'
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Mock data generators
const firstNames = ['Raj', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Kavita', 'Suresh', 'Meera', 'Arjun', 'Divya', 'Karan', 'Pooja', 'Nikhil'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Desai', 'Mehta', 'Joshi', 'Reddy', 'Iyer', 'Nair', 'Gupta', 'Malhotra', 'Verma', 'Agarwal', 'Kapoor'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Telangana'];
const occupations = ['Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Lawyer', 'Accountant', 'Manager', 'Consultant', 'Designer', 'Developer'];
const genders = ['male', 'female', 'other', 'prefer_not_to_say'];
const memberTypes = ['owner', 'tenant', 'family_member'];
const buildingNames = ['Tower A', 'Tower B', 'Wing A', 'Wing B', 'Block A', 'Block B', 'Building 1', 'Building 2'];
const wings = ['A', 'B', 'C', 'D', null];
const assetTypes = ['building', 'vehicle', 'equipment', 'furniture', 'land', 'other'];
const assetNames = ['Generator', 'Water Pump', 'Elevator', 'Security Camera System', 'Gym Equipment', 'Swimming Pool', 'Garden Equipment', 'Parking Gate', 'Intercom System', 'Fire Safety Equipment'];
const requestTypes = ['repair', 'installation', 'inspection', 'cleaning', 'other'];
const priorities = ['low', 'medium', 'high', 'urgent'];
const statuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rejected'];
const paymentMethods = ['cash', 'cheque', 'online', 'upi', 'bank_transfer', 'neft', 'rtgs'];
const visitorPurposes = ['meeting', 'delivery', 'service', 'guest', 'other'];
const vehicleTypes = ['car', 'bike', 'auto', 'truck', 'other'];

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPhone() {
    return `9${randomInt(1000000000, 9999999999)}`;
}

function randomEmail(firstName, lastName) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@${randomElement(domains)}`;
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function insertMockData() {
    const client = new Client(dbConfig);
    
    try {
        await client.connect();
        log('\n✓ Connected to database', 'green');
        
        // Check if data already exists
        const existingDataCheck = await client.query('SELECT COUNT(*) as count FROM users');
        if (parseInt(existingDataCheck.rows[0].count) > 0) {
            log('\n⚠ Data already exists in database. Clearing existing data...', 'yellow');
            // Delete in reverse order of dependencies
            await client.query('DELETE FROM visitor_logs');
            await client.query('DELETE FROM visitor_pre_registrations');
            await client.query('DELETE FROM visitors');
            await client.query('DELETE FROM maintenance_payments');
            await client.query('DELETE FROM maintenance_bill_items');
            await client.query('DELETE FROM maintenance_bills');
            await client.query('DELETE FROM member_maintenance_charges');
            await client.query('DELETE FROM maintenance_charges');
            await client.query('DELETE FROM payment_methods');
            await client.query('DELETE FROM payments');
            await client.query('DELETE FROM society_subscriptions');
            await client.query('DELETE FROM notifications');
            await client.query('DELETE FROM audit_logs');
            await client.query('DELETE FROM maintenance_requests');
            await client.query('DELETE FROM company_config');
            await client.query('DELETE FROM assets');
            await client.query('DELETE FROM members');
            await client.query('DELETE FROM user_roles');
            await client.query('DELETE FROM societies');
            await client.query('DELETE FROM users WHERE id NOT IN (SELECT created_by FROM roles WHERE created_by IS NOT NULL LIMIT 1)');
            log('✓ Cleared existing data', 'green');
        }
        
        // Store IDs for relationships
        const userIds = [];
        const societyIds = [];
        const roleIds = [];
        const memberIds = [];
        const assetIds = [];
        const maintenanceChargeIds = [];
        const maintenanceBillIds = [];
        const subscriptionPlanIds = [];
        const societySubscriptionIds = [];
        const visitorIds = [];
        
        // 1. Insert Users
        log('\n📝 Inserting users...', 'yellow');
        const passwordHash = await hashPassword('password123');
        const userCount = 20;
        
        for (let i = 0; i < userCount; i++) {
            const firstName = randomElement(firstNames);
            const lastName = randomElement(lastNames);
            const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
            const email = randomEmail(firstName, lastName);
            const phone = randomPhone();
            const status = i < 15 ? 'active' : randomElement(['inactive', 'pending_verification']);
            
            const result = await client.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified, phone_verified, last_login)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id
            `, [
                username,
                email,
                passwordHash,
                firstName,
                lastName,
                phone,
                status,
                i < 15,
                i < 15,
                i < 10 ? randomDate(new Date(2024, 0, 1), new Date()) : null
            ]);
            userIds.push(result.rows[0].id);
        }
        log(`✓ Inserted ${userCount} users`, 'green');
        
        // 2. Insert Societies
        log('\n📝 Inserting societies...', 'yellow');
        const societyNames = [
            'Green Valley Apartments',
            'Sunshine Residency',
            'Royal Gardens',
            'Elite Heights',
            'Prestige Towers',
            'Harmony Society',
            'Luxury Homes',
            'Modern Complex'
        ];
        
        for (let i = 0; i < societyNames.length; i++) {
            const city = randomElement(cities);
            const state = randomElement(states);
            const totalFlats = randomInt(50, 200);
            
            const result = await client.query(`
                INSERT INTO societies (society_name, registration_number, address, city, state, country, pincode, phone, email, website, registration_date, status, total_flats, description, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                ON CONFLICT (registration_number) DO NOTHING
                RETURNING id
            `, [
                societyNames[i],
                `REG${String(i + 1).padStart(6, '0')}`,
                `${randomInt(1, 999)} Main Street, ${city}`,
                city,
                state,
                'India',
                randomInt(400000, 499999).toString(),
                randomPhone(),
                `info@${societyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
                `www.${societyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
                randomDate(new Date(2015, 0, 1), new Date(2020, 11, 31)),
                'active',
                totalFlats,
                `Beautiful ${totalFlats}-unit residential complex in ${city}`,
                userIds[0],
                userIds[0]
            ]);
            societyIds.push(result.rows[0].id);
        }
        log(`✓ Inserted ${societyIds.length} societies`, 'green');
        
        // 3. Get existing roles
        const rolesResult = await client.query('SELECT id, role_name FROM roles');
        const roleMap = {};
        rolesResult.rows.forEach(row => {
            roleMap[row.role_name] = row.id;
            roleIds.push(row.id);
        });
        
        // 4. Insert User Roles
        log('\n📝 Inserting user roles...', 'yellow');
        let userRoleCount = 0;
        // Super admin
        await client.query(`
            INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
            VALUES ($1, $2, NULL, TRUE, $1)
            ON CONFLICT DO NOTHING
        `, [userIds[0], roleMap['superAdmin']]);
        userRoleCount++;
        
        // Society admins
        for (let i = 0; i < societyIds.length; i++) {
            await client.query(`
                INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
                VALUES ($1, $2, $3, TRUE, $4)
                ON CONFLICT DO NOTHING
            `, [userIds[i + 1], roleMap['societyAdmin'], societyIds[i], userIds[0]]);
            userRoleCount++;
        }
        
        // Members
        for (let i = 5; i < userIds.length; i++) {
            const societyId = randomElement(societyIds);
            await client.query(`
                INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
                VALUES ($1, $2, $3, TRUE, $4)
                ON CONFLICT DO NOTHING
            `, [userIds[i], roleMap['member'], societyId, userIds[0]]);
            userRoleCount++;
        }
        log(`✓ Inserted ${userRoleCount} user roles`, 'green');
        
        // 5. Insert Members
        log('\n📝 Inserting members...', 'yellow');
        let membershipCounter = 1;
        
        for (const societyId of societyIds) {
            const membersPerSociety = randomInt(15, 30);
            for (let i = 0; i < membersPerSociety; i++) {
                const firstName = randomElement(firstNames);
                const lastName = randomElement(lastNames);
                const flatNumber = `${randomInt(1, 20)}${randomElement(['A', 'B', 'C', ''])}`;
                const floorNumber = randomInt(1, 15);
                const buildingName = randomElement(buildingNames);
                const wing = randomElement(wings);
                const memberType = randomElement(memberTypes);
                const isPrimary = i === 0;
                
                const result = await client.query(`
                    INSERT INTO members (society_id, membership_number, user_id, first_name, last_name, email, phone, alternate_phone, flat_number, floor_number, building_name, wing, address, city, state, pincode, date_of_birth, gender, occupation, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, member_type, ownership_percentage, joining_date, status, is_primary_member, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
                    RETURNING id
                `, [
                    societyId,
                    `MEM${String(membershipCounter++).padStart(6, '0')}`,
                    i < 5 ? userIds[randomInt(5, userIds.length - 1)] : null,
                    firstName,
                    lastName,
                    randomEmail(firstName, lastName),
                    randomPhone(),
                    Math.random() > 0.5 ? randomPhone() : null,
                    flatNumber,
                    floorNumber,
                    buildingName,
                    wing,
                    `Flat ${flatNumber}, ${buildingName}`,
                    randomElement(cities),
                    randomElement(states),
                    randomInt(400000, 499999).toString(),
                    randomDate(new Date(1970, 0, 1), new Date(2000, 11, 31)),
                    randomElement(genders),
                    randomElement(occupations),
                    `${randomElement(firstNames)} ${randomElement(lastNames)}`,
                    randomPhone(),
                    randomElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
                    memberType,
                    memberType === 'owner' ? 100.00 : randomInt(0, 100),
                    randomDate(new Date(2020, 0, 1), new Date(2023, 11, 31)),
                    i < membersPerSociety - 2 ? 'active' : randomElement(['active', 'inactive']),
                    isPrimary,
                    userIds[0],
                    userIds[0]
                ]);
                memberIds.push(result.rows[0].id);
            }
        }
        log(`✓ Inserted ${memberIds.length} members`, 'green');
        
        // 6. Insert Assets
        log('\n📝 Inserting assets...', 'yellow');
        for (const societyId of societyIds) {
            const assetsPerSociety = randomInt(5, 10);
            for (let i = 0; i < assetsPerSociety; i++) {
                const assetType = randomElement(assetTypes);
                const assetName = randomElement(assetNames);
                const purchaseDate = randomDate(new Date(2018, 0, 1), new Date(2023, 11, 31));
                const purchaseCost = randomInt(50000, 500000);
                const currentValue = purchaseCost * randomInt(50, 90) / 100;
                
                const result = await client.query(`
                    INSERT INTO assets (society_id, asset_name, asset_type, asset_code, description, location, purchase_date, purchase_cost, current_value, depreciation_rate, vendor_name, warranty_expiry, status, condition_status, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                    RETURNING id
                `, [
                    societyId,
                    assetName,
                    assetType,
                    `AST${societyId.toString().substring(0, 8)}${String(i + 1).padStart(3, '0')}`,
                    `${assetName} for ${assetType}`,
                    randomElement(['Ground Floor', 'Basement', 'Rooftop', 'Parking Area', 'Common Area']),
                    purchaseDate,
                    purchaseCost,
                    currentValue,
                    randomInt(5, 15),
                    `${randomElement(['ABC', 'XYZ', 'Tech', 'Pro'])} ${randomElement(['Corp', 'Ltd', 'Inc'])}`,
                    new Date(purchaseDate.getTime() + 365 * 24 * 60 * 60 * 1000),
                    randomElement(['active', 'active', 'active', 'under_maintenance']),
                    randomElement(['excellent', 'good', 'fair', 'good']),
                    userIds[0],
                    userIds[0]
                ]);
                assetIds.push(result.rows[0].id);
            }
        }
        log(`✓ Inserted ${assetIds.length} assets`, 'green');
        
        // 7. Insert Company Config
        log('\n📝 Inserting company config...', 'yellow');
        const configs = [
            { key: 'maintenance_due_days', value: '15', type: 'number', category: 'financial' },
            { key: 'late_fee_percentage', value: '2', type: 'number', category: 'financial' },
            { key: 'visitor_entry_time_limit', value: '22:00', type: 'string', category: 'security' },
            { key: 'enable_email_notifications', value: 'true', type: 'boolean', category: 'communication' },
            { key: 'enable_sms_notifications', value: 'true', type: 'boolean', category: 'communication' }
        ];
        
        for (const societyId of societyIds) {
            for (const config of configs) {
                await client.query(`
                    INSERT INTO company_config (society_id, config_key, config_value, config_type, description, category, is_public, is_editable, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT DO NOTHING
                `, [
                    societyId,
                    config.key,
                    config.value,
                    config.type,
                    `Configuration for ${config.key}`,
                    config.category,
                    config.category === 'communication',
                    true,
                    userIds[0],
                    userIds[0]
                ]);
            }
        }
        log(`✓ Inserted company configs for ${societyIds.length} societies`, 'green');
        
        // 8. Insert Maintenance Requests
        log('\n📝 Inserting maintenance requests...', 'yellow');
        let requestCount = 0;
        for (const societyId of societyIds) {
            const requestsPerSociety = randomInt(5, 15);
            // Get members for this society
            const membersResult = await client.query('SELECT id FROM members WHERE society_id = $1', [societyId]);
            const societyMembers = membersResult.rows.map(row => row.id);
            
            for (let i = 0; i < requestsPerSociety; i++) {
                await client.query(`
                    INSERT INTO maintenance_requests (society_id, member_id, requested_by, request_type, title, description, location, priority, status, assigned_to, estimated_cost, actual_cost, completion_date, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                `, [
                    societyId,
                    randomElement(societyMembers),
                    userIds[randomInt(1, userIds.length - 1)],
                    randomElement(requestTypes),
                    `${randomElement(['Repair', 'Install', 'Inspect', 'Clean'])} ${randomElement(['Water', 'Electric', 'Plumbing', 'Elevator', 'Security'])}`,
                    `Request for ${randomElement(['urgent', 'routine', 'scheduled'])} maintenance`,
                    `Flat ${randomInt(1, 20)}${randomElement(['A', 'B', 'C', ''])}`,
                    randomElement(priorities),
                    randomElement(statuses),
                    randomElement([userIds[randomInt(1, 5)], null]),
                    randomInt(500, 5000),
                    Math.random() > 0.5 ? randomInt(500, 5000) : null,
                    Math.random() > 0.6 ? randomDate(new Date(2024, 0, 1), new Date()) : null,
                    userIds[randomInt(1, userIds.length - 1)],
                    userIds[randomInt(1, userIds.length - 1)]
                ]);
                requestCount++;
            }
        }
        log(`✓ Inserted ${requestCount} maintenance requests`, 'green');
        
        // 9. Insert Audit Logs
        log('\n📝 Inserting audit logs...', 'yellow');
        const auditActions = ['create', 'update', 'delete', 'login', 'logout'];
        const resourceTypes = ['user', 'member', 'society', 'role', 'asset', 'maintenance_request'];
        
        for (let i = 0; i < 50; i++) {
            await client.query(`
                INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent, description, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [
                randomElement(userIds),
                randomElement(auditActions),
                randomElement(resourceTypes),
                randomElement([...userIds, ...societyIds, ...memberIds]),
                Math.random() > 0.5 ? { old: 'value' } : null,
                Math.random() > 0.5 ? { new: 'value' } : null,
                `192.168.1.${randomInt(1, 255)}`,
                randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                `${randomElement(auditActions)} ${randomElement(resourceTypes)}`,
                randomDate(new Date(2024, 0, 1), new Date())
            ]);
        }
        log(`✓ Inserted 50 audit logs`, 'green');
        
        // 10. Insert Notifications
        log('\n📝 Inserting notifications...', 'yellow');
        const notificationTypes = ['maintenance', 'payment', 'meeting', 'announcement', 'reminder'];
        
        for (let i = 0; i < 100; i++) {
            await client.query(`
                INSERT INTO notifications (user_id, society_id, notification_type, title, message, is_read, read_at, priority, expires_at, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [
                randomElement(userIds),
                randomElement([...societyIds, null]),
                randomElement(notificationTypes),
                `${randomElement(['New', 'Reminder', 'Update', 'Important'])} ${randomElement(['Maintenance', 'Payment', 'Meeting', 'Notice'])}`,
                `This is a notification about ${randomElement(notificationTypes)}`,
                Math.random() > 0.5,
                Math.random() > 0.5 ? randomDate(new Date(2024, 0, 1), new Date()) : null,
                randomElement(['low', 'normal', 'high', 'urgent']),
                Math.random() > 0.7 ? randomDate(new Date(), new Date(2025, 11, 31)) : null,
                randomDate(new Date(2024, 0, 1), new Date())
            ]);
        }
        log(`✓ Inserted 100 notifications`, 'green');
        
        // 11. Get Subscription Plans
        const plansResult = await client.query('SELECT id FROM subscription_plans ORDER BY base_price');
        plansResult.rows.forEach(row => subscriptionPlanIds.push(row.id));
        
        // 12. Insert Society Subscriptions
        log('\n📝 Inserting society subscriptions...', 'yellow');
        for (let i = 0; i < societyIds.length; i++) {
            const planId = randomElement(subscriptionPlanIds);
            const memberCount = memberIds.filter((_, idx) => {
                const memberSocietyIdx = Math.floor(idx / 20);
                return i === memberSocietyIdx;
            }).length;
            
            const billingStart = randomDate(new Date(2024, 0, 1), new Date());
            const billingEnd = new Date(billingStart);
            billingEnd.setMonth(billingEnd.getMonth() + 1);
            const nextBilling = new Date(billingEnd);
            
            const result = await client.query(`
                INSERT INTO society_subscriptions (society_id, plan_id, member_count, monthly_amount, billing_cycle_start, billing_cycle_end, next_billing_date, status, auto_renew, subscription_start_date, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id
            `, [
                societyIds[i],
                planId,
                memberCount,
                randomInt(1000, 5000),
                billingStart,
                billingEnd,
                nextBilling,
                'active',
                true,
                billingStart,
                userIds[0],
                userIds[0]
            ]);
            societySubscriptionIds.push(result.rows[0].id);
        }
        log(`✓ Inserted ${societySubscriptionIds.length} society subscriptions`, 'green');
        
        // 13. Insert Payments
        log('\n📝 Inserting payments...', 'yellow');
        for (let i = 0; i < societySubscriptionIds.length; i++) {
            const subscriptionId = societySubscriptionIds[i];
            const societyId = societyIds[i];
            const paymentsCount = randomInt(3, 6);
            
            for (let j = 0; j < paymentsCount; j++) {
                const amount = randomInt(1000, 5000);
                const billingStart = new Date(2024, j, 1);
                const billingEnd = new Date(2024, j + 1, 0);
                
                await client.query(`
                    INSERT INTO payments (subscription_id, society_id, amount, currency, payment_type, payment_status, payment_method, payment_gateway, transaction_id, invoice_number, billing_period_start, billing_period_end, member_count, base_amount, member_amount, total_amount, paid_at, due_date, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                `, [
                    subscriptionId,
                    societyId,
                    amount,
                    'INR',
                    randomElement(['subscription', 'renewal']),
                    randomElement(['completed', 'completed', 'completed', 'pending', 'failed']),
                    randomElement(['online', 'upi', 'bank_transfer']),
                    randomElement(['Razorpay', 'Stripe', 'PayU']),
                    `TXN${randomInt(100000, 999999)}`,
                    `INV${randomInt(100000, 999999)}`,
                    billingStart,
                    billingEnd,
                    randomInt(15, 30),
                    amount * 0.7,
                    amount * 0.3,
                    amount,
                    Math.random() > 0.3 ? randomDate(billingStart, new Date()) : null,
                    new Date(billingEnd.getTime() + 15 * 24 * 60 * 60 * 1000),
                    userIds[0],
                    userIds[0]
                ]);
            }
        }
        log(`✓ Inserted payments`, 'green');
        
        // 14. Insert Payment Methods
        log('\n📝 Inserting payment methods...', 'yellow');
        for (const societyId of societyIds) {
            await client.query(`
                INSERT INTO payment_methods (society_id, payment_type, provider, account_holder_name, account_number_last4, is_default, is_active, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
                societyId,
                randomElement(['bank_account', 'upi', 'credit_card']),
                randomElement(['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank']),
                `Society ${societyId.toString().substring(0, 8)}`,
                randomInt(1000, 9999).toString(),
                true,
                true,
                userIds[0],
                userIds[0]
            ]);
        }
        log(`✓ Inserted payment methods for ${societyIds.length} societies`, 'green');
        
        // 15. Insert Maintenance Charges
        log('\n📝 Inserting maintenance charges...', 'yellow');
        const chargeNames = ['Monthly Maintenance', 'Water Charges', 'Parking Charges', 'Gym Charges', 'Swimming Pool Charges'];
        
        for (const societyId of societyIds) {
            for (let i = 0; i < chargeNames.length; i++) {
                const chargeName = chargeNames[i];
                const result = await client.query(`
                    INSERT INTO maintenance_charges (society_id, charge_name, charge_type, base_amount, per_unit_rate, unit_type, is_active, is_recurring, applicable_to, effective_from, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING id
                `, [
                    societyId,
                    chargeName,
                    randomElement(['flat_rate', 'per_sqft', 'per_member', 'per_flat']),
                    randomInt(500, 2000),
                    randomInt(10, 50),
                    randomElement(['sqft', 'member', 'flat']),
                    true,
                    true,
                    randomElement(['all', 'owners', 'tenants', 'both']),
                    randomDate(new Date(2023, 0, 1), new Date()),
                    userIds[0],
                    userIds[0]
                ]);
                maintenanceChargeIds.push(result.rows[0].id);
            }
        }
        log(`✓ Inserted ${maintenanceChargeIds.length} maintenance charges`, 'green');
        
        // 16. Insert Member Maintenance Charges
        log('\n📝 Inserting member maintenance charges...', 'yellow');
        // Get member society mapping
        const memberSocietyMap = {};
        for (let i = 0; i < memberIds.length; i++) {
            const memberResult = await client.query('SELECT society_id FROM members WHERE id = $1', [memberIds[i]]);
            if (memberResult.rows.length > 0) {
                memberSocietyMap[memberIds[i]] = memberResult.rows[0].society_id;
            }
        }
        
        let memberChargeCount = 0;
        for (let i = 0; i < memberIds.length; i += 3) {
            const memberId = memberIds[i];
            const societyId = memberSocietyMap[memberId];
            if (!societyId) continue;
            
            const chargeId = randomElement(maintenanceChargeIds);
            
            await client.query(`
                INSERT INTO member_maintenance_charges (society_id, member_id, charge_id, charge_name, charge_type, amount, is_active, effective_from, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT DO NOTHING
            `, [
                societyId,
                memberId,
                chargeId,
                randomElement(chargeNames),
                'flat_rate',
                randomInt(500, 2000),
                true,
                randomDate(new Date(2024, 0, 1), new Date()),
                userIds[0],
                userIds[0]
            ]);
            memberChargeCount++;
        }
        log(`✓ Inserted ${memberChargeCount} member maintenance charges`, 'green');
        
        // 17. Insert Maintenance Bills
        log('\n📝 Inserting maintenance bills...', 'yellow');
        // Get member society mapping (reuse from above)
        const memberSocietyMapForBills = {};
        for (let i = 0; i < memberIds.length; i++) {
            const memberResult = await client.query('SELECT society_id FROM members WHERE id = $1', [memberIds[i]]);
            if (memberResult.rows.length > 0) {
                memberSocietyMapForBills[memberIds[i]] = memberResult.rows[0].society_id;
            }
        }
        
        for (let i = 0; i < memberIds.length; i++) {
            const memberId = memberIds[i];
            const societyId = memberSocietyMapForBills[memberId];
            if (!societyId) continue;
            const billingMonth = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 1));
            const totalAmount = randomInt(2000, 5000);
            const paidAmount = Math.random() > 0.4 ? totalAmount : randomInt(0, totalAmount - 500);
            const pendingAmount = totalAmount - paidAmount;
            
            const result = await client.query(`
                INSERT INTO maintenance_bills (society_id, member_id, bill_number, billing_month, billing_year, due_date, status, total_amount, paid_amount, pending_amount, late_fee, generated_at, generated_by, paid_at, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                RETURNING id
            `, [
                societyId,
                memberId,
                `BILL-2024-${String(billingMonth.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(6, '0')}`,
                new Date(billingMonth.getFullYear(), billingMonth.getMonth(), 1),
                billingMonth.getFullYear(),
                new Date(billingMonth.getTime() + 15 * 24 * 60 * 60 * 1000),
                paidAmount === totalAmount ? 'paid' : pendingAmount > 0 ? 'partial' : 'pending',
                totalAmount,
                paidAmount,
                pendingAmount,
                pendingAmount > 0 && billingMonth < new Date() ? randomInt(50, 200) : 0,
                billingMonth,
                userIds[0],
                paidAmount > 0 ? randomDate(billingMonth, new Date()) : null,
                userIds[0],
                userIds[0]
            ]);
            maintenanceBillIds.push(result.rows[0].id);
        }
        log(`✓ Inserted ${maintenanceBillIds.length} maintenance bills`, 'green');
        
        // 18. Insert Maintenance Bill Items
        log('\n📝 Inserting maintenance bill items...', 'yellow');
        for (let i = 0; i < maintenanceBillIds.length; i++) {
            const billId = maintenanceBillIds[i];
            const itemsCount = randomInt(2, 5);
            
            for (let j = 0; j < itemsCount; j++) {
                await client.query(`
                    INSERT INTO maintenance_bill_items (bill_id, charge_id, charge_name, description, quantity, unit_rate, amount)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [
                    billId,
                    randomElement(maintenanceChargeIds),
                    randomElement(chargeNames),
                    `Charge item ${j + 1}`,
                    randomInt(1, 3),
                    randomInt(100, 500),
                    randomInt(200, 1500)
                ]);
            }
        }
        log(`✓ Inserted maintenance bill items`, 'green');
        
        // 19. Insert Maintenance Payments
        log('\n📝 Inserting maintenance payments...', 'yellow');
        // Get bill details for society_id
        for (let i = 0; i < maintenanceBillIds.length; i += 2) {
            const billId = maintenanceBillIds[i];
            const billResult = await client.query('SELECT society_id, member_id FROM maintenance_bills WHERE id = $1', [billId]);
            if (billResult.rows.length === 0) continue;
            const memberId = billResult.rows[0].member_id;
            const societyId = billResult.rows[0].society_id;
            
            await client.query(`
                INSERT INTO maintenance_payments (bill_id, society_id, member_id, payment_amount, payment_date, payment_method, payment_reference, payment_status, received_by, receipt_number, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [
                billId,
                societyId,
                memberId,
                randomInt(1000, 3000),
                randomDate(new Date(2024, 0, 1), new Date()),
                randomElement(paymentMethods),
                `REF${randomInt(100000, 999999)}`,
                randomElement(['completed', 'completed', 'pending']),
                userIds[randomInt(1, 5)],
                `RCP${randomInt(100000, 999999)}`,
                userIds[0],
                userIds[0]
            ]);
        }
        log(`✓ Inserted maintenance payments`, 'green');
        
        // 20. Insert Visitors
        log('\n📝 Inserting visitors...', 'yellow');
        for (const societyId of societyIds) {
            const visitorsCount = randomInt(10, 25);
            // Get members for this society
            const membersResult = await client.query('SELECT id FROM members WHERE society_id = $1', [societyId]);
            const societyMembers = membersResult.rows.map(row => row.id);
            
            for (let i = 0; i < visitorsCount; i++) {
                const entryTime = randomDate(new Date(2024, 0, 1), new Date());
                const exitTime = Math.random() > 0.3 ? new Date(entryTime.getTime() + randomInt(1, 4) * 60 * 60 * 1000) : null;
                
                const result = await client.query(`
                    INSERT INTO visitors (society_id, member_id, flat_number, visitor_name, visitor_phone, visitor_email, visitor_id_type, visitor_id_number, purpose_of_visit, number_of_visitors, vehicle_number, vehicle_type, entry_time, exit_time, entry_gate, exit_gate, checked_in_by, checked_out_by, visitor_pass_number, status, is_expected, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
                    RETURNING id
                `, [
                    societyId,
                    randomElement(societyMembers),
                    `Flat ${randomInt(1, 20)}${randomElement(['A', 'B', 'C', ''])}`,
                    `${randomElement(firstNames)} ${randomElement(lastNames)}`,
                    randomPhone(),
                    randomEmail(randomElement(firstNames), randomElement(lastNames)),
                    randomElement(['aadhaar', 'pan', 'driving_license', 'voter_id']),
                    randomInt(100000000000, 999999999999).toString(),
                    randomElement(visitorPurposes),
                    randomInt(1, 3),
                    Math.random() > 0.5 ? `MH${randomInt(10, 99)}${randomElement(['AB', 'CD', 'EF'])}${randomInt(1000, 9999)}` : null,
                    Math.random() > 0.5 ? randomElement(vehicleTypes) : null,
                    entryTime,
                    exitTime,
                    randomElement(['Main Gate', 'Side Gate', 'Back Gate']),
                    exitTime ? randomElement(['Main Gate', 'Side Gate', 'Back Gate']) : null,
                    userIds[randomInt(1, 5)],
                    exitTime ? userIds[randomInt(1, 5)] : null,
                    `VP${randomInt(1000, 9999)}`,
                    exitTime ? 'exited' : 'inside',
                    Math.random() > 0.7,
                    userIds[0],
                    userIds[0]
                ]);
                visitorIds.push(result.rows[0].id);
            }
        }
        log(`✓ Inserted ${visitorIds.length} visitors`, 'green');
        
        // 21. Insert Visitor Pre-registrations
        log('\n📝 Inserting visitor pre-registrations...', 'yellow');
        for (const societyId of societyIds) {
            const preRegCount = randomInt(5, 10);
            // Get members for this society
            const membersResult = await client.query('SELECT id FROM members WHERE society_id = $1', [societyId]);
            const societyMembers = membersResult.rows.map(row => row.id);
            
            for (let i = 0; i < preRegCount; i++) {
                const expectedEntry = randomDate(new Date(), new Date(2025, 11, 31));
                const expectedExit = new Date(expectedEntry.getTime() + randomInt(1, 4) * 60 * 60 * 1000);
                
                await client.query(`
                    INSERT INTO visitor_pre_registrations (society_id, member_id, registered_by, visitor_name, visitor_phone, visitor_email, purpose_of_visit, expected_entry_time, expected_exit_time, number_of_visitors, vehicle_number, vehicle_type, visitor_id_type, visitor_id_number, status, approved_by, approved_at, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
                `, [
                    societyId,
                    randomElement(societyMembers),
                    userIds[randomInt(5, userIds.length - 1)],
                    `${randomElement(firstNames)} ${randomElement(lastNames)}`,
                    randomPhone(),
                    randomEmail(randomElement(firstNames), randomElement(lastNames)),
                    randomElement(visitorPurposes),
                    expectedEntry,
                    expectedExit,
                    randomInt(1, 3),
                    Math.random() > 0.5 ? `MH${randomInt(10, 99)}${randomElement(['AB', 'CD', 'EF'])}${randomInt(1000, 9999)}` : null,
                    Math.random() > 0.5 ? randomElement(vehicleTypes) : null,
                    randomElement(['aadhaar', 'pan', 'driving_license']),
                    randomInt(100000000000, 999999999999).toString(),
                    randomElement(['pending', 'approved', 'approved', 'rejected']),
                    Math.random() > 0.5 ? userIds[randomInt(1, 5)] : null,
                    Math.random() > 0.5 ? randomDate(new Date(2024, 0, 1), new Date()) : null,
                    userIds[0],
                    userIds[0]
                ]);
            }
        }
        log(`✓ Inserted visitor pre-registrations`, 'green');
        
        // 22. Insert Visitor Logs
        log('\n📝 Inserting visitor logs...', 'yellow');
        for (let i = 0; i < visitorIds.length; i++) {
            const visitorId = visitorIds[i];
            const societyId = societyIds[Math.floor(i / 20)];
            const actions = ['entry', 'check_in', 'exit', 'check_out'];
            
            for (const action of actions.slice(0, randomInt(1, 3))) {
                await client.query(`
                    INSERT INTO visitor_logs (visitor_id, society_id, action, action_time, performed_by, gate_name, notes, metadata)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    visitorId,
                    societyId,
                    action,
                    randomDate(new Date(2024, 0, 1), new Date()),
                    userIds[randomInt(1, 5)],
                    randomElement(['Main Gate', 'Side Gate', 'Back Gate']),
                    `Visitor ${action} logged`,
                    { source: 'gate_system', version: '1.0' }
                ]);
            }
        }
        log(`✓ Inserted visitor logs`, 'green');
        
        log('\n========================================', 'green');
        log('✅ Mock data insertion completed successfully!', 'green');
        log('========================================', 'green');
        log('\nSummary:', 'blue');
        log(`  - Users: ${userIds.length}`, 'blue');
        log(`  - Societies: ${societyIds.length}`, 'blue');
        log(`  - Members: ${memberIds.length}`, 'blue');
        log(`  - Assets: ${assetIds.length}`, 'blue');
        log(`  - Maintenance Requests: ${requestCount}`, 'blue');
        log(`  - Maintenance Bills: ${maintenanceBillIds.length}`, 'blue');
        log(`  - Visitors: ${visitorIds.length}`, 'blue');
        log(`  - And more...`, 'blue');
        log('\n');
        
    } catch (error) {
        log(`\n✗ Error: ${error.message}`, 'red');
        console.error(error);
        await client.end();
        process.exit(1);
    } finally {
        await client.end();
    }
}

insertMockData();

