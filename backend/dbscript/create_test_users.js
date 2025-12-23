#!/usr/bin/env node

/**
 * Create Test Users Script
 * Creates 1 super admin, 1 society admin, and 1 member user
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

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function createTestUsers() {
    const client = new Client(dbConfig);
    
    try {
        await client.connect();
        log('\n✓ Connected to database', 'green');
        
        // Default password for all test users
        const defaultPassword = 'Test123456!';
        const passwordHash = await hashPassword(defaultPassword);
        
        // Get role IDs
        const rolesResult = await client.query('SELECT id, role_name FROM roles WHERE role_name IN ($1, $2, $3)', 
            ['superAdmin', 'societyAdmin', 'member']);
        const roleMap = {};
        rolesResult.rows.forEach(row => {
            roleMap[row.role_name] = row.id;
        });
        
        if (!roleMap['superAdmin'] || !roleMap['societyAdmin'] || !roleMap['member']) {
            throw new Error('Required roles not found. Please run schema.sql first to create default roles.');
        }
        
        log('\n📝 Creating test users...', 'yellow');
        
        // 1. Create Super Admin
        log('\n1. Creating Super Admin user...', 'blue');
        let superAdminResult;
        try {
            superAdminResult = await client.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified, phone_verified)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (username) DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    status = EXCLUDED.status,
                    email_verified = EXCLUDED.email_verified,
                    phone_verified = EXCLUDED.phone_verified
                RETURNING id, username, email
            `, [
                'superadmin',
                'superadmin@example.com',
                passwordHash,
                'Super',
                'Admin',
                '9876543210',
                'active',
                true,
                true
            ]);
        } catch (error) {
            // If user exists, get it
            const existingUser = await client.query('SELECT id, username, email FROM users WHERE username = $1', ['superadmin']);
            if (existingUser.rows.length > 0) {
                superAdminResult = { rows: existingUser.rows };
                log('  ⚠ Super Admin user already exists, updating...', 'yellow');
            } else {
                throw error;
            }
        }
        
        const superAdminId = superAdminResult.rows[0].id;
        log(`  ✓ Super Admin created/updated:`, 'green');
        log(`    Username: superadmin`, 'green');
        log(`    Email: superadmin@example.com`, 'green');
        log(`    Password: ${defaultPassword}`, 'green');
        
        // Assign superAdmin role
        await client.query(`
            INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
            VALUES ($1, $2, NULL, TRUE, $1)
            ON CONFLICT (user_id, role_id, society_id) DO UPDATE SET
                is_active = TRUE
        `, [superAdminId, roleMap['superAdmin']]);
        log(`  ✓ Super Admin role assigned`, 'green');
        
        // 2. Create Society Admin
        log('\n2. Creating Society Admin user...', 'blue');
        
        // First, create a society for the society admin
        let societyResult;
        try {
            societyResult = await client.query(`
                INSERT INTO societies (society_name, registration_number, address, city, state, country, pincode, phone, email, status, total_flats, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (registration_number) DO UPDATE SET
                    society_name = EXCLUDED.society_name,
                    status = EXCLUDED.status
                RETURNING id, society_name
            `, [
                'Test Society',
                'REG000001',
                '123 Test Street, Test City',
                'Mumbai',
                'Maharashtra',
                'India',
                '400001',
                '9876543211',
                'test@testsociety.com',
                'active',
                50,
                superAdminId,
                superAdminId
            ]);
        } catch (error) {
            // If society exists, get it
            const existingSociety = await client.query('SELECT id, society_name FROM societies WHERE registration_number = $1', ['REG000001']);
            if (existingSociety.rows.length > 0) {
                societyResult = { rows: existingSociety.rows };
                log('  ⚠ Society already exists, using existing...', 'yellow');
            } else {
                throw error;
            }
        }
        
        const societyId = societyResult.rows[0].id;
        log(`  ✓ Society created/found: ${societyResult.rows[0].society_name}`, 'green');
        
        // Create society admin user
        let societyAdminResult;
        try {
            societyAdminResult = await client.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified, phone_verified)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (username) DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    status = EXCLUDED.status,
                    email_verified = EXCLUDED.email_verified,
                    phone_verified = EXCLUDED.phone_verified
                RETURNING id, username, email
            `, [
                'societyadmin',
                'societyadmin@example.com',
                passwordHash,
                'Society',
                'Admin',
                '9876543212',
                'active',
                true,
                true
            ]);
        } catch (error) {
            const existingUser = await client.query('SELECT id, username, email FROM users WHERE username = $1', ['societyadmin']);
            if (existingUser.rows.length > 0) {
                societyAdminResult = { rows: existingUser.rows };
                log('  ⚠ Society Admin user already exists, updating...', 'yellow');
            } else {
                throw error;
            }
        }
        
        const societyAdminId = societyAdminResult.rows[0].id;
        log(`  ✓ Society Admin created/updated:`, 'green');
        log(`    Username: societyadmin`, 'green');
        log(`    Email: societyadmin@example.com`, 'green');
        log(`    Password: ${defaultPassword}`, 'green');
        
        // Assign societyAdmin role
        await client.query(`
            INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
            VALUES ($1, $2, $3, TRUE, $4)
            ON CONFLICT (user_id, role_id, society_id) DO UPDATE SET
                is_active = TRUE
        `, [societyAdminId, roleMap['societyAdmin'], societyId, superAdminId]);
        log(`  ✓ Society Admin role assigned to society`, 'green');
        
        // 3. Create Member
        log('\n3. Creating Member user...', 'blue');
        
        let memberResult;
        try {
            memberResult = await client.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified, phone_verified)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (username) DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    status = EXCLUDED.status,
                    email_verified = EXCLUDED.email_verified,
                    phone_verified = EXCLUDED.phone_verified
                RETURNING id, username, email
            `, [
                'member',
                'member@example.com',
                passwordHash,
                'John',
                'Member',
                '9876543213',
                'active',
                true,
                true
            ]);
        } catch (error) {
            const existingUser = await client.query('SELECT id, username, email FROM users WHERE username = $1', ['member']);
            if (existingUser.rows.length > 0) {
                memberResult = { rows: existingUser.rows };
                log('  ⚠ Member user already exists, updating...', 'yellow');
            } else {
                throw error;
            }
        }
        
        const memberId = memberResult.rows[0].id;
        log(`  ✓ Member created/updated:`, 'green');
        log(`    Username: member`, 'green');
        log(`    Email: member@example.com`, 'green');
        log(`    Password: ${defaultPassword}`, 'green');
        
        // Assign member role
        await client.query(`
            INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
            VALUES ($1, $2, $3, TRUE, $4)
            ON CONFLICT (user_id, role_id, society_id) DO UPDATE SET
                is_active = TRUE
        `, [memberId, roleMap['member'], societyId, superAdminId]);
        log(`  ✓ Member role assigned to society`, 'green');
        
        // Create member record in members table
        try {
            await client.query(`
                INSERT INTO members (society_id, membership_number, user_id, first_name, last_name, email, phone, flat_number, floor_number, building_name, address, city, state, pincode, member_type, ownership_percentage, joining_date, status, is_primary_member, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
                ON CONFLICT (membership_number) DO UPDATE SET
                    user_id = EXCLUDED.user_id,
                    status = EXCLUDED.status
            `, [
                societyId,
                'MEM000001',
                memberId,
                'John',
                'Member',
                'member@example.com',
                '9876543213',
                '101',
                1,
                'Tower A',
                'Flat 101, Tower A',
                'Mumbai',
                'Maharashtra',
                '400001',
                'owner',
                100.00,
                new Date(),
                'active',
                true,
                superAdminId,
                superAdminId
            ]);
            log(`  ✓ Member record created in members table`, 'green');
        } catch (error) {
            log(`  ⚠ Member record may already exist: ${error.message}`, 'yellow');
        }
        
        log('\n========================================', 'green');
        log('✅ Test users created successfully!', 'green');
        log('========================================', 'green');
        log('\n📋 Login Credentials:', 'blue');
        log('\n1. Super Admin:', 'yellow');
        log('   Username: superadmin', 'blue');
        log('   Email: superadmin@example.com', 'blue');
        log(`   Password: ${defaultPassword}`, 'blue');
        log('\n2. Society Admin:', 'yellow');
        log('   Username: societyadmin', 'blue');
        log('   Email: societyadmin@example.com', 'blue');
        log(`   Password: ${defaultPassword}`, 'blue');
        log('\n3. Member:', 'yellow');
        log('   Username: member', 'blue');
        log('   Email: member@example.com', 'blue');
        log(`   Password: ${defaultPassword}`, 'blue');
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

createTestUsers();

