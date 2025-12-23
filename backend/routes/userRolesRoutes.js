const express = require('express');
const router = express.Router();
const userRolesController = require('../controllers/userRolesController');

// Get active user roles
router.get('/user-roles/active', userRolesController.getActiveUserRoles);

// Search user roles by user_id
router.get('/user-roles/user/:user_id', userRolesController.getUserRolesByUserId);
router.get('/user-roles/user/:user_id/active', userRolesController.getActiveUserRolesByUserId);

// Search user roles by society_id
router.get('/user-roles/society/:society_id', userRolesController.getUserRolesBySocietyId);
router.get('/user-roles/society/:society_id/active', userRolesController.getActiveUserRolesBySocietyId);

// Search user roles by role_id
router.get('/user-roles/role/:role_id', userRolesController.getUserRolesByRoleId);
router.get('/user-roles/role/:role_id/active', userRolesController.getActiveUserRolesByRoleId);

// Search user roles by user_id and society_id
router.get('/user-roles/user/:user_id/society/:society_id', userRolesController.getUserRolesByUserAndSociety);

// Advanced search endpoint (query parameters)
router.get('/user-roles/search', userRolesController.searchUserRoles);

// CRUD operations
router.post('/user-roles', userRolesController.createUserRole);
router.get('/user-roles', userRolesController.getUserRoles);
router.get('/user-roles/:id', userRolesController.getUserRoleById);
router.put('/user-roles/:id', userRolesController.updateUserRole);
router.delete('/user-roles/:id', userRolesController.deleteUserRole);

module.exports = router;

