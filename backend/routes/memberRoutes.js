const express = require('express');
const router = express.Router();
const { getMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { authenticate, checkPermission } = require('../middleware/auth');

router.use(authenticate);

router.get('/', checkPermission('members', 'read'), getMembers);
router.get('/:id', checkPermission('members', 'read'), getMemberById);
router.post('/', checkPermission('members', 'create'), createMember);
router.put('/:id', checkPermission('members', 'update'), updateMember);
router.delete('/:id', checkPermission('members', 'delete'), deleteMember);

module.exports = router;

