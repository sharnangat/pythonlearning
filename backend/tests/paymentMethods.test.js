const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Payment Methods API', () => {
    let adminUser;
    let adminToken;
    let testSociety;

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

    describe('GET /api/payment-methods', () => {
        it('should get payment methods', async () => {
            const response = await request(app)
                .get('/api/payment-methods')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.payment_methods).toBeDefined();
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/payment-methods?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/payment-methods', () => {
        it('should create payment method', async () => {
            const methodData = {
                society_id: testSociety.id,
                payment_type: 'bank_transfer',
                provider: 'Test Bank',
                account_holder_name: 'Test Account',
                account_number_last4: '1234',
                is_default: true,
            };

            const response = await request(app)
                .post('/api/payment-methods')
                .set(getAuthHeader(adminToken))
                .send(methodData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.payment_method).toBeDefined();
        });
    });
});

