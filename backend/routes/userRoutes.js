const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser, changePassword } = require('../controllers/userController');
const { authenticate, checkPermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users (requires users.read permission)
router.get('/', checkPermission('users', 'read'), getUsers);

// Get user by ID
router.get('/:id', checkPermission('users', 'read'), getUserById);

// Update user
router.put('/:id', checkPermission('users', 'update'), updateUser);

// Delete user
router.delete('/:id', checkPermission('users', 'delete'), deleteUser);

// Change password
router.post('/:id/change-password', changePassword);
router.post('/change-password', changePassword);

module.exports = router;

