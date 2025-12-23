const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Visitor Logs API', () => {
    let adminUser;
    let adminToken;
    let testSociety;
    let testMember;
    let testVisitor;

    beforeAll(async () => {
        await cleanupTestData();
        
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;

        testSociety = await createTestSociety({ created_by: adminUser.user.id });
        testMember = await createTestMember({
            society_id: testSociety.id,
            created_by: adminUser.user.id,
        });
    });

    beforeEach(async () => {
        const { query } = require('../config/database');
        const visitorResult = await query(`
            INSERT INTO visitors (
                society_id, member_id, flat_number, visitor_name, visitor_phone,
                purpose_of_visit, entry_time, entry_gate, checked_in_by,
                status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            testSociety.id,
            testMember.id,
            '101',
            'Test Visitor',
            '1234567890',
            'Meeting',
            'Main Gate',
            adminUser.user.id,
            'inside',
            adminUser.user.id,
            adminUser.user.id,
        ]);
        testVisitor = visitorResult.rows[0];
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/visitor-logs', () => {
        it('should get visitor logs', async () => {
            const response = await request(app)
                .get('/api/visitor-logs')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.visitor_logs).toBeDefined();
            expect(response.body.data.pagination).toBeDefined();
        });

        it('should filter by visitor_id', async () => {
            const response = await request(app)
                .get(`/api/visitor-logs?visitor_id=${testVisitor.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/visitor-logs?page=1&limit=10')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.pagination.page).toBe(1);
        });
    });
});

