const companyConfigService = require('../services/companyConfigService');
const logger = require('../config/logger');

const createCompanyConfig = async (req, res) => {
  try {
    logger.info('Creating new company config - Received data', req.body);
    const config = await companyConfigService.createCompanyConfig(req.body);
    logger.info('Company config created successfully', { id: config.id, company_name: config.company_name });
    res.status(201).json(config);
  } catch (err) {
    logger.warn('Failed to create company config', { error: err.message, receivedData: req.body });
    res.status(400).json({ message: err.message });
  }
};

const getCompanyConfigs = async (req, res) => {
  try {
    logger.info('Fetching all company configs - Received data', {
      query: req.query,
      params: req.params,
      headers: req.headers,
    });
    const configs = await companyConfigService.getCompanyConfigs();
    logger.info('Company configs fetched successfully', { count: configs.length });
    res.json(configs);
  } catch (err) {
    logger.error('Failed to fetch company configs', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getCompanyConfigById = async (req, res) => {
  try {
    logger.info('Fetching company config by ID - Received data', {
      id: req.params.id,
      params: req.params,
      query: req.query,
    });
    const config = await companyConfigService.getCompanyConfigById(req.params.id);
    logger.info('Company config fetched successfully', { id: config.id });
    res.json(config);
  } catch (err) {
    logger.warn('Failed to fetch company config', { error: err.message, id: req.params.id });
    const status = err.message === 'Company config not found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const getActiveCompanyConfig = async (req, res) => {
  try {
    logger.info('Fetching active company config - Received data', {
      query: req.query,
      params: req.params,
    });
    const config = await companyConfigService.getActiveCompanyConfig();
    logger.info('Active company config fetched successfully', { id: config.id });
    res.json(config);
  } catch (err) {
    logger.warn('Failed to fetch active company config', { error: err.message });
    const status = err.message === 'No active company config found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const updateCompanyConfig = async (req, res) => {
  try {
    logger.info('Updating company config - Received data', {
      id: req.params.id,
      body: req.body,
      params: req.params,
    });
    const config = await companyConfigService.updateCompanyConfig(req.params.id, req.body);
    logger.info('Company config updated successfully', { id: config.id });
    res.json(config);
  } catch (err) {
    logger.warn('Failed to update company config', {
      error: err.message,
      id: req.params.id,
      receivedData: req.body,
    });
    const status = err.message === 'Company config not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const deleteCompanyConfig = async (req, res) => {
  try {
    logger.info('Deleting company config - Received data', {
      id: req.params.id,
      params: req.params,
    });
    const result = await companyConfigService.deleteCompanyConfig(req.params.id);
    logger.info('Company config deleted successfully', { id: req.params.id });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete company config', { error: err.message, id: req.params.id });
    const status = err.message === 'Company config not found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  createCompanyConfig,
  getCompanyConfigs,
  getCompanyConfigById,
  getActiveCompanyConfig,
  updateCompanyConfig,
  deleteCompanyConfig,
};

