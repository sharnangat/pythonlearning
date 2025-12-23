const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Login route - must be before /users routes to avoid conflicts
router.post('/login', userController.loginUser);

// Registration route
router.post('/user/register', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
