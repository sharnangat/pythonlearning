const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Members API', () => {
    let adminUser;
    let adminToken;
    let testSociety;
    let testMember;

    beforeAll(async () => {
        await cleanupTestData();
        
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;

        testSociety = await createTestSociety({ created_by: adminUser.user.id });
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/members', () => {
        beforeEach(async () => {
            testMember = await createTestMember({
                society_id: testSociety.id,
                created_by: adminUser.user.id,
            });
        });

        it('should get all members', async () => {
            const response = await request(app)
                .get('/api/members')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.members).toBeDefined();
            expect(Array.isArray(response.body.data.members)).toBe(true);
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/members?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.members.length).toBeGreaterThan(0);
        });

        it('should filter by status', async () => {
            const response = await request(app)
                .get('/api/members?status=active')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should fail without authentication', async () => {
            await request(app)
                .get('/api/members')
                .expect(401);
        });
    });

    describe('GET /api/members/:id', () => {
        beforeEach(async () => {
            testMember = await createTestMember({
                society_id: testSociety.id,
                created_by: adminUser.user.id,
            });
        });

        it('should get member by ID', async () => {
            const response = await request(app)
                .get(`/api/members/${testMember.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.member).toBeDefined();
            expect(response.body.data.member.id).toBe(testMember.id);
        });

        it('should return 404 for non-existent member', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000999';
            await request(app)
                .get(`/api/members/${fakeId}`)
                .set(getAuthHeader(adminToken))
                .expect(404);
        });
    });

    describe('POST /api/members', () => {
        it('should create member successfully', async () => {
            const memberData = {
                society_id: testSociety.id,
                membership_number: `MEM${Date.now()}`,
                first_name: 'John',
                last_name: 'Doe',
                email: `member_${Date.now()}@example.com`,
                phone: '1234567890',
                flat_number: '201',
            };

            const response = await request(app)
                .post('/api/members')
                .set(getAuthHeader(adminToken))
                .send(memberData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.member).toBeDefined();
            expect(response.body.data.member.first_name).toBe(memberData.first_name);
            expect(response.body.data.member.flat_number).toBe(memberData.flat_number);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/members')
                .set(getAuthHeader(adminToken))
                .send({
                    first_name: 'John',
                    // Missing society_id and flat_number
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should fail with invalid society_id', async () => {
            const memberData = {
                society_id: '00000000-0000-0000-0000-000000000999',
                first_name: 'John',
                flat_number: '201',
            };

            await request(app)
                .post('/api/members')
                .set(getAuthHeader(adminToken))
                .send(memberData)
                .expect(400);
        });
    });

    describe('PUT /api/members/:id', () => {
        beforeEach(async () => {
            testMember = await createTestMember({
                society_id: testSociety.id,
                created_by: adminUser.user.id,
            });
        });

        it('should update member successfully', async () => {
            const updateData = {
                first_name: 'Updated',
                last_name: 'Name',
                phone: '9876543210',
            };

            const response = await request(app)
                .put(`/api/members/${testMember.id}`)
                .set(getAuthHeader(adminToken))
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.member.first_name).toBe(updateData.first_name);
        });
    });

    describe('DELETE /api/members/:id', () => {
        it('should delete member successfully', async () => {
            const memberToDelete = await createTestMember({
                society_id: testSociety.id,
                created_by: adminUser.user.id,
            });

            const response = await request(app)
                .delete(`/api/members/${memberToDelete.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});

