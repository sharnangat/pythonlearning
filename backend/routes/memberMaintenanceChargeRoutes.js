const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getMemberMaintenanceCharges,
    getMemberMaintenanceChargeById,
    createMemberMaintenanceCharge,
    updateMemberMaintenanceCharge,
    deleteMemberMaintenanceCharge
} = require('../controllers/memberMaintenanceChargeController');

router.use(authenticate);

router.get('/', checkPermission('maintenance_charges', 'read'), getMemberMaintenanceCharges);
router.get('/:id', checkPermission('maintenance_charges', 'read'), getMemberMaintenanceChargeById);
router.post('/', checkPermission('maintenance_charges', 'create'), createMemberMaintenanceCharge);
router.put('/:id', checkPermission('maintenance_charges', 'update'), updateMemberMaintenanceCharge);
router.delete('/:id', checkPermission('maintenance_charges', 'delete'), deleteMemberMaintenanceCharge);

module.exports = router;
