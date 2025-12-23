const express = require('express');
const router = express.Router();
const companyConfigController = require('../controllers/companyConfigController');

// CRUD operations
router.post('/company-config', companyConfigController.createCompanyConfig);
router.get('/company-config', companyConfigController.getCompanyConfigs);
// Get active company config (must be before /:id route to avoid conflict)
router.get('/company-config/active', companyConfigController.getActiveCompanyConfig);
router.get('/company-config/:id', companyConfigController.getCompanyConfigById);
router.put('/company-config/:id', companyConfigController.updateCompanyConfig);
router.delete('/company-config/:id', companyConfigController.deleteCompanyConfig);

module.exports = router;

