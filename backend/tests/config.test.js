const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Configuration API', () => {
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

    describe('GET /api/config', () => {
        it('should get configuration', async () => {
            const response = await request(app)
                .get('/api/config')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.configs).toBeDefined();
        });

        it('should filter by category', async () => {
            const response = await request(app)
                .get('/api/config?category=system')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('PUT /api/config/:id', () => {
        it('should update configuration', async () => {
            const { query } = require('../config/database');
            const configResult = await query(`
                SELECT id FROM company_config 
                WHERE is_editable = TRUE 
                LIMIT 1
            `);

            if (configResult.rows.length > 0) {
                const updateData = {
                    config_value: 'Updated Value',
                };

                const response = await request(app)
                    .put(`/api/config/${configResult.rows[0].id}`)
                    .set(getAuthHeader(adminToken))
                    .send(updateData)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.config.config_value).toBe(updateData.config_value);
            }
        });
    });
});

