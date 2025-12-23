const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, createTestMember, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Payments API', () => {
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

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/payments', () => {
        it('should get all payments', async () => {
            const response = await request(app)
                .get('/api/payments')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.payments).toBeDefined();
            expect(Array.isArray(response.body.data.payments)).toBe(true);
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/payments?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/payments/maintenance', () => {
        beforeEach(async () => {
            testBill = await createTestMaintenanceBill();
        });

        it('should process maintenance payment successfully', async () => {
            const paymentData = {
                bill_id: testBill.id,
                payment_amount: 1000,
                payment_method: 'cash',
                payment_reference: 'REF123',
            };

            const response = await request(app)
                .post('/api/payments/maintenance')
                .set(getAuthHeader(adminToken))
                .send(paymentData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.payment).toBeDefined();
            expect(response.body.data.payment.payment_amount).toBe(paymentData.payment_amount);
        });

        it('should fail with invalid bill_id', async () => {
            const paymentData = {
                bill_id: '00000000-0000-0000-0000-000000000999',
                payment_amount: 1000,
                payment_method: 'cash',
            };

            await request(app)
                .post('/api/payments/maintenance')
                .set(getAuthHeader(adminToken))
                .send(paymentData)
                .expect(404);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/payments/maintenance')
                .set(getAuthHeader(adminToken))
                .send({
                    payment_amount: 1000,
                    // Missing bill_id and payment_method
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    async function createTestMaintenanceBill() {
        const { query } = require('../config/database');
        const result = await query(`
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
            5000,
            0,
            5000,
            'pending',
            adminUser.user.id,
            adminUser.user.id,
        ]);
        return result.rows[0];
    }
});

