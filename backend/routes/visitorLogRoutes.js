const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getVisitorLogs,
    getVisitorLogById
} = require('../controllers/visitorLogController');

router.use(authenticate);

router.get('/', checkPermission('visitors', 'read'), getVisitorLogs);
router.get('/:id', checkPermission('visitors', 'read'), getVisitorLogById);

module.exports = router;
