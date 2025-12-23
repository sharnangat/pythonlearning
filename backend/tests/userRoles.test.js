const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('User Roles API', () => {
    let adminUser;
    let adminToken;
    let testUser;

    beforeAll(async () => {
        await cleanupTestData();
        
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;

        testUser = await createTestUser();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/user-roles', () => {
        it('should get all user roles', async () => {
            const response = await request(app)
                .get('/api/user-roles')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user_roles).toBeDefined();
        });

        it('should filter by user_id', async () => {
            const response = await request(app)
                .get(`/api/user-roles?user_id=${adminUser.user.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('PUT /api/user-roles/:id', () => {
        it('should update user role', async () => {
            const userRole = await assignRoleToUser(testUser.user.id, 'member');
            
            const updateData = {
                is_active: false,
            };

            const response = await request(app)
                .put(`/api/user-roles/${userRole.id}`)
                .set(getAuthHeader(adminToken))
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('DELETE /api/user-roles/:id', () => {
        it('should revoke user role', async () => {
            const userRole = await assignRoleToUser(testUser.user.id, 'member');
            
            const response = await request(app)
                .delete(`/api/user-roles/${userRole.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});

