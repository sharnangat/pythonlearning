const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    getMaintenanceBills,
    getMaintenanceBillById
} = require('../controllers/maintenanceController');

router.use(authenticate);

router.get('/requests', checkPermission('maintenance', 'read'), getMaintenanceRequests);
router.post('/requests', checkPermission('maintenance', 'create'), createMaintenanceRequest);
router.put('/requests/:id', checkPermission('maintenance', 'update'), updateMaintenanceRequest);
router.get('/bills', checkPermission('maintenance_bills', 'read'), getMaintenanceBills);
router.get('/bills/:id', checkPermission('maintenance_bills', 'read'), getMaintenanceBillById);

module.exports = router;

