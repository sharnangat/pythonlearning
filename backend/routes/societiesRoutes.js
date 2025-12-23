const express = require('express');
const router = express.Router();
const societiesController = require('../controllers/societiesController');

// Get active societies (most common use case)
router.get('/societies/active', societiesController.getActiveSocieties);

// Get societies by state
router.get('/societies/state/:state', societiesController.getSocietiesByState);

// CRUD operations
router.post('/societies', societiesController.createSociety);
router.get('/societies', societiesController.getSocieties);
router.get('/societies/:registration_number', societiesController.getSocietyByRegistrationNumber);
router.put('/societies/:registration_number', societiesController.updateSociety);
router.delete('/societies/:registration_number', societiesController.deleteSociety);

module.exports = router;

