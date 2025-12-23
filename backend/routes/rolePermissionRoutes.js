const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getRolePermissions,
    assignPermissionToRole,
    updateRolePermission,
    removePermissionFromRole
} = require('../controllers/rolePermissionController');

router.use(authenticate);

router.get('/', checkPermission('permissions', 'read'), getRolePermissions);
router.post('/', checkPermission('permissions', 'assign'), assignPermissionToRole);
router.put('/:id', checkPermission('permissions', 'assign'), updateRolePermission);
router.delete('/:id', checkPermission('permissions', 'assign'), removePermissionFromRole);

module.exports = router;
