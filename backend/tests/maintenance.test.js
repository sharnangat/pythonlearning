const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Maintenance API', () => {
    let adminUser;
    let adminToken;
    let testSociety;
    let testMember;
    let testRequest;

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

    describe('GET /api/maintenance/requests', () => {
        beforeEach(async () => {
            testRequest = await createTestMaintenanceRequest();
        });

        it('should get all maintenance requests', async () => {
            const response = await request(app)
                .get('/api/maintenance/requests')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.requests).toBeDefined();
            expect(Array.isArray(response.body.data.requests)).toBe(true);
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/maintenance/requests?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should filter by status', async () => {
            const response = await request(app)
                .get('/api/maintenance/requests?status=pending')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/maintenance/requests', () => {
        it('should create maintenance request successfully', async () => {
            const requestData = {
                society_id: testSociety.id,
                member_id: testMember.id,
                title: 'Test Maintenance Request',
                description: 'Test description',
                location: 'Building A',
                priority: 'medium',
            };

            const response = await request(app)
                .post('/api/maintenance/requests')
                .set(getAuthHeader(adminToken))
                .send(requestData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.request).toBeDefined();
            expect(response.body.data.request.title).toBe(requestData.title);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/maintenance/requests')
                .set(getAuthHeader(adminToken))
                .send({
                    title: 'Test',
                    // Missing society_id and description
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/maintenance/requests/:id', () => {
        beforeEach(async () => {
            testRequest = await createTestMaintenanceRequest();
        });

        it('should update maintenance request successfully', async () => {
            const updateData = {
                status: 'in_progress',
                priority: 'high',
            };

            const response = await request(app)
                .put(`/api/maintenance/requests/${testRequest.id}`)
                .set(getAuthHeader(adminToken))
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.request.status).toBe(updateData.status);
        });
    });

    describe('GET /api/maintenance/bills', () => {
        it('should get maintenance bills', async () => {
            const response = await request(app)
                .get('/api/maintenance/bills')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.bills).toBeDefined();
        });
    });

    async function createTestMaintenanceRequest() {
        const { query } = require('../config/database');
        const result = await query(`
            INSERT INTO maintenance_requests (
                society_id, member_id, requested_by, title, description,
                location, priority, status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            testSociety.id,
            testMember.id,
            adminUser.user.id,
            'Test Request',
            'Test description',
            'Building A',
            'medium',
            'pending',
            adminUser.user.id,
            adminUser.user.id,
        ]);
        return result.rows[0];
    }
});

