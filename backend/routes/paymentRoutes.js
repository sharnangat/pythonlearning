const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getPayments,
    processMaintenancePayment
} = require('../controllers/paymentController');

router.use(authenticate);

router.get('/', checkPermission('payments', 'read'), getPayments);
router.post('/maintenance', checkPermission('payments', 'create'), processMaintenancePayment);

module.exports = router;
