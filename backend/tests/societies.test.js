const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Societies API', () => {
    let adminUser;
    let adminToken;
    let regularUser;
    let regularToken;
    let testSociety;

    beforeAll(async () => {
        await cleanupTestData();
        
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;

        regularUser = await createTestUser({ username: 'regular_user' });
        regularToken = regularUser.token;
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/societies', () => {
        beforeEach(async () => {
            testSociety = await createTestSociety({ created_by: adminUser.user.id });
        });

        it('should get all societies', async () => {
            const response = await request(app)
                .get('/api/societies')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.societies).toBeDefined();
            expect(Array.isArray(response.body.data.societies)).toBe(true);
        });

        it('should support search', async () => {
            const response = await request(app)
                .get(`/api/societies?search=${testSociety.society_name}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.societies.length).toBeGreaterThan(0);
        });

        it('should fail without authentication', async () => {
            await request(app)
                .get('/api/societies')
                .expect(401);
        });
    });

    describe('GET /api/societies/:id', () => {
        beforeEach(async () => {
            testSociety = await createTestSociety({ created_by: adminUser.user.id });
        });

        it('should get society by ID', async () => {
            const response = await request(app)
                .get(`/api/societies/${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.society).toBeDefined();
            expect(response.body.data.society.id).toBe(testSociety.id);
        });

        it('should return 404 for non-existent society', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000999';
            await request(app)
                .get(`/api/societies/${fakeId}`)
                .set(getAuthHeader(adminToken))
                .expect(404);
        });
    });

    describe('POST /api/societies', () => {
        it('should create society successfully', async () => {
            const societyData = {
                society_name: `New Society ${Date.now()}`,
                registration_number: `REG${Date.now()}`,
                address: '123 Test Street',
                city: 'Test City',
                state: 'Test State',
                pincode: '123456',
                country: 'Test Country',
                phone: '1234567890',
                email: `society_${Date.now()}@example.com`,
            };

            const response = await request(app)
                .post('/api/societies')
                .set(getAuthHeader(adminToken))
                .send(societyData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.society).toBeDefined();
            expect(response.body.data.society.society_name).toBe(societyData.society_name);
        });

        it('should fail with duplicate registration number', async () => {
            const societyData = {
                society_name: 'Test Society',
                registration_number: `DUPLICATE${Date.now()}`,
                address: '123 Test Street',
            };

            await request(app)
                .post('/api/societies')
                .set(getAuthHeader(adminToken))
                .send(societyData)
                .expect(201);

            const response = await request(app)
                .post('/api/societies')
                .set(getAuthHeader(adminToken))
                .send(societyData)
                .expect(409);

            expect(response.body.success).toBe(false);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/societies')
                .set(getAuthHeader(adminToken))
                .send({
                    society_name: 'Test',
                    // Missing registration_number and address
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/societies/:id', () => {
        beforeEach(async () => {
            testSociety = await createTestSociety({ created_by: adminUser.user.id });
        });

        it('should update society successfully', async () => {
            const updateData = {
                society_name: 'Updated Society Name',
                phone: '9876543210',
            };

            const response = await request(app)
                .put(`/api/societies/${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.society.society_name).toBe(updateData.society_name);
        });

        it('should fail without proper permissions', async () => {
            await request(app)
                .put(`/api/societies/${testSociety.id}`)
                .set(getAuthHeader(regularToken))
                .send({ society_name: 'Updated' })
                .expect(403);
        });
    });

    describe('DELETE /api/societies/:id', () => {
        it('should delete society successfully', async () => {
            const societyToDelete = await createTestSociety({ created_by: adminUser.user.id });

            const response = await request(app)
                .delete(`/api/societies/${societyToDelete.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should fail without proper permissions', async () => {
            const societyToDelete = await createTestSociety({ created_by: adminUser.user.id });

            await request(app)
                .delete(`/api/societies/${societyToDelete.id}`)
                .set(getAuthHeader(regularToken))
                .expect(403);
        });
    });
});

