const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getSubscriptionPlans,
    getSocietySubscriptions
} = require('../controllers/subscriptionController');

router.use(authenticate);

router.get('/plans', checkPermission('plans', 'read'), getSubscriptionPlans);
router.get('/', checkPermission('subscriptions', 'read'), getSocietySubscriptions);

module.exports = router;
