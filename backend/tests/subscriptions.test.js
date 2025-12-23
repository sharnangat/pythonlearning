const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Subscriptions API', () => {
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

    describe('GET /api/subscriptions/plans', () => {
        it('should get subscription plans', async () => {
            const response = await request(app)
                .get('/api/subscriptions/plans')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.plans).toBeDefined();
            expect(Array.isArray(response.body.data.plans)).toBe(true);
        });
    });

    describe('POST /api/subscriptions/plans', () => {
        it('should create subscription plan (superAdmin only)', async () => {
            const planData = {
                plan_name: `test_plan_${Date.now()}`,
                display_name: 'Test Plan',
                description: 'Test plan description',
                base_price: 1000,
                price_per_member: 50,
                min_members: 10,
                max_members: 100,
                features: { feature1: true },
            };

            const response = await request(app)
                .post('/api/subscriptions/plans')
                .set(getAuthHeader(adminToken))
                .send(planData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.plan).toBeDefined();
            expect(response.body.data.plan.plan_name).toBe(planData.plan_name);
        });
    });

    describe('GET /api/subscriptions', () => {
        it('should get society subscriptions', async () => {
            const response = await request(app)
                .get('/api/subscriptions')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.subscriptions).toBeDefined();
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/subscriptions?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/subscriptions', () => {
        it('should create society subscription', async () => {
            const { query } = require('../config/database');
            const planResult = await query("SELECT id FROM subscription_plans WHERE is_active = TRUE LIMIT 1");
            
            if (planResult.rows.length === 0) {
                // Create a plan first
                await query(`
                    INSERT INTO subscription_plans (
                        plan_name, display_name, base_price, price_per_member,
                        is_active, created_by, updated_by
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id
                `, ['test_plan', 'Test Plan', 1000, 50, true, adminUser.user.id, adminUser.user.id]);
                
                const newPlan = await query("SELECT id FROM subscription_plans WHERE plan_name = 'test_plan' LIMIT 1");
                planResult.rows[0] = newPlan.rows[0];
            }

            const subscriptionData = {
                society_id: testSociety.id,
                plan_id: planResult.rows[0].id,
                member_count: 50,
                auto_renew: true,
            };

            const response = await request(app)
                .post('/api/subscriptions')
                .set(getAuthHeader(adminToken))
                .send(subscriptionData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.subscription).toBeDefined();
        });
    });
});

