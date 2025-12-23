const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getUserRoles,
    getUserRoleById,
    updateUserRole,
    revokeUserRole
} = require('../controllers/userRoleController');

router.use(authenticate);

router.get('/', checkPermission('roles', 'read'), getUserRoles);
router.get('/:id', checkPermission('roles', 'read'), getUserRoleById);
router.put('/:id', checkPermission('roles', 'assign'), updateUserRole);
router.delete('/:id', checkPermission('roles', 'assign'), revokeUserRole);

module.exports = router;
