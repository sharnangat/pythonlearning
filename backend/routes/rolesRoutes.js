const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Get active roles
router.get('/roles/active', rolesController.getActiveRoles);

// CRUD operations
router.post('/roles', rolesController.createRole);
router.get('/roles', rolesController.getRoles);
router.get('/roles/:id', rolesController.getRoleById);
router.put('/roles/:id', rolesController.updateRole);
router.delete('/roles/:id', rolesController.deleteRole);

module.exports = router;

