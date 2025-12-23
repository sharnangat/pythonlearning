const express = require('express');
const router = express.Router();
const { getSocieties, getSocietyById, createSociety, updateSociety, deleteSociety } = require('../controllers/societyController');
const { authenticate, checkPermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all societies
router.get('/', checkPermission('societies', 'read'), getSocieties);

// Get society by ID
router.get('/:id', checkPermission('societies', 'read'), getSocietyById);

// Create society
router.post('/', checkPermission('societies', 'create'), createSociety);

// Update society
router.put('/:id', checkPermission('societies', 'update'), updateSociety);

// Delete society
router.delete('/:id', checkPermission('societies', 'delete'), deleteSociety);

module.exports = router;

