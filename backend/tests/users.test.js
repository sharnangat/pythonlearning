const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Users API', () => {
    let adminUser;
    let adminToken;
    let regularUser;
    let regularToken;

    beforeAll(async () => {
        await cleanupTestData();
        
        // Create admin user
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;

        // Create regular user
        regularUser = await createTestUser({ username: 'regular_user' });
        regularToken = regularUser.token;
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/users', () => {
        it('should get all users with admin token', async () => {
            const response = await request(app)
                .get('/api/users')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.users).toBeDefined();
            expect(Array.isArray(response.body.data.users)).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/users?page=1&limit=5')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.pagination).toBeDefined();
            expect(response.body.data.pagination.page).toBe(1);
            expect(response.body.data.pagination.limit).toBe(5);
        });

        it('should support search', async () => {
            const response = await request(app)
                .get(`/api/users?search=${adminUser.user.username}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.users.length).toBeGreaterThan(0);
        });

        it('should fail without authentication', async () => {
            await request(app)
                .get('/api/users')
                .expect(401);
        });

        it('should fail without proper permissions', async () => {
            await request(app)
                .get('/api/users')
                .set(getAuthHeader(regularToken))
                .expect(403);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get user by ID', async () => {
            const response = await request(app)
                .get(`/api/users/${adminUser.user.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.user.id).toBe(adminUser.user.id);
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000999';
            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .set(getAuthHeader(adminToken))
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user successfully', async () => {
            const updateData = {
                first_name: 'Updated',
                last_name: 'Name',
            };

            const response = await request(app)
                .put(`/api/users/${adminUser.user.id}`)
                .set(getAuthHeader(adminToken))
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.first_name).toBe(updateData.first_name);
            expect(response.body.data.user.last_name).toBe(updateData.last_name);
        });

        it('should fail without proper permissions', async () => {
            await request(app)
                .put(`/api/users/${adminUser.user.id}`)
                .set(getAuthHeader(regularToken))
                .send({ first_name: 'Updated' })
                .expect(403);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user successfully', async () => {
            const userToDelete = await createTestUser();
            const deleteToken = userToDelete.token;
            await assignRoleToUser(userToDelete.user.id, 'superAdmin');

            const response = await request(app)
                .delete(`/api/users/${userToDelete.user.id}`)
                .set(getAuthHeader(deleteToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should fail without proper permissions', async () => {
            const userToDelete = await createTestUser();
            
            await request(app)
                .delete(`/api/users/${userToDelete.user.id}`)
                .set(getAuthHeader(regularToken))
                .expect(403);
        });
    });

    describe('POST /api/users/:id/change-password', () => {
        it('should change password successfully', async () => {
            const user = await createTestUser();
            const response = await request(app)
                .post(`/api/users/${user.user.id}/change-password`)
                .set(getAuthHeader(user.token))
                .send({
                    current_password: user.password,
                    new_password: 'NewPassword123!',
                })
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should fail with incorrect current password', async () => {
            const user = await createTestUser();
            const response = await request(app)
                .post(`/api/users/${user.user.id}/change-password`)
                .set(getAuthHeader(user.token))
                .send({
                    current_password: 'WrongPassword123!',
                    new_password: 'NewPassword123!',
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
});

