const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getConfigs,
    updateConfig
} = require('../controllers/configController');

router.use(authenticate);

router.get('/', checkPermission('config', 'read'), getConfigs);
router.put('/:id', checkPermission('config', 'update'), updateConfig);

module.exports = router;
