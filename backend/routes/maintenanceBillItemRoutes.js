const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getBillItems,
    createBillItem,
    updateBillItem,
    deleteBillItem
} = require('../controllers/maintenanceBillItemController');

router.use(authenticate);

router.get('/bill/:bill_id', checkPermission('maintenance_bills', 'read'), getBillItems);
router.post('/', checkPermission('maintenance_bills', 'update'), createBillItem);
router.put('/:id', checkPermission('maintenance_bills', 'update'), updateBillItem);
router.delete('/:id', checkPermission('maintenance_bills', 'update'), deleteBillItem);

module.exports = router;
