const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Maintenance Charges API', () => {
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

    describe('GET /api/maintenance-charges', () => {
        it('should get maintenance charges', async () => {
            const response = await request(app)
                .get('/api/maintenance-charges')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.maintenance_charges).toBeDefined();
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/maintenance-charges?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/maintenance-charges', () => {
        it('should create maintenance charge', async () => {
            const chargeData = {
                society_id: testSociety.id,
                charge_name: `Test Charge ${Date.now()}`,
                charge_type: 'monthly',
                base_amount: 1000,
                per_unit_rate: 50,
                unit_type: 'flat',
                is_active: true,
            };

            const response = await request(app)
                .post('/api/maintenance-charges')
                .set(getAuthHeader(adminToken))
                .send(chargeData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.maintenance_charge).toBeDefined();
        });
    });
});

