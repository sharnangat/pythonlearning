const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const {
    getAuditLogs,
    getAuditLogById
} = require('../controllers/auditController');

router.use(authenticate);
router.use(checkRole('superAdmin', 'societyAdmin'));

router.get('/', getAuditLogs);
router.get('/:id', getAuditLogById);

module.exports = router;
