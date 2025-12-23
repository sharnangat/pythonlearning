const express = require('express');
const router = express.Router();
const { authenticate, checkPermission, checkRole } = require('../middleware/auth');
const {
    createSubscriptionPlan,
    updateSubscriptionPlan,
    createSocietySubscription,
    updateSocietySubscription
} = require('../controllers/subscriptionController');

router.use(authenticate);

router.post('/plans', checkRole('superAdmin'), createSubscriptionPlan);
router.put('/plans/:id', checkRole('superAdmin'), updateSubscriptionPlan);
router.post('/', checkPermission('subscriptions', 'create'), createSocietySubscription);
router.put('/:id', checkPermission('subscriptions', 'update'), updateSocietySubscription);

module.exports = router;
