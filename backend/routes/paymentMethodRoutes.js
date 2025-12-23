const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
} = require('../controllers/paymentMethodController');

router.use(authenticate);

router.get('/', checkPermission('payment_methods', 'read'), getPaymentMethods);
router.get('/:id', checkPermission('payment_methods', 'read'), getPaymentMethodById);
router.post('/', checkPermission('payment_methods', 'create'), createPaymentMethod);
router.put('/:id', checkPermission('payment_methods', 'update'), updatePaymentMethod);
router.delete('/:id', checkPermission('payment_methods', 'delete'), deletePaymentMethod);

module.exports = router;
