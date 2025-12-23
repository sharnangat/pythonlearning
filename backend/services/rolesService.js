const rolesRepository = require('../repository/rolesRepository');
const logger = require('../config/logger');

// Helper function to validate UUID format
const isValidUUID = (uuid) => {
  if (!uuid) return false; // Return false for null, undefined, or empty string
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to sanitize string fields to their max lengths
const sanitizeStringFields = (data) => {
  const sanitized = { ...data };
  
  // Field length constraints based on model definition
  const fieldMaxLengths = {
    role_name: 255,
    display_name: 100,
  };
  
  Object.keys(fieldMaxLengths).forEach((field) => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      if (typeof sanitized[field] === 'string') {
        // Trim whitespace and limit to max length
        sanitized[field] = sanitized[field].trim().substring(0, fieldMaxLengths[field]);
        // If after trimming it's empty, set to null for optional fields
        if (sanitized[field].length === 0 && field !== 'role_name' && field !== 'display_name') {
          sanitized[field] = null;
        }
      }
    }
  });
  
  return sanitized;
};

const createRole = async (data) => {
  logger.info('createRole - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.role_name || typeof data.role_name !== 'string' || data.role_name.trim().length === 0) {
    throw new Error('Role name is required');
  }

  if (!data.display_name || typeof data.display_name !== 'string' || data.display_name.trim().length === 0) {
    throw new Error('Display name is required');
  }

  // Validate optional fields
  if (data.hierarchy_level !== undefined && (typeof data.hierarchy_level !== 'number' || !Number.isInteger(data.hierarchy_level))) {
    throw new Error('Hierarchy level must be an integer');
  }

  if (data.is_active !== undefined && typeof data.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  // Check if role_name already exists
  const existingRole = await rolesRepository.getRoleByRoleName(data.role_name);
  if (existingRole) {
    throw new Error('Role with this role name already exists');
  }

  // Sanitize string fields
  const sanitizedData = sanitizeStringFields(data);

  const role = await rolesRepository.createRole(sanitizedData);
  logger.info('Role created successfully', { id: role.id, role_name: role.role_name });
  return role;
};

const getRoles = async () => {
  const roles = await rolesRepository.getRoles();
  logger.info('Roles fetched successfully', { count: roles.length });
  return roles;
};

const getRoleById = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid role ID (UUID) is required');
  }
  const role = await rolesRepository.getRoleById(id);
  if (!role) {
    throw new Error('Role not found');
  }
  return role;
};

const getActiveRoles = async () => {
  const roles = await rolesRepository.getActiveRoles();
  logger.info('Active roles fetched successfully', { count: roles.length });
  return roles;
};

const updateRole = async (id, data) => {
  logger.info('updateRole - Received data', { id, keys: Object.keys(data) });

  if (!isValidUUID(id)) {
    throw new Error('Valid role ID (UUID) is required');
  }

  // Validate optional fields if provided
  if (data.role_name !== undefined && data.role_name !== null) {
    if (typeof data.role_name !== 'string' || data.role_name.trim().length === 0) {
      throw new Error('Role name must be a non-empty string');
    }
    // Check if role_name is being changed and already exists
    const existingRole = await rolesRepository.getRoleByRoleName(data.role_name);
    if (existingRole && existingRole.id !== id) {
      throw new Error('Role with this role name already exists');
    }
  }

  if (data.display_name !== undefined && data.display_name !== null) {
    if (typeof data.display_name !== 'string' || data.display_name.trim().length === 0) {
      throw new Error('Display name must be a non-empty string');
    }
  }

  if (data.hierarchy_level !== undefined && data.hierarchy_level !== null) {
    if (typeof data.hierarchy_level !== 'number' || !Number.isInteger(data.hierarchy_level)) {
      throw new Error('Hierarchy level must be an integer');
    }
  }

  if (data.is_active !== undefined && data.is_active !== null) {
    if (typeof data.is_active !== 'boolean') {
      throw new Error('is_active must be a boolean');
    }
  }

  // Sanitize string fields
  const sanitizedData = sanitizeStringFields(data);

  const existingRole = await rolesRepository.getRoleById(id);
  if (!existingRole) {
    throw new Error('Role not found');
  }

  const updatedRole = await rolesRepository.updateRole(id, sanitizedData);
  logger.info('Role updated successfully', { id: updatedRole.id });
  return updatedRole;
};

const deleteRole = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid role ID (UUID) is required');
  }

  const existingRole = await rolesRepository.getRoleById(id);
  if (!existingRole) {
    throw new Error('Role not found');
  }

  await rolesRepository.deleteRole(id);
  logger.info('Role deleted successfully', { id });
  return { message: 'Role deleted successfully' };
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getActiveRoles,
  updateRole,
  deleteRole,
};

