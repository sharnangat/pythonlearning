const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Role Permissions API', () => {
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

    describe('GET /api/role-permissions', () => {
        it('should get role permissions', async () => {
            const response = await request(app)
                .get('/api/role-permissions')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.role_permissions).toBeDefined();
        });

        it('should filter by role_id', async () => {
            const { query } = require('../config/database');
            const roleResult = await query("SELECT id FROM roles WHERE role_name = 'superAdmin' LIMIT 1");
            
            const response = await request(app)
                .get(`/api/role-permissions?role_id=${roleResult.rows[0].id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/role-permissions', () => {
        it('should assign permission to role', async () => {
            const { query } = require('../config/database');
            const roleResult = await query("SELECT id FROM roles WHERE role_name = 'member' LIMIT 1");
            const permResult = await query("SELECT id FROM permissions LIMIT 1");

            const assignData = {
                role_id: roleResult.rows[0].id,
                permission_id: permResult.rows[0].id,
                granted: true,
            };

            const response = await request(app)
                .post('/api/role-permissions')
                .set(getAuthHeader(adminToken))
                .send(assignData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.role_permission).toBeDefined();
        });
    });
});

