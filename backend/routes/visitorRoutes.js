const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const {
    getVisitors,
    createVisitor,
    checkoutVisitor,
    preRegisterVisitor
} = require('../controllers/visitorController');

router.use(authenticate);

router.get('/', checkPermission('visitors', 'read'), getVisitors);
router.post('/', checkPermission('visitors', 'create'), createVisitor);
router.put('/:id/checkout', checkPermission('visitors', 'check_out'), checkoutVisitor);
router.post('/pre-register', checkPermission('visitors', 'pre_register'), preRegisterVisitor);

module.exports = router;
