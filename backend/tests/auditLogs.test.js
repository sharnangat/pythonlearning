const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Audit Logs API', () => {
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

    describe('GET /api/audit-logs', () => {
        it('should get audit logs (admin only)', async () => {
            const response = await request(app)
                .get('/api/audit-logs')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.audit_logs).toBeDefined();
            expect(response.body.data.pagination).toBeDefined();
        });

        it('should filter by user_id', async () => {
            const response = await request(app)
                .get(`/api/audit-logs?user_id=${adminUser.user.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should filter by action', async () => {
            const response = await request(app)
                .get('/api/audit-logs?action=create')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/audit-logs?page=1&limit=10')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.pagination.page).toBe(1);
            expect(response.body.data.pagination.limit).toBe(10);
        });
    });

    describe('GET /api/audit-logs/:id', () => {
        it('should get audit log by ID', async () => {
            const { query } = require('../config/database');
            const logResult = await query(`
                SELECT id FROM audit_logs 
                WHERE user_id = $1 
                ORDER BY created_at DESC 
                LIMIT 1
            `, [adminUser.user.id]);

            if (logResult.rows.length > 0) {
                const response = await request(app)
                    .get(`/api/audit-logs/${logResult.rows[0].id}`)
                    .set(getAuthHeader(adminToken))
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.audit_log).toBeDefined();
            }
        });
    });
});

