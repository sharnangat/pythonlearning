const permissionsRepository = require('../repository/permissionsRepository');
const logger = require('../config/logger');

// Helper function to validate UUID format
const isValidUUID = (uuid) => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to validate boolean fields
const isValidBoolean = (value) => {
  if (value === undefined || value === null) return true;
  return typeof value === 'boolean';
};

const createPermission = async (data) => {
  logger.info('createPermission - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.permission_name || typeof data.permission_name !== 'string' || data.permission_name.trim().length === 0) {
    throw new Error('Permission name is required and must be a non-empty string');
  }

  if (!data.permission_code || typeof data.permission_code !== 'string' || data.permission_code.trim().length === 0) {
    throw new Error('Permission code is required and must be a non-empty string');
  }

  if (!data.module || typeof data.module !== 'string' || data.module.trim().length === 0) {
    throw new Error('Module is required and must be a non-empty string');
  }

  // Validate field lengths
  if (data.permission_name.length > 100) {
    throw new Error('Permission name must not exceed 100 characters');
  }

  if (data.permission_code.length > 50) {
    throw new Error('Permission code must not exceed 50 characters');
  }

  if (data.module.length > 50) {
    throw new Error('Module must not exceed 50 characters');
  }

  // Validate boolean field
  if (data.is_active !== undefined && !isValidBoolean(data.is_active)) {
    throw new Error('is_active must be a boolean');
  }

  // Check for unique permission_name
  const existingPermissionByName = await permissionsRepository.getPermissionByName(data.permission_name);
  if (existingPermissionByName) {
    throw new Error('Permission with this name already exists');
  }

  // Check for unique permission_code
  const existingPermissionByCode = await permissionsRepository.getPermissionByCode(data.permission_code);
  if (existingPermissionByCode) {
    throw new Error('Permission with this code already exists');
  }

  const permission = await permissionsRepository.createPermission(data);
  logger.info('Permission created successfully', { id: permission.permission_id, code: permission.permission_code });
  return permission;
};

const getPermissions = async () => {
  const permissions = await permissionsRepository.getPermissions();
  logger.info('Permissions fetched successfully', { count: permissions.length });
  return permissions;
};

const getPermissionById = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid permission ID (UUID) is required');
  }
  const permission = await permissionsRepository.getPermissionById(id);
  if (!permission) {
    throw new Error('Permission not found');
  }
  logger.info('Permission fetched by ID', { id });
  return permission;
};

const getActivePermissions = async () => {
  const permissions = await permissionsRepository.getActivePermissions();
  logger.info('Active permissions fetched successfully', { count: permissions.length });
  return permissions;
};

const getPermissionByCode = async (code) => {
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    throw new Error('Valid permission code is required');
  }
  const permission = await permissionsRepository.getPermissionByCode(code);
  if (!permission) {
    throw new Error('Permission not found');
  }
  logger.info('Permission fetched by code', { code });
  return permission;
};

const getPermissionByName = async (name) => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Valid permission name is required');
  }
  const permission = await permissionsRepository.getPermissionByName(name);
  if (!permission) {
    throw new Error('Permission not found');
  }
  logger.info('Permission fetched by name', { name });
  return permission;
};

const getPermissionsByModule = async (module) => {
  if (!module || typeof module !== 'string' || module.trim().length === 0) {
    throw new Error('Valid module name is required');
  }
  const permissions = await permissionsRepository.getPermissionsByModule(module);
  logger.info('Permissions fetched by module', { module, count: permissions.length });
  return permissions;
};

const getActivePermissionsByModule = async (module) => {
  if (!module || typeof module !== 'string' || module.trim().length === 0) {
    throw new Error('Valid module name is required');
  }
  const permissions = await permissionsRepository.getActivePermissionsByModule(module);
  logger.info('Active permissions fetched by module', { module, count: permissions.length });
  return permissions;
};

const updatePermission = async (id, data) => {
  logger.info('updatePermission - Received data', { id, keys: Object.keys(data) });

  if (!isValidUUID(id)) {
    throw new Error('Valid permission ID (UUID) is required');
  }

  const existingPermission = await permissionsRepository.getPermissionById(id);
  if (!existingPermission) {
    throw new Error('Permission not found');
  }

  // Validate permission_name if provided
  if (data.permission_name !== undefined && data.permission_name !== null) {
    if (typeof data.permission_name !== 'string' || data.permission_name.trim().length === 0) {
      throw new Error('Permission name must be a non-empty string');
    }
    if (data.permission_name.length > 100) {
      throw new Error('Permission name must not exceed 100 characters');
    }
    const duplicatePermission = await permissionsRepository.getPermissionByName(data.permission_name);
    if (duplicatePermission && duplicatePermission.permission_id !== id) {
      throw new Error('Permission with this name already exists');
    }
  }

  // Validate permission_code if provided
  if (data.permission_code !== undefined && data.permission_code !== null) {
    if (typeof data.permission_code !== 'string' || data.permission_code.trim().length === 0) {
      throw new Error('Permission code must be a non-empty string');
    }
    if (data.permission_code.length > 50) {
      throw new Error('Permission code must not exceed 50 characters');
    }
    const duplicatePermission = await permissionsRepository.getPermissionByCode(data.permission_code);
    if (duplicatePermission && duplicatePermission.permission_id !== id) {
      throw new Error('Permission with this code already exists');
    }
  }

  // Validate module if provided
  if (data.module !== undefined && data.module !== null) {
    if (typeof data.module !== 'string' || data.module.trim().length === 0) {
      throw new Error('Module must be a non-empty string');
    }
    if (data.module.length > 50) {
      throw new Error('Module must not exceed 50 characters');
    }
  }

  // Validate boolean field
  if (data.is_active !== undefined && !isValidBoolean(data.is_active)) {
    throw new Error('is_active must be a boolean');
  }

  const updatedPermission = await permissionsRepository.updatePermission(id, data);
  logger.info('Permission updated successfully', { id: updatedPermission.permission_id });
  return updatedPermission;
};

const deletePermission = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid permission ID (UUID) is required');
  }
  const existingPermission = await permissionsRepository.getPermissionById(id);
  if (!existingPermission) {
    throw new Error('Permission not found');
  }
  await permissionsRepository.deletePermission(id);
  logger.info('Permission deleted successfully', { id });
  return { message: 'Permission deleted successfully' };
};

module.exports = {
  createPermission,
  getPermissions,
  getPermissionById,
  getActivePermissions,
  getPermissionByCode,
  getPermissionByName,
  getPermissionsByModule,
  getActivePermissionsByModule,
  updatePermission,
  deletePermission,
};

