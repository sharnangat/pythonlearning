const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getMaintenanceCharges,
    getMaintenanceChargeById,
    createMaintenanceCharge,
    updateMaintenanceCharge,
    deleteMaintenanceCharge
} = require('../controllers/maintenanceChargeController');

router.use(authenticate);

router.get('/', checkPermission('maintenance_charges', 'read'), getMaintenanceCharges);
router.get('/:id', checkPermission('maintenance_charges', 'read'), getMaintenanceChargeById);
router.post('/', checkPermission('maintenance_charges', 'create'), createMaintenanceCharge);
router.put('/:id', checkPermission('maintenance_charges', 'update'), updateMaintenanceCharge);
router.delete('/:id', checkPermission('maintenance_charges', 'delete'), deleteMaintenanceCharge);

module.exports = router;
