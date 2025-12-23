const request = require('supertest');
const app = require('../server');
const { createTestUser, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Logs API', () => {
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

    describe('GET /api/logs/requests', () => {
        it('should get recent requests (admin only)', async () => {
            // Make a request first to generate logs
            await request(app)
                .get('/api/auth/profile')
                .set(getAuthHeader(adminToken))
                .expect(200);

            const response = await request(app)
                .get('/api/logs/requests')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.requests).toBeDefined();
        });

        it('should support limit parameter', async () => {
            const response = await request(app)
                .get('/api/logs/requests?limit=10')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('GET /api/logs/responses', () => {
        it('should get recent responses (admin only)', async () => {
            const response = await request(app)
                .get('/api/logs/responses')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.responses).toBeDefined();
        });
    });

    describe('GET /api/logs/pair/:requestId', () => {
        it('should get request-response pair', async () => {
            // Make a request first to generate logs
            const profileResponse = await request(app)
                .get('/api/auth/profile')
                .set(getAuthHeader(adminToken))
                .expect(200);

            // Get requestId from logs
            const { readRequests } = require('../utils/requestResponseLogger');
            const requests = readRequests(10);
            
            if (requests.length > 0) {
                const response = await request(app)
                    .get(`/api/logs/pair/${requests[0].requestId}`)
                    .set(getAuthHeader(adminToken))
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.pair).toBeDefined();
            }
        });
    });
});

