const express = require('express');
const multer = require('multer');
const router = express.Router();
const membersController = require('../controllers/membersController');

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload an Excel file (.xlsx, .xls)'), false);
    }
  },
});

// Get active members (most common use case)
router.get('/members/active', membersController.getActiveMembers);

// Get members by society_id
router.get('/members/society/:society_id', membersController.getMembersBySocietyId);

// Get active members by society_id
router.get('/members/society/:society_id/active', membersController.getActiveMembersBySocietyId);

// Get members by user_id
router.get('/members/user/:user_id', membersController.getMembersByUserId);

// CRUD operations
router.post('/members', membersController.createMember);
router.post('/members/upload-excel', upload.single('file'), membersController.uploadMembersFromExcel);
router.get('/members', membersController.getMembers);
router.get('/members/:id', membersController.getMemberById);
// Update by membership_number (must be before /:id route to avoid conflicts)
router.put('/members/membership/:membership_number', membersController.updateMemberByMembershipNumber);
router.put('/members/:id', membersController.updateMember);
router.delete('/members/:id', membersController.deleteMember);

module.exports = router;

