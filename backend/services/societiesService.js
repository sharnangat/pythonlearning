const societiesRepository = require('../repository/societiesRepository');
const logger = require('../config/logger');

// Helper function to validate email format
const isValidEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone format
const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Helper function to validate UUID format
const isValidUUID = (uuid) => {
  if (!uuid) return false; // Return false for null, undefined, or empty string
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to validate URL format
const isValidURL = (url) => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createSociety = async (data) => {
  logger.info('createSociety - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.registration_number || typeof data.registration_number !== 'string' || data.registration_number.trim().length === 0) {
    throw new Error('Registration number is required');
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Society name is required');
  }

  if (!data.society_type || typeof data.society_type !== 'string' || data.society_type.trim().length === 0) {
    throw new Error('Society type is required');
  }

  if (!data.address_line1 || typeof data.address_line1 !== 'string' || data.address_line1.trim().length === 0) {
    throw new Error('Address line 1 is required');
  }

  if (!data.city || typeof data.city !== 'string' || data.city.trim().length === 0) {
    throw new Error('City is required');
  }

  if (!data.state || typeof data.state !== 'string' || data.state.trim().length === 0) {
    throw new Error('State is required');
  }

  if (!data.pincode || typeof data.pincode !== 'string' || data.pincode.trim().length === 0) {
    throw new Error('Pincode is required');
  }

  // Validate optional email field
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Valid email address is required');
  }

  // Validate optional phone fields
  if (data.primary_phone && !isValidPhone(data.primary_phone)) {
    throw new Error('Valid primary phone number is required');
  }

  if (data.secondary_phone && !isValidPhone(data.secondary_phone)) {
    throw new Error('Valid secondary phone number is required');
  }

  // Validate optional website field
  if (data.website && !isValidURL(data.website)) {
    throw new Error('Valid website URL is required');
  }

  // Validate UUID fields
  if (data.founded_by && !isValidUUID(data.founded_by)) {
    throw new Error('Valid UUID is required for founded_by');
  }

  if (data.current_chairman && !isValidUUID(data.current_chairman)) {
    throw new Error('Valid UUID is required for current_chairman');
  }

  // Validate numeric fields
  if (data.total_units !== undefined) {
    const units = parseInt(data.total_units);
    if (isNaN(units) || units < 0) {
      throw new Error('Total units must be a non-negative integer');
    }
  }

  if (data.total_area_sqft !== undefined) {
    const area = parseFloat(data.total_area_sqft);
    if (isNaN(area) || area < 0) {
      throw new Error('Total area must be a non-negative number');
    }
  }

  if (data.common_area_sqft !== undefined) {
    const area = parseFloat(data.common_area_sqft);
    if (isNaN(area) || area < 0) {
      throw new Error('Common area must be a non-negative number');
    }
  }

  if (data.maintenance_due_day !== undefined) {
    const day = parseInt(data.maintenance_due_day);
    if (isNaN(day) || day < 1 || day > 31) {
      throw new Error('Maintenance due day must be between 1 and 31');
    }
  }

  if (data.late_fee_percentage !== undefined) {
    const fee = parseFloat(data.late_fee_percentage);
    if (isNaN(fee) || fee < 0 || fee > 100) {
      throw new Error('Late fee percentage must be between 0 and 100');
    }
  }

  if (data.grace_period_days !== undefined) {
    const days = parseInt(data.grace_period_days);
    if (isNaN(days) || days < 0) {
      throw new Error('Grace period days must be a non-negative integer');
    }
  }

  // Check if registration number already exists (if provided)
  if (data.registration_number) {
    const existingSociety = await societiesRepository.findByRegistrationNumber(data.registration_number);
    if (existingSociety) {
      throw new Error('Society with this registration number already exists');
    }
  }

  const society = await societiesRepository.createSociety(data);
  logger.info('Society created successfully', { registration_number: society.registration_number, name: society.name });
  return society;
};

const getSocieties = async () => {
  const societies = await societiesRepository.getSocieties();
  logger.info('Societies fetched successfully', { count: societies.length });
  return societies;
};

const getSocietyByRegistrationNumber = async (registrationNumber) => {
  const society = await societiesRepository.getSocietyByRegistrationNumber(registrationNumber);
  if (!society) {
    throw new Error('Society not found');
  }
  return society;
};

const getActiveSocieties = async () => {
  const societies = await societiesRepository.getActiveSocieties();
  logger.info('Active societies fetched successfully', { count: societies.length });
  return societies;
};

const getSocietiesByState = async (state) => {
  const societies = await societiesRepository.getSocietiesByState(state);
  logger.info('Societies fetched by state', { state, count: societies.length });
  return societies;
};

const updateSociety = async (registrationNumber, data) => {
  logger.info('updateSociety - Received data', { registrationNumber, keys: Object.keys(data) });

  // Validate optional email field if provided
  if (data.email !== undefined && data.email !== null && !isValidEmail(data.email)) {
    throw new Error('Valid email address is required');
  }

  // Validate optional phone fields if provided
  if (data.primary_phone !== undefined && data.primary_phone !== null && !isValidPhone(data.primary_phone)) {
    throw new Error('Valid primary phone number is required');
  }

  if (data.secondary_phone !== undefined && data.secondary_phone !== null && !isValidPhone(data.secondary_phone)) {
    throw new Error('Valid secondary phone number is required');
  }

  // Validate optional website field if provided
  if (data.website !== undefined && data.website !== null && !isValidURL(data.website)) {
    throw new Error('Valid website URL is required');
  }

  // Validate UUID fields if provided
  if (data.founded_by !== undefined && data.founded_by !== null && !isValidUUID(data.founded_by)) {
    throw new Error('Valid UUID is required for founded_by');
  }

  if (data.current_chairman !== undefined && data.current_chairman !== null && !isValidUUID(data.current_chairman)) {
    throw new Error('Valid UUID is required for current_chairman');
  }

  // Validate numeric fields if provided
  if (data.total_units !== undefined) {
    const units = parseInt(data.total_units);
    if (isNaN(units) || units < 0) {
      throw new Error('Total units must be a non-negative integer');
    }
  }

  if (data.total_area_sqft !== undefined) {
    const area = parseFloat(data.total_area_sqft);
    if (isNaN(area) || area < 0) {
      throw new Error('Total area must be a non-negative number');
    }
  }

  if (data.common_area_sqft !== undefined) {
    const area = parseFloat(data.common_area_sqft);
    if (isNaN(area) || area < 0) {
      throw new Error('Common area must be a non-negative number');
    }
  }

  if (data.maintenance_due_day !== undefined) {
    const day = parseInt(data.maintenance_due_day);
    if (isNaN(day) || day < 1 || day > 31) {
      throw new Error('Maintenance due day must be between 1 and 31');
    }
  }

  if (data.late_fee_percentage !== undefined) {
    const fee = parseFloat(data.late_fee_percentage);
    if (isNaN(fee) || fee < 0 || fee > 100) {
      throw new Error('Late fee percentage must be between 0 and 100');
    }
  }

  if (data.grace_period_days !== undefined) {
    const days = parseInt(data.grace_period_days);
    if (isNaN(days) || days < 0) {
      throw new Error('Grace period days must be a non-negative integer');
    }
  }

  // Check if registration number is being changed and already exists
  if (data.registration_number && data.registration_number !== registrationNumber) {
    const existingSociety = await societiesRepository.findByRegistrationNumber(data.registration_number);
    if (existingSociety) {
      throw new Error('Society with this registration number already exists');
    }
  }

  const existingSociety = await societiesRepository.getSocietyByRegistrationNumber(registrationNumber);
  if (!existingSociety) {
    throw new Error('Society not found');
  }

  const updatedSociety = await societiesRepository.updateSociety(registrationNumber, data);
  logger.info('Society updated successfully', { registration_number: updatedSociety.registration_number });
  return updatedSociety;
};

const deleteSociety = async (registrationNumber) => {
  const existingSociety = await societiesRepository.getSocietyByRegistrationNumber(registrationNumber);
  if (!existingSociety) {
    throw new Error('Society not found');
  }

  await societiesRepository.deleteSociety(registrationNumber);
  logger.info('Society deleted successfully', { registrationNumber });
  return { message: 'Society deleted successfully' };
};

module.exports = {
  createSociety,
  getSocieties,
  getSocietyByRegistrationNumber,
  getActiveSocieties,
  getSocietiesByState,
  updateSociety,
  deleteSociety,
};

