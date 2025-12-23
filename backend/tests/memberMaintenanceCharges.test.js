const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Member Maintenance Charges API', () => {
    let adminUser;
    let adminToken;
    let testSociety;
    let testMember;

    beforeAll(async () => {
        await cleanupTestData();
        
        adminUser = await createTestUser({ username: 'admin_user' });
        await assignRoleToUser(adminUser.user.id, 'superAdmin');
        adminToken = adminUser.token;

        testSociety = await createTestSociety({ created_by: adminUser.user.id });
        testMember = await createTestMember({
            society_id: testSociety.id,
            created_by: adminUser.user.id,
        });
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/member-maintenance-charges', () => {
        it('should get member maintenance charges', async () => {
            const response = await request(app)
                .get('/api/member-maintenance-charges')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.member_maintenance_charges).toBeDefined();
        });

        it('should filter by member_id', async () => {
            const response = await request(app)
                .get(`/api/member-maintenance-charges?member_id=${testMember.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/member-maintenance-charges', () => {
        it('should create member maintenance charge', async () => {
            const chargeData = {
                society_id: testSociety.id,
                member_id: testMember.id,
                charge_name: 'Test Charge',
                charge_type: 'monthly',
                amount: 1000,
                is_active: true,
            };

            const response = await request(app)
                .post('/api/member-maintenance-charges')
                .set(getAuthHeader(adminToken))
                .send(chargeData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.member_maintenance_charge).toBeDefined();
        });
    });
});

