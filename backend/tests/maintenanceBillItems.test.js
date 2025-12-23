const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Maintenance Bill Items API', () => {
    let adminUser;
    let adminToken;
    let testSociety;
    let testMember;
    let testBill;

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

    beforeEach(async () => {
        const { query } = require('../config/database');
        const billResult = await query(`
            INSERT INTO maintenance_bills (
                society_id, member_id, billing_month, total_amount,
                paid_amount, pending_amount, status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [
            testSociety.id,
            testMember.id,
            new Date(),
            0,
            0,
            0,
            'pending',
            adminUser.user.id,
            adminUser.user.id,
        ]);
        testBill = billResult.rows[0];
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/maintenance-bill-items/bill/:bill_id', () => {
        it('should get bill items for a bill', async () => {
            const response = await request(app)
                .get(`/api/maintenance-bill-items/bill/${testBill.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.bill_items).toBeDefined();
        });
    });

    describe('POST /api/maintenance-bill-items', () => {
        it('should create bill item', async () => {
            const itemData = {
                bill_id: testBill.id,
                charge_name: 'Test Charge',
                description: 'Test description',
                quantity: 1,
                unit_rate: 1000,
                amount: 1000,
            };

            const response = await request(app)
                .post('/api/maintenance-bill-items')
                .set(getAuthHeader(adminToken))
                .send(itemData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.bill_item).toBeDefined();
        });
    });
});

