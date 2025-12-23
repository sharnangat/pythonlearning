const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Roles API', () => {
    let adminUser;
    let adminToken;

    beforeAll(async () => {
        await cleanupTestData();
        
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/roles', () => {
        it('should get all roles', async () => {
            const response = await request(app)
                .get('/api/roles')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.roles).toBeDefined();
            expect(Array.isArray(response.body.data.roles)).toBe(true);
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get('/api/roles?society_id=null')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/roles', () => {
        it('should create role successfully', async () => {
            const roleData = {
                role_name: `test_role_${Date.now()}`,
                display_name: 'Test Role',
                description: 'Test role description',
                hierarchy_level: 5,
            };

            const response = await request(app)
                .post('/api/roles')
                .set(getAuthHeader(adminToken))
                .send(roleData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.role).toBeDefined();
            expect(response.body.data.role.role_name).toBe(roleData.role_name);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/roles')
                .set(getAuthHeader(adminToken))
                .send({
                    display_name: 'Test',
                    // Missing role_name
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/roles/assign', () => {
        it('should assign role to user successfully', async () => {
            const targetUser = await createTestUser();
            const { query } = require('../config/database');
            const roleResult = await query("SELECT id FROM roles WHERE role_name = 'member' LIMIT 1");

            const assignData = {
                user_id: targetUser.user.id,
                role_id: roleResult.rows[0].id,
            };

            const response = await request(app)
                .post('/api/roles/assign')
                .set(getAuthHeader(adminToken))
                .send(assignData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user_role).toBeDefined();
        });
    });

    describe('GET /api/roles/permissions', () => {
        it('should get all permissions', async () => {
            const response = await request(app)
                .get('/api/roles/permissions')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.permissions).toBeDefined();
        });
    });
});

