const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assetsController');

// Get active assets (most common use case)
router.get('/assets/active', assetsController.getActiveAssets);

// Get assets by society_id
router.get('/assets/society/:society_id', assetsController.getAssetsBySocietyId);

// Get active assets by society_id
router.get('/assets/society/:society_id/active', assetsController.getActiveAssetsBySocietyId);

// CRUD operations
router.post('/assets', assetsController.createAsset);
router.get('/assets', assetsController.getAssets);
router.get('/assets/:id', assetsController.getAssetById);
router.put('/assets/:id', assetsController.updateAsset);
router.delete('/assets/:id', assetsController.deleteAsset);

module.exports = router;

