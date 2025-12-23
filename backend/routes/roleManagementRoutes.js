const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');

router.use(authenticate);

router.post('/', checkPermission('roles', 'create'), createRole);
router.put('/:id', checkPermission('roles', 'update'), updateRole);
router.delete('/:id', checkPermission('roles', 'delete'), deleteRole);

module.exports = router;
