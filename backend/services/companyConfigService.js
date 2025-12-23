const companyConfigRepository = require('../repository/companyConfigRepository');
const logger = require('../config/logger');

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone format
const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

const createCompanyConfig = async (data) => {
  logger.info('createCompanyConfig - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.company_email || !isValidEmail(data.company_email)) {
    throw new Error('Valid company email address is required');
  }

  if (!data.company_phone || !isValidPhone(data.company_phone)) {
    throw new Error('Valid company phone number is required');
  }

  // Validate optional email fields if provided
  if (data.support_email && !isValidEmail(data.support_email)) {
    throw new Error('Valid support email address is required');
  }

  if (data.sales_email && !isValidEmail(data.sales_email)) {
    throw new Error('Valid sales email address is required');
  }

  // Validate optional phone fields if provided
  if (data.support_phone && !isValidPhone(data.support_phone)) {
    throw new Error('Valid support phone number is required');
  }

  if (data.sales_phone && !isValidPhone(data.sales_phone)) {
    throw new Error('Valid sales phone number is required');
  }

  // Validate numeric fields
  if (data.default_rate_per_member !== undefined) {
    const rate = parseFloat(data.default_rate_per_member);
    if (isNaN(rate) || rate < 0) {
      throw new Error('Default rate per member must be a positive number');
    }
  }

  if (data.trial_period_days !== undefined) {
    const days = parseInt(data.trial_period_days);
    if (isNaN(days) || days < 0) {
      throw new Error('Trial period days must be a positive integer');
    }
  }

  if (data.max_free_members !== undefined) {
    const members = parseInt(data.max_free_members);
    if (isNaN(members) || members < 0) {
      throw new Error('Max free members must be a positive integer');
    }
  }

  // Check if there's already an active config (optional - you might want multiple configs)
  // For now, we'll allow multiple configs

  const companyConfig = await companyConfigRepository.createCompanyConfig(data);
  logger.info('Company config created successfully', { id: companyConfig.id, company_name: companyConfig.company_name });
  return companyConfig;
};

const getCompanyConfigs = async () => {
  const configs = await companyConfigRepository.getCompanyConfigs();
  logger.info('Company configs fetched successfully', { count: configs.length });
  return configs;
};

const getCompanyConfigById = async (id) => {
  const config = await companyConfigRepository.getCompanyConfigById(id);
  if (!config) {
    throw new Error('Company config not found');
  }
  return config;
};

const getActiveCompanyConfig = async () => {
  const config = await companyConfigRepository.getActiveCompanyConfig();
  if (!config) {
    throw new Error('No active company config found');
  }
  return config;
};

const updateCompanyConfig = async (id, data) => {
  logger.info('updateCompanyConfig - Received data', { id, keys: Object.keys(data) });

  // Validate email fields if provided
  if (data.company_email && !isValidEmail(data.company_email)) {
    throw new Error('Valid company email address is required');
  }

  if (data.support_email && !isValidEmail(data.support_email)) {
    throw new Error('Valid support email address is required');
  }

  if (data.sales_email && !isValidEmail(data.sales_email)) {
    throw new Error('Valid sales email address is required');
  }

  // Validate phone fields if provided
  if (data.company_phone && !isValidPhone(data.company_phone)) {
    throw new Error('Valid company phone number is required');
  }

  if (data.support_phone && !isValidPhone(data.support_phone)) {
    throw new Error('Valid support phone number is required');
  }

  if (data.sales_phone && !isValidPhone(data.sales_phone)) {
    throw new Error('Valid sales phone number is required');
  }

  // Validate numeric fields if provided
  if (data.default_rate_per_member !== undefined) {
    const rate = parseFloat(data.default_rate_per_member);
    if (isNaN(rate) || rate < 0) {
      throw new Error('Default rate per member must be a positive number');
    }
  }

  if (data.trial_period_days !== undefined) {
    const days = parseInt(data.trial_period_days);
    if (isNaN(days) || days < 0) {
      throw new Error('Trial period days must be a positive integer');
    }
  }

  if (data.max_free_members !== undefined) {
    const members = parseInt(data.max_free_members);
    if (isNaN(members) || members < 0) {
      throw new Error('Max free members must be a positive integer');
    }
  }

  const existingConfig = await companyConfigRepository.getCompanyConfigById(id);
  if (!existingConfig) {
    throw new Error('Company config not found');
  }

  const updatedConfig = await companyConfigRepository.updateCompanyConfig(id, data);
  logger.info('Company config updated successfully', { id: updatedConfig.id });
  return updatedConfig;
};

const deleteCompanyConfig = async (id) => {
  const existingConfig = await companyConfigRepository.getCompanyConfigById(id);
  if (!existingConfig) {
    throw new Error('Company config not found');
  }

  await companyConfigRepository.deleteCompanyConfig(id);
  logger.info('Company config deleted successfully', { id });
  return { message: 'Company config deleted successfully' };
};

module.exports = {
  createCompanyConfig,
  getCompanyConfigs,
  getCompanyConfigById,
  getActiveCompanyConfig,
  updateCompanyConfig,
  deleteCompanyConfig,
};

