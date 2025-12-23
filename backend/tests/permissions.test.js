const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Permissions API', () => {
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

    describe('GET /api/permissions', () => {
        it('should get all permissions', async () => {
            const response = await request(app)
                .get('/api/permissions')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.permissions).toBeDefined();
            expect(Array.isArray(response.body.data.permissions)).toBe(true);
        });

        it('should filter by resource', async () => {
            const response = await request(app)
                .get('/api/permissions?resource=users')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/permissions', () => {
        it('should create permission (superAdmin only)', async () => {
            const permissionData = {
                permission_code: `test_perm_${Date.now()}`,
                permission_name: `test_permission_${Date.now()}`,
                display_name: 'Test Permission',
                resource: 'test_resource',
                action: 'test_action',
            };

            const response = await request(app)
                .post('/api/permissions')
                .set(getAuthHeader(adminToken))
                .send(permissionData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.permission).toBeDefined();
        });
    });
});

