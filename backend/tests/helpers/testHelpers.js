const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Generate a test JWT token
 */
function generateTestToken(payload = {}) {
    const defaultPayload = {
        userId: payload.userId || '00000000-0000-0000-0000-000000000001',
        email: payload.email || 'test@example.com',
    };
    return jwt.sign({ ...defaultPayload, ...payload }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Create a test user and return token
 */
async function createTestUser(userData = {}) {
    const defaultUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Test123456!',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890',
        status: 'active',
        email_verified: true,
    };

    const user = { ...defaultUser, ...userData };
    const passwordHash = await bcrypt.hash(user.password, 10);

    const result = await query(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, username, email, first_name, last_name, status
    `, [
        user.username,
        user.email,
        passwordHash,
        user.first_name,
        user.last_name,
        user.phone,
        user.status,
        user.email_verified,
    ]);

    const token = generateTestToken({ userId: result.rows[0].id, email: result.rows[0].email });

    return {
        user: result.rows[0],
        token,
        password: user.password,
    };
}

/**
 * Create a test society
 */
async function createTestSociety(societyData = {}) {
    const defaultSociety = {
        society_name: `Test Society ${Date.now()}`,
        registration_number: `REG${Date.now()}`,
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'Test Country',
        phone: '1234567890',
        email: `society_${Date.now()}@example.com`,
        status: 'active',
    };

    const society = { ...defaultSociety, ...societyData };

    const result = await query(`
        INSERT INTO societies (
            society_name, registration_number, address, city, state, pincode,
            country, phone, email, status, created_by, updated_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
    `, [
        society.society_name,
        society.registration_number,
        society.address,
        society.city,
        society.state,
        society.pincode,
        society.country,
        society.phone,
        society.email,
        society.status,
        society.created_by || null,
        society.updated_by || null,
    ]);

    return result.rows[0];
}

/**
 * Create a test member
 */
async function createTestMember(memberData = {}) {
    if (!memberData.society_id) {
        const society = await createTestSociety();
        memberData.society_id = society.id;
    }

    const defaultMember = {
        membership_number: `MEM${Date.now()}`,
        first_name: 'Test',
        last_name: 'Member',
        email: `member_${Date.now()}@example.com`,
        phone: '1234567890',
        flat_number: '101',
        status: 'active',
    };

    const member = { ...defaultMember, ...memberData };

    const result = await query(`
        INSERT INTO members (
            society_id, membership_number, first_name, last_name, email, phone,
            flat_number, status, created_by, updated_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `, [
        member.society_id,
        member.membership_number,
        member.first_name,
        member.last_name,
        member.email,
        member.phone,
        member.flat_number,
        member.status,
        member.created_by || null,
        member.updated_by || null,
    ]);

    return result.rows[0];
}

/**
 * Assign role to user
 */
async function assignRoleToUser(userId, roleName, societyId = null) {
    const roleResult = await query('SELECT id FROM roles WHERE role_name = $1', [roleName]);
    if (roleResult.rows.length === 0) {
        throw new Error(`Role ${roleName} not found`);
    }

    const result = await query(`
        INSERT INTO user_roles (user_id, role_id, society_id, is_active, assigned_by)
        VALUES ($1, $2, $3, TRUE, $1)
        ON CONFLICT (user_id, role_id, society_id) DO UPDATE
        SET is_active = TRUE
        RETURNING *
    `, [userId, roleResult.rows[0].id, societyId]);

    return result.rows[0];
}

/**
 * Clean up test data
 */
async function cleanupTestData() {
    const tables = [
        'visitor_logs', 'visitor_pre_registrations', 'visitors',
        'maintenance_payments', 'maintenance_bill_items', 'maintenance_bills',
        'member_maintenance_charges', 'maintenance_charges',
        'payments', 'society_subscriptions', 'notifications', 'audit_logs',
        'maintenance_requests', 'company_config', 'assets', 'members',
        'user_roles', 'societies', 'users'
    ];

    for (const table of tables) {
        try {
            await query(`TRUNCATE TABLE ${table} CASCADE`);
        } catch (error) {
            // Ignore errors for tables that don't exist
        }
    }
}

/**
 * Get authorization header
 */
function getAuthHeader(token) {
    return { Authorization: `Bearer ${token}` };
}

module.exports = {
    generateTestToken,
    createTestUser,
    createTestSociety,
    createTestMember,
    assignRoleToUser,
    cleanupTestData,
    getAuthHeader,
};

