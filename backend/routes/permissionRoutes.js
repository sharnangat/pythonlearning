const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const {
    getPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
} = require('../controllers/permissionController');

router.use(authenticate);
router.use(checkRole('superAdmin'));

router.get('/', getPermissions);
router.get('/:id', getPermissionById);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

module.exports = router;
