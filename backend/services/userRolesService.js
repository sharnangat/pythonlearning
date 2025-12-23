const userRolesRepository = require('../repository/userRolesRepository');
const rolesRepository = require('../repository/rolesRepository');
const Society = require('../models/societies');
const User = require('../models/users');
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
const isValidDateRange = (validFrom, validUntil) => {
  if (!validFrom || !validUntil) return true; // Both optional
  const from = new Date(validFrom);
  const until = new Date(validUntil);
  return until >= from;
};

const createUserRole = async (data) => {
  logger.info('createUserRole - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.user_id || !isValidUUID(data.user_id)) {
    throw new Error('Valid user_id (UUID) is required');
  }

  if (!data.society_id || !isValidUUID(data.society_id)) {
    throw new Error('Valid society_id (UUID) is required');
  }

  if (!data.role_id || !isValidUUID(data.role_id)) {
    throw new Error('Valid role_id (UUID) is required');
  }

  // Validate optional UUID fields
  if (data.assigned_by !== undefined && data.assigned_by !== null && !isValidUUID(data.assigned_by)) {
    throw new Error('Valid UUID is required for assigned_by');
  }

  // Validate date fields
  if (data.valid_from && !isValidDate(data.valid_from)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for valid_from');
  }

  if (data.valid_until && !isValidDate(data.valid_until)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for valid_until');
  }

  // Validate date range
  if (data.valid_from && data.valid_until && !isValidDateRange(data.valid_from, data.valid_until)) {
    throw new Error('valid_until must be greater than or equal to valid_from');
  }

  // Validate boolean field
  if (data.is_active !== undefined && typeof data.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  // Verify user exists
  const user = await User.findByPk(data.user_id);
  if (!user) {
    throw new Error('User with the provided user_id does not exist');
  }

  // Verify society exists
  const society = await Society.findByPk(data.society_id);
  if (!society) {
    throw new Error('Society with the provided society_id does not exist');
  }

  // Verify role exists
  const role = await rolesRepository.getRoleById(data.role_id);
  if (!role) {
    throw new Error('Role with the provided role_id does not exist');
  }

  // Verify assigned_by user exists (if provided)
  //if (data.assigned_by) {
   // const assignedByUser = await User.findByPk(data.assigned_by);
   // if (!assignedByUser) {
    //  throw new Error('User with the provided assigned_by does not exist');
   // }
  //}

  // Check if user_role combination already exists
  const existingUserRole = await userRolesRepository.getUserRolesByUserSocietyAndRole(
    data.user_id,
    data.society_id,
    data.role_id
  );
  if (existingUserRole) {
    throw new Error('User role with this user_id, society_id, and role_id combination already exists');
  }

  const userRole = await userRolesRepository.createUserRole(data);
  logger.info('User role created successfully', { id: userRole.id });
  return userRole;
};

const getUserRoles = async () => {
  const userRoles = await userRolesRepository.getUserRoles();
  logger.info('User roles fetched successfully', { count: userRoles.length });
  return userRoles;
};

const getUserRoleById = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid user role ID (UUID) is required');
  }
  const userRole = await userRolesRepository.getUserRoleById(id);
  if (!userRole) {
    throw new Error('User role not found');
  }
  return userRole;
};

const getActiveUserRoles = async () => {
  const userRoles = await userRolesRepository.getActiveUserRoles();
  logger.info('Active user roles fetched successfully', { count: userRoles.length });
  return userRoles;
};

// Search functions
const getUserRolesByUserId = async (userId) => {
  if (!isValidUUID(userId)) {
    throw new Error('Valid user_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getUserRolesByUserId(userId);
  logger.info('User roles fetched by user_id', { userId, count: userRoles.length });
  return userRoles;
};

const getUserRolesBySocietyId = async (societyId) => {
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getUserRolesBySocietyId(societyId);
  logger.info('User roles fetched by society_id', { societyId, count: userRoles.length });
  return userRoles;
};

const getUserRolesByRoleId = async (roleId) => {
  if (!isValidUUID(roleId)) {
    throw new Error('Valid role_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getUserRolesByRoleId(roleId);
  logger.info('User roles fetched by role_id', { roleId, count: userRoles.length });
  return userRoles;
};

const getUserRolesByUserAndSociety = async (userId, societyId) => {
  if (!isValidUUID(userId)) {
    throw new Error('Valid user_id (UUID) is required');
  }
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getUserRolesByUserAndSociety(userId, societyId);
  logger.info('User roles fetched by user_id and society_id', { userId, societyId, count: userRoles.length });
  return userRoles;
};

const getActiveUserRolesByUserId = async (userId) => {
  if (!isValidUUID(userId)) {
    throw new Error('Valid user_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getActiveUserRolesByUserId(userId);
  logger.info('Active user roles fetched by user_id', { userId, count: userRoles.length });
  return userRoles;
};

const getActiveUserRolesBySocietyId = async (societyId) => {
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getActiveUserRolesBySocietyId(societyId);
  logger.info('Active user roles fetched by society_id', { societyId, count: userRoles.length });
  return userRoles;
};

const getActiveUserRolesByRoleId = async (roleId) => {
  if (!isValidUUID(roleId)) {
    throw new Error('Valid role_id (UUID) is required');
  }
  const userRoles = await userRolesRepository.getActiveUserRolesByRoleId(roleId);
  logger.info('Active user roles fetched by role_id', { roleId, count: userRoles.length });
  return userRoles;
};

const searchUserRoles = async (filters) => {
  // Validate UUID filters
  if (filters.user_id && !isValidUUID(filters.user_id)) {
    throw new Error('Valid UUID is required for user_id');
  }
  if (filters.society_id && !isValidUUID(filters.society_id)) {
    throw new Error('Valid UUID is required for society_id');
  }
  if (filters.role_id && !isValidUUID(filters.role_id)) {
    throw new Error('Valid UUID is required for role_id');
  }
  if (filters.assigned_by && !isValidUUID(filters.assigned_by)) {
    throw new Error('Valid UUID is required for assigned_by');
  }

  // Validate date filters
  if (filters.valid_from && !isValidDate(filters.valid_from)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for valid_from');
  }
  if (filters.valid_until && !isValidDate(filters.valid_until)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for valid_until');
  }

  // Validate boolean filter
  if (filters.is_active !== undefined && typeof filters.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  const userRoles = await userRolesRepository.searchUserRoles(filters);
  logger.info('User roles searched successfully', { filters, count: userRoles.length });
  return userRoles;
};

const updateUserRole = async (id, data) => {
  logger.info('updateUserRole - Received data', { id, keys: Object.keys(data) });

  if (!isValidUUID(id)) {
    throw new Error('Valid user role ID (UUID) is required');
  }

  // Validate optional UUID fields if provided
  if (data.user_id !== undefined && data.user_id !== null && !isValidUUID(data.user_id)) {
    throw new Error('Valid UUID is required for user_id');
  }
  if (data.society_id !== undefined && data.society_id !== null && !isValidUUID(data.society_id)) {
    throw new Error('Valid UUID is required for society_id');
  }
  if (data.role_id !== undefined && data.role_id !== null && !isValidUUID(data.role_id)) {
    throw new Error('Valid UUID is required for role_id');
  }
  if (data.assigned_by !== undefined && data.assigned_by !== null && !isValidUUID(data.assigned_by)) {
    throw new Error('Valid UUID is required for assigned_by');
  }

  // Validate date fields if provided
  if (data.valid_from !== undefined && data.valid_from !== null && !isValidDate(data.valid_from)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for valid_from');
  }
  if (data.valid_until !== undefined && data.valid_until !== null && !isValidDate(data.valid_until)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for valid_until');
  }

  // Validate date range if both dates are provided
  const existingUserRole = await userRolesRepository.getUserRoleById(id);
  if (!existingUserRole) {
    throw new Error('User role not found');
  }

  const validFrom = data.valid_from !== undefined ? data.valid_from : existingUserRole.valid_from;
  const validUntil = data.valid_until !== undefined ? data.valid_until : existingUserRole.valid_until;
  if (validFrom && validUntil && !isValidDateRange(validFrom, validUntil)) {
    throw new Error('valid_until must be greater than or equal to valid_from');
  }

  // Validate boolean field if provided
  if (data.is_active !== undefined && data.is_active !== null && typeof data.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean');
  }

  // Verify user exists if being updated
  if (data.user_id) {
    const user = await User.findByPk(data.user_id);
    if (!user) {
      throw new Error('User with the provided user_id does not exist');
    }
  }

  // Verify society exists if being updated
  if (data.society_id) {
    const society = await Society.findByPk(data.society_id);
    if (!society) {
      throw new Error('Society with the provided society_id does not exist');
    }
  }

  // Verify role exists if being updated
  if (data.role_id) {
    const role = await rolesRepository.getRoleById(data.role_id);
    if (!role) {
      throw new Error('Role with the provided role_id does not exist');
    }
  }

  // Verify assigned_by user exists if being updated
  if (data.assigned_by !== undefined && data.assigned_by !== null) {
    const assignedByUser = await User.findByPk(data.assigned_by);
    if (!assignedByUser) {
      throw new Error('User with the provided assigned_by does not exist');
    }
  }

  // Check if updating would create a duplicate (if user_id, society_id, or role_id is being changed)
  if (data.user_id || data.society_id || data.role_id) {
    const userId = data.user_id || existingUserRole.user_id;
    const societyId = data.society_id || existingUserRole.society_id;
    const roleId = data.role_id || existingUserRole.role_id;
    
    const duplicate = await userRolesRepository.getUserRolesByUserSocietyAndRole(userId, societyId, roleId);
    if (duplicate && duplicate.id !== id) {
      throw new Error('User role with this user_id, society_id, and role_id combination already exists');
    }
  }

  const updatedUserRole = await userRolesRepository.updateUserRole(id, data);
  logger.info('User role updated successfully', { id: updatedUserRole.id });
  return updatedUserRole;
};

const deleteUserRole = async (id) => {
  if (!isValidUUID(id)) {
    throw new Error('Valid user role ID (UUID) is required');
  }

  const existingUserRole = await userRolesRepository.getUserRoleById(id);
  if (!existingUserRole) {
    throw new Error('User role not found');
  }

  await userRolesRepository.deleteUserRole(id);
  logger.info('User role deleted successfully', { id });
  return { message: 'User role deleted successfully' };
};

module.exports = {
  createUserRole,
  getUserRoles,
  getUserRoleById,
  getActiveUserRoles,
  getUserRolesByUserId,
  getUserRolesBySocietyId,
  getUserRolesByRoleId,
  getUserRolesByUserAndSociety,
  getActiveUserRolesByUserId,
  getActiveUserRolesBySocietyId,
  getActiveUserRolesByRoleId,
  searchUserRoles,
  updateUserRole,
  deleteUserRole,
};

