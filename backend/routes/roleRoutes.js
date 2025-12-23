const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getRoles,
    getPermissions,
    assignRoleToUser
} = require('../controllers/roleController');

router.use(authenticate);

router.get('/', checkPermission('roles', 'read'), getRoles);
router.get('/permissions', checkPermission('permissions', 'read'), getPermissions);
router.post('/assign', checkPermission('roles', 'assign'), assignRoleToUser);

module.exports = router;
