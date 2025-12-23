const assetsRepository = require('../repository/assetsRepository');
const Society = require('../models/societies');
const logger = require('../config/logger');

// Helper function to validate UUID format
const isValidUUID = (uuid) => {
  if (!uuid) return false; // Return false for null, undefined, or empty string
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  if (!dateString) return true; // Optional field
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Helper function to validate date range
const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

// Helper function to validate numeric value
const isValidNumeric = (value, min = null, max = null) => {
  if (value === undefined || value === null) return true; // Optional field
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

// Helper function to sanitize string fields to their max lengths
const sanitizeStringFields = (data) => {
  const sanitized = { ...data };
  
  const fieldMaxLengths = {
    asset_code: 50,
    name: 255,
    category: 100,
    location: 255,
    vendor: 255,
    condition: 50,
  };
  
  Object.keys(fieldMaxLengths).forEach((field) => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      if (typeof sanitized[field] === 'string') {
        sanitized[field] = sanitized[field].trim().substring(0, fieldMaxLengths[field]);
        if (sanitized[field].length === 0 && field !== 'asset_code' && field !== 'name') {
          sanitized[field] = null;
        }
      }
    }
  });
  
  return sanitized;
};

const createAsset = async (data) => {
  logger.info('createAsset - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.society_id || !isValidUUID(data.society_id)) {
    throw new Error('Valid society_id (UUID) is required');
  }

  if (!data.asset_code || typeof data.asset_code !== 'string' || data.asset_code.trim().length === 0) {
    throw new Error('Asset code is required');
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Asset name is required');
  }

  // Verify society exists
  const society = await Society.findByPk(data.society_id);
  if (!society) {
    throw new Error('Society with the provided society_id does not exist');
  }

  // Check if asset_code already exists
  const existingAsset = await assetsRepository.getAssetByAssetCode(data.asset_code);
  if (existingAsset) {
    throw new Error('Asset with this asset code already exists');
  }

  // Validate date fields
  if (data.purchase_date && !isValidDate(data.purchase_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for purchase_date');
  }

  if (data.warranty_expiry && !isValidDate(data.warranty_expiry)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for warranty_expiry');
  }

  if (data.last_maintenance_date && !isValidDate(data.last_maintenance_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for last_maintenance_date');
  }

  if (data.next_maintenance_date && !isValidDate(data.next_maintenance_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for next_maintenance_date');
  }

  // Validate date ranges
  if (data.purchase_date && data.warranty_expiry && !isValidDateRange(data.purchase_date, data.warranty_expiry)) {
    throw new Error('warranty_expiry must be greater than or equal to purchase_date');
  }

  if (data.last_maintenance_date && data.next_maintenance_date && !isValidDateRange(data.last_maintenance_date, data.next_maintenance_date)) {
    throw new Error('next_maintenance_date must be greater than or equal to last_maintenance_date');
  }

  // Validate numeric fields
  if (data.purchase_cost !== undefined && data.purchase_cost !== null && !isValidNumeric(data.purchase_cost, 0)) {
    throw new Error('Purchase cost must be a valid positive number');
  }

  if (data.current_value !== undefined && data.current_value !== null && !isValidNumeric(data.current_value, 0)) {
    throw new Error('Current value must be a valid positive number');
  }

  if (data.depreciation_rate !== undefined && data.depreciation_rate !== null && !isValidNumeric(data.depreciation_rate, 0, 100)) {
    throw new Error('Depreciation rate must be a valid number between 0 and 100');
  }

  if (data.warranty_period !== undefined && data.warranty_period !== null) {
    const period = parseInt(data.warranty_period);
    if (isNaN(period) || period < 0) {
      throw new Error('Warranty period must be a valid non-negative integer');
    }
  }

  if (data.maintenance_frequency !== undefined && data.maintenance_frequency !== null) {
    const frequency = parseInt(data.maintenance_frequency);
    if (isNaN(frequency) || frequency < 0) {
      throw new Error('Maintenance frequency must be a valid non-negative integer');
    }
  }

  // Validate boolean field
  if (data.is_active !== undefined && data.is_active !== null && typeof data.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  // Sanitize string fields
  const sanitizedData = sanitizeStringFields(data);

  const asset = await assetsRepository.createAsset(sanitizedData);
  logger.info('Asset created successfully', { id: asset.id, asset_code: asset.asset_code });
  return asset;
};

const getAssets = async () => {
  const assets = await assetsRepository.getAssets();
  logger.info('Assets fetched successfully', { count: assets.length });
  return assets;
};

const getAssetById = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid asset ID (UUID) is required');
  }
  const asset = await assetsRepository.getAssetById(id);
  if (!asset) {
    throw new Error('Asset not found');
  }
  return asset;
};

const getAssetsBySocietyId = async (societyId) => {
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const assets = await assetsRepository.getAssetsBySocietyId(societyId);
  logger.info('Assets fetched by society_id', { societyId, count: assets.length });
  return assets;
};

const getActiveAssets = async () => {
  const assets = await assetsRepository.getActiveAssets();
  logger.info('Active assets fetched successfully', { count: assets.length });
  return assets;
};

const getActiveAssetsBySocietyId = async (societyId) => {
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const assets = await assetsRepository.getActiveAssetsBySocietyId(societyId);
  logger.info('Active assets fetched by society_id', { societyId, count: assets.length });
  return assets;
};

const updateAsset = async (id, data) => {
  logger.info('updateAsset - Received data', { id, keys: Object.keys(data) });

  if (!isValidUUID(id)) {
    throw new Error('Valid asset ID (UUID) is required');
  }

  // Validate UUID if provided
  if (data.society_id !== undefined && data.society_id !== null && !isValidUUID(data.society_id)) {
    throw new Error('Valid UUID is required for society_id');
  }

  // Verify society exists if being updated
  if (data.society_id) {
    const society = await Society.findByPk(data.society_id);
    if (!society) {
      throw new Error('Society with the provided society_id does not exist');
    }
  }

  // Validate asset_code if being updated
  if (data.asset_code !== undefined && data.asset_code !== null) {
    if (typeof data.asset_code !== 'string' || data.asset_code.trim().length === 0) {
      throw new Error('Asset code must be a non-empty string');
    }
    // Check if asset_code already exists (excluding current asset)
    const existingAsset = await assetsRepository.getAssetByAssetCode(data.asset_code);
    if (existingAsset && existingAsset.id !== id) {
      throw new Error('Asset with this asset code already exists');
    }
  }

  // Validate name if being updated
  if (data.name !== undefined && data.name !== null) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new Error('Asset name must be a non-empty string');
    }
  }

  // Validate date fields if provided
  if (data.purchase_date !== undefined && data.purchase_date !== null && !isValidDate(data.purchase_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for purchase_date');
  }

  if (data.warranty_expiry !== undefined && data.warranty_expiry !== null && !isValidDate(data.warranty_expiry)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for warranty_expiry');
  }

  if (data.last_maintenance_date !== undefined && data.last_maintenance_date !== null && !isValidDate(data.last_maintenance_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for last_maintenance_date');
  }

  if (data.next_maintenance_date !== undefined && data.next_maintenance_date !== null && !isValidDate(data.next_maintenance_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for next_maintenance_date');
  }

  // Validate date ranges
  const existingAsset = await assetsRepository.getAssetById(id);
  if (!existingAsset) {
    throw new Error('Asset not found');
  }

  const purchaseDate = data.purchase_date !== undefined ? data.purchase_date : existingAsset.purchase_date;
  const warrantyExpiry = data.warranty_expiry !== undefined ? data.warranty_expiry : existingAsset.warranty_expiry;
  if (purchaseDate && warrantyExpiry && !isValidDateRange(purchaseDate, warrantyExpiry)) {
    throw new Error('warranty_expiry must be greater than or equal to purchase_date');
  }

  const lastMaintenanceDate = data.last_maintenance_date !== undefined ? data.last_maintenance_date : existingAsset.last_maintenance_date;
  const nextMaintenanceDate = data.next_maintenance_date !== undefined ? data.next_maintenance_date : existingAsset.next_maintenance_date;
  if (lastMaintenanceDate && nextMaintenanceDate && !isValidDateRange(lastMaintenanceDate, nextMaintenanceDate)) {
    throw new Error('next_maintenance_date must be greater than or equal to last_maintenance_date');
  }

  // Validate numeric fields if provided
  if (data.purchase_cost !== undefined && data.purchase_cost !== null && !isValidNumeric(data.purchase_cost, 0)) {
    throw new Error('Purchase cost must be a valid positive number');
  }

  if (data.current_value !== undefined && data.current_value !== null && !isValidNumeric(data.current_value, 0)) {
    throw new Error('Current value must be a valid positive number');
  }

  if (data.depreciation_rate !== undefined && data.depreciation_rate !== null && !isValidNumeric(data.depreciation_rate, 0, 100)) {
    throw new Error('Depreciation rate must be a valid number between 0 and 100');
  }

  if (data.warranty_period !== undefined && data.warranty_period !== null) {
    const period = parseInt(data.warranty_period);
    if (isNaN(period) || period < 0) {
      throw new Error('Warranty period must be a valid non-negative integer');
    }
  }

  if (data.maintenance_frequency !== undefined && data.maintenance_frequency !== null) {
    const frequency = parseInt(data.maintenance_frequency);
    if (isNaN(frequency) || frequency < 0) {
      throw new Error('Maintenance frequency must be a valid non-negative integer');
    }
  }

  // Validate boolean field if provided
  if (data.is_active !== undefined && data.is_active !== null && typeof data.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  // Sanitize string fields
  const sanitizedData = sanitizeStringFields(data);

  const updatedAsset = await assetsRepository.updateAsset(id, sanitizedData);
  logger.info('Asset updated successfully', { id: updatedAsset.id });
  return updatedAsset;
};

const deleteAsset = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid asset ID (UUID) is required');
  }
  const existingAsset = await assetsRepository.getAssetById(id);
  if (!existingAsset) {
    throw new Error('Asset not found');
  }

  await assetsRepository.deleteAsset(id);
  logger.info('Asset deleted successfully', { id });
  return { message: 'Asset deleted successfully' };
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  getAssetsBySocietyId,
  getActiveAssets,
  getActiveAssetsBySocietyId,
  updateAsset,
  deleteAsset,
};

