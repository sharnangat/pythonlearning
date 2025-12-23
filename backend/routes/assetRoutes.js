const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

router.use(authenticate);

router.get('/', checkPermission('assets', 'read'), getAssets);
router.get('/:id', checkPermission('assets', 'read'), getAssetById);
router.post('/', checkPermission('assets', 'create'), createAsset);
router.put('/:id', checkPermission('assets', 'update'), updateAsset);
router.delete('/:id', checkPermission('assets', 'delete'), deleteAsset);

module.exports = router;

