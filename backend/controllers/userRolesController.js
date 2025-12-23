const userRolesService = require('../services/userRolesService');
const logger = require('../config/logger');

const createUserRole = async (req, res) => {
  try {
    logger.info('Creating new user role - Received data', req.body);
    const userRole = await userRolesService.createUserRole(req.body);
    logger.info('User role created successfully', { id: userRole.id });
    res.status(201).json(userRole);
  } catch (err) {
    logger.warn('Failed to create user role', { error: err.message, receivedData: req.body });
    const status = err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getUserRoles = async (req, res) => {
  try {
    logger.info('Fetching all user roles - Received data', {
      query: req.query,
      params: req.params,
    });
    const userRoles = await userRolesService.getUserRoles();
    logger.info('User roles fetched successfully', { count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.error('Failed to fetch user roles', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getUserRoleById = async (req, res) => {
  try {
    logger.info('Fetching user role by ID - Received data', {
      id: req.params.id,
      params: req.params,
      query: req.query,
    });
    const userRole = await userRolesService.getUserRoleById(req.params.id);
    logger.info('User role fetched successfully', { id: userRole.id });
    res.json(userRole);
  } catch (err) {
    logger.warn('Failed to fetch user role', { error: err.message, id: req.params.id });
    const status = err.message === 'User role not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getActiveUserRoles = async (req, res) => {
  try {
    logger.info('Fetching active user roles - Received data', {
      query: req.query,
      params: req.params,
    });
    const userRoles = await userRolesService.getActiveUserRoles();
    logger.info('Active user roles fetched successfully', { count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch active user roles', { error: err.message });
    res.status(500).json({ message: err.message });
  }
};

// Search endpoints
const getUserRolesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    logger.info('Fetching user roles by user_id - Received data', {
      user_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getUserRolesByUserId(user_id);
    logger.info('User roles fetched by user_id successfully', { user_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch user roles by user_id', { error: err.message, user_id: req.params.user_id });
    res.status(400).json({ message: err.message });
  }
};

const getUserRolesBySocietyId = async (req, res) => {
  try {
    const { society_id } = req.params;
    logger.info('Fetching user roles by society_id - Received data', {
      society_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getUserRolesBySocietyId(society_id);
    logger.info('User roles fetched by society_id successfully', { society_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch user roles by society_id', { error: err.message, society_id: req.params.society_id });
    res.status(400).json({ message: err.message });
  }
};

const getUserRolesByRoleId = async (req, res) => {
  try {
    const { role_id } = req.params;
    logger.info('Fetching user roles by role_id - Received data', {
      role_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getUserRolesByRoleId(role_id);
    logger.info('User roles fetched by role_id successfully', { role_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch user roles by role_id', { error: err.message, role_id: req.params.role_id });
    res.status(400).json({ message: err.message });
  }
};

const getUserRolesByUserAndSociety = async (req, res) => {
  try {
    const { user_id, society_id } = req.params;
    logger.info('Fetching user roles by user_id and society_id - Received data', {
      user_id,
      society_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getUserRolesByUserAndSociety(user_id, society_id);
    logger.info('User roles fetched by user_id and society_id successfully', { user_id, society_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch user roles by user_id and society_id', { error: err.message, user_id: req.params.user_id, society_id: req.params.society_id });
    res.status(400).json({ message: err.message });
  }
};

const getActiveUserRolesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    logger.info('Fetching active user roles by user_id - Received data', {
      user_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getActiveUserRolesByUserId(user_id);
    logger.info('Active user roles fetched by user_id successfully', { user_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch active user roles by user_id', { error: err.message, user_id: req.params.user_id });
    res.status(400).json({ message: err.message });
  }
};

const getActiveUserRolesBySocietyId = async (req, res) => {
  try {
    const { society_id } = req.params;
    logger.info('Fetching active user roles by society_id - Received data', {
      society_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getActiveUserRolesBySocietyId(society_id);
    logger.info('Active user roles fetched by society_id successfully', { society_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch active user roles by society_id', { error: err.message, society_id: req.params.society_id });
    res.status(400).json({ message: err.message });
  }
};

const getActiveUserRolesByRoleId = async (req, res) => {
  try {
    const { role_id } = req.params;
    logger.info('Fetching active user roles by role_id - Received data', {
      role_id,
      params: req.params,
      query: req.query,
    });
    const userRoles = await userRolesService.getActiveUserRolesByRoleId(role_id);
    logger.info('Active user roles fetched by role_id successfully', { role_id, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to fetch active user roles by role_id', { error: err.message, role_id: req.params.role_id });
    res.status(400).json({ message: err.message });
  }
};

// Helper function to convert query parameters to appropriate types
const convertQueryParams = (query) => {
  const converted = { ...query };
  
  // Convert boolean strings to actual booleans
  if (converted.is_active !== undefined) {
    if (converted.is_active === 'true') {
      converted.is_active = true;
    } else if (converted.is_active === 'false') {
      converted.is_active = false;
    }
    // If it's already a boolean, leave it as is
    // If it's neither 'true' nor 'false' string, it will be validated in the service
  }
  
  return converted;
};

const searchUserRoles = async (req, res) => {
  try {
    logger.info('Searching user roles - Received data', {
      query: req.query,
      params: req.params,
    });
    // Convert query parameters to appropriate types before passing to service
    const convertedFilters = convertQueryParams(req.query);
    const userRoles = await userRolesService.searchUserRoles(convertedFilters);
    logger.info('User roles searched successfully', { filters: convertedFilters, count: userRoles.length });
    res.json(userRoles);
  } catch (err) {
    logger.warn('Failed to search user roles', { error: err.message, query: req.query });
    res.status(400).json({ message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    logger.info('Updating user role - Received data', {
      id: req.params.id,
      body: req.body,
      params: req.params,
    });
    const userRole = await userRolesService.updateUserRole(req.params.id, req.body);
    logger.info('User role updated successfully', { id: userRole.id });
    res.json(userRole);
  } catch (err) {
    logger.warn('Failed to update user role', {
      error: err.message,
      id: req.params.id,
      receivedData: req.body,
    });
    const status = err.message === 'User role not found' ? 404 : err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const deleteUserRole = async (req, res) => {
  try {
    logger.info('Deleting user role - Received data', {
      id: req.params.id,
      params: req.params,
    });
    const result = await userRolesService.deleteUserRole(req.params.id);
    logger.info('User role deleted successfully', { id: req.params.id });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete user role', { error: err.message, id: req.params.id });
    const status = err.message === 'User role not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
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

