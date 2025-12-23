const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Visitors API', () => {
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

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/visitors', () => {
        beforeEach(async () => {
            testVisitor = await createTestVisitor();
        });

        it('should get all visitors', async () => {
            const response = await request(app)
                .get('/api/visitors')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.visitors).toBeDefined();
            expect(Array.isArray(response.body.data.visitors)).toBe(true);
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/visitors?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should filter by status', async () => {
            const response = await request(app)
                .get('/api/visitors?status=inside')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/visitors', () => {
        it('should create visitor entry successfully', async () => {
            const visitorData = {
                society_id: testSociety.id,
                member_id: testMember.id,
                flat_number: '101',
                visitor_name: 'John Doe',
                visitor_phone: '1234567890',
                purpose_of_visit: 'Meeting',
            };

            const response = await request(app)
                .post('/api/visitors')
                .set(getAuthHeader(adminToken))
                .send(visitorData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.visitor).toBeDefined();
            expect(response.body.data.visitor.visitor_name).toBe(visitorData.visitor_name);
            expect(response.body.data.visitor.status).toBe('inside');
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/visitors')
                .set(getAuthHeader(adminToken))
                .send({
                    visitor_name: 'John',
                    // Missing society_id
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/visitors/:id/checkout', () => {
        beforeEach(async () => {
            testVisitor = await createTestVisitor();
        });

        it('should checkout visitor successfully', async () => {
            const response = await request(app)
                .put(`/api/visitors/${testVisitor.id}/checkout`)
                .set(getAuthHeader(adminToken))
                .send({ exit_gate: 'Main Gate' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.visitor.status).toBe('exited');
            expect(response.body.data.visitor.exit_time).toBeDefined();
        });

        it('should fail if visitor already checked out', async () => {
            // Checkout first time
            await request(app)
                .put(`/api/visitors/${testVisitor.id}/checkout`)
                .set(getAuthHeader(adminToken))
                .send({ exit_gate: 'Main Gate' })
                .expect(200);

            // Try to checkout again
            const response = await request(app)
                .put(`/api/visitors/${testVisitor.id}/checkout`)
                .set(getAuthHeader(adminToken))
                .send({ exit_gate: 'Main Gate' })
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/visitors/pre-register', () => {
        it('should pre-register visitor successfully', async () => {
            const preRegData = {
                society_id: testSociety.id,
                member_id: testMember.id,
                visitor_name: 'Jane Doe',
                visitor_phone: '9876543210',
                purpose_of_visit: 'Delivery',
                expected_entry_time: new Date(Date.now() + 3600000).toISOString(),
                expected_exit_time: new Date(Date.now() + 7200000).toISOString(),
            };

            const response = await request(app)
                .post('/api/visitors/pre-register')
                .set(getAuthHeader(adminToken))
                .send(preRegData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.pre_registration).toBeDefined();
            expect(response.body.data.pre_registration.status).toBe('pending');
        });
    });

    async function createTestVisitor() {
        const { query } = require('../config/database');
        const result = await query(`
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
        return result.rows[0];
    }
});

