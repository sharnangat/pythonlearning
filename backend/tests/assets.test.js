const request = require('supertest');
const app = require('../server');
const { createTestUser, createTestSociety, assignRoleToUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Assets API', () => {
    let adminUser;
    let adminToken;
    let testSociety;
    let testAsset;

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

    describe('GET /api/assets', () => {
        beforeEach(async () => {
            testAsset = await createTestAsset();
        });

        it('should get all assets', async () => {
            const response = await request(app)
                .get('/api/assets')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.assets).toBeDefined();
            expect(Array.isArray(response.body.data.assets)).toBe(true);
        });

        it('should filter by society_id', async () => {
            const response = await request(app)
                .get(`/api/assets?society_id=${testSociety.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should filter by asset_type', async () => {
            const response = await request(app)
                .get('/api/assets?asset_type=equipment')
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/assets', () => {
        it('should create asset successfully', async () => {
            const assetData = {
                society_id: testSociety.id,
                asset_name: `Test Asset ${Date.now()}`,
                asset_type: 'equipment',
                asset_code: `AST${Date.now()}`,
                description: 'Test asset description',
                location: 'Building A',
                purchase_cost: 10000,
                current_value: 8000,
            };

            const response = await request(app)
                .post('/api/assets')
                .set(getAuthHeader(adminToken))
                .send(assetData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.asset).toBeDefined();
            expect(response.body.data.asset.asset_name).toBe(assetData.asset_name);
        });

        it('should fail without required fields', async () => {
            const response = await request(app)
                .post('/api/assets')
                .set(getAuthHeader(adminToken))
                .send({
                    asset_name: 'Test',
                    // Missing society_id and asset_type
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/assets/:id', () => {
        beforeEach(async () => {
            testAsset = await createTestAsset();
        });

        it('should get asset by ID', async () => {
            const response = await request(app)
                .get(`/api/assets/${testAsset.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.asset).toBeDefined();
            expect(response.body.data.asset.id).toBe(testAsset.id);
        });
    });

    describe('PUT /api/assets/:id', () => {
        beforeEach(async () => {
            testAsset = await createTestAsset();
        });

        it('should update asset successfully', async () => {
            const updateData = {
                asset_name: 'Updated Asset Name',
                current_value: 9000,
                status: 'maintenance',
            };

            const response = await request(app)
                .put(`/api/assets/${testAsset.id}`)
                .set(getAuthHeader(adminToken))
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.asset.asset_name).toBe(updateData.asset_name);
        });
    });

    describe('DELETE /api/assets/:id', () => {
        it('should delete asset successfully', async () => {
            const assetToDelete = await createTestAsset();

            const response = await request(app)
                .delete(`/api/assets/${assetToDelete.id}`)
                .set(getAuthHeader(adminToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    async function createTestAsset() {
        const { query } = require('../config/database');
        const result = await query(`
            INSERT INTO assets (
                society_id, asset_name, asset_type, asset_code, description,
                location, purchase_cost, current_value, status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            testSociety.id,
            `Test Asset ${Date.now()}`,
            'equipment',
            `AST${Date.now()}`,
            'Test description',
            'Building A',
            10000,
            8000,
            'active',
            adminUser.user.id,
            adminUser.user.id,
        ]);
        return result.rows[0];
    }
});

