const request = require('supertest');
const app = require('../server');
const { createTestUser, cleanupTestData, getAuthHeader } = require('./helpers/testHelpers');

describe('Notifications API', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        await cleanupTestData();
        testUser = await createTestUser();
        authToken = testUser.token;
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe('GET /api/notifications', () => {
        it('should get notifications for current user', async () => {
            const response = await request(app)
                .get('/api/notifications')
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.notifications).toBeDefined();
            expect(Array.isArray(response.body.data.notifications)).toBe(true);
        });

        it('should filter by is_read', async () => {
            const response = await request(app)
                .get('/api/notifications?is_read=false')
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/notifications?page=1&limit=10')
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.pagination).toBeDefined();
        });

        it('should fail without authentication', async () => {
            await request(app)
                .get('/api/notifications')
                .expect(401);
        });
    });

    describe('PUT /api/notifications/:id/read', () => {
        it('should mark notification as read', async () => {
            const notification = await createTestNotification();
            
            const response = await request(app)
                .put(`/api/notifications/${notification.id}/read`)
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.notification.is_read).toBe(true);
        });

        it('should return 404 for non-existent notification', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000999';
            await request(app)
                .put(`/api/notifications/${fakeId}/read`)
                .set(getAuthHeader(authToken))
                .expect(404);
        });
    });

    describe('PUT /api/notifications/read-all', () => {
        it('should mark all notifications as read', async () => {
            await createTestNotification();
            await createTestNotification();

            const response = await request(app)
                .put('/api/notifications/read-all')
                .set(getAuthHeader(authToken))
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    async function createTestNotification() {
        const { query } = require('../config/database');
        const result = await query(`
            INSERT INTO notifications (user_id, title, message, type, is_read)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            testUser.user.id,
            'Test Notification',
            'Test message',
            'info',
            false,
        ]);
        return result.rows[0];
    }
});

