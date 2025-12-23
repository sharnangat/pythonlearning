const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead
} = require('../controllers/notificationController');

router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', markNotificationAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;
