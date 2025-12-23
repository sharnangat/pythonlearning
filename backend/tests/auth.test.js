const request = require('supertest');
const app = require('../server');
const { createTestUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');
const { query } = require('../config/database');

describe('Authentication API', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        await cleanupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                username: `testuser_${Date.now()}`,
                email: `test_${Date.now()}@example.com`,
                password: 'Test123456!',
                first_name: 'Test',
                last_name: 'User',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.user.username).toBe(userData.username);
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined();
        });

        it('should fail with duplicate username', async () => {
            const userData = {
                username: `duplicate_${Date.now()}`,
                email: `unique_${Date.now()}@example.com`,
                password: 'Test123456!',
            };

            // Create first user
            await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            // Try to create duplicate
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });

        it('should fail with duplicate email', async () => {
            const userData1 = {
                username: `user1_${Date.now()}`,
                email: `same_${Date.now()}@example.com`,
                password: 'Test123456!',
            };

            const userData2 = {
                username: `user2_${Date.now()}`,
                email: userData1.email, // Same email
                password: 'Test123456!',
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData1)
                .expect(201);

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData2)
                .expect(409);

            expect(response.body.success).toBe(false);
        });

        it('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    // Missing email and password
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            testUser = await createTestUser();
        });

        it('should login with username successfully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: testUser.user.username,
                    password: testUser.password,
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.id).toBe(testUser.user.id);
            authToken = response.body.data.token;
        });

        it('should login with email successfully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.user.email,
                    password: testUser.password,
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: testUser.user.username,
                    password: 'WrongPassword123!',
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });

        it('should fail with non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'nonexistentuser',
                    password: 'Test123456!',
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should fail with missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'Test123456!',
                    // Missing username/email
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/profile', () => {
        beforeEach(async () => {
            testUser = await createTestUser();
            authToken = testUser.token;
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.user.id).toBe(testUser.user.id);
            expect(response.body.data.user.username).toBe(testUser.user.username);
        });

        it('should fail without token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Authentication required');
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set(getAuthHeader('invalid-token'))
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/logout', () => {
        beforeEach(async () => {
            testUser = await createTestUser();
            authToken = testUser.token;
        });

        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Logged out');
        });

        it('should fail without token', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
});

