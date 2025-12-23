const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');

// Get active permissions (must be before /:id route)
router.get('/permissions/active', permissionsController.getActivePermissions);

// Get permissions by module
router.get('/permissions/module/:module', permissionsController.getPermissionsByModule);
router.get('/permissions/module/:module/active', permissionsController.getActivePermissionsByModule);

// Get permission by code
router.get('/permissions/code/:code', permissionsController.getPermissionByCode);

// Get permission by name
router.get('/permissions/name/:name', permissionsController.getPermissionByName);

// CRUD operations
router.post('/permissions', permissionsController.createPermission);
router.get('/permissions', permissionsController.getPermissions);
router.get('/permissions/:id', permissionsController.getPermissionById);
router.put('/permissions/:id', permissionsController.updatePermission);
router.delete('/permissions/:id', permissionsController.deletePermission);

module.exports = router;

