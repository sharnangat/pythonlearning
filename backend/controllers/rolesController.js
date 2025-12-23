const rolesService = require('../services/rolesService');
const logger = require('../config/logger');

const createRole = async (req, res) => {
  try {
    logger.info('Creating new role - Received data', req.body);
    const role = await rolesService.createRole(req.body);
    logger.info('Role created successfully', { id: role.id, role_name: role.role_name });
    res.status(201).json(role);
  } catch (err) {
    logger.warn('Failed to create role', { error: err.message, receivedData: req.body });
    const status = err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getRoles = async (req, res) => {
  try {
    logger.info('Fetching all roles - Received data', {
      query: req.query,
      params: req.params,
    });
    const roles = await rolesService.getRoles();
    logger.info('Roles fetched successfully', { count: roles.length });
    res.json(roles);
  } catch (err) {
    logger.error('Failed to fetch roles', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    logger.info('Fetching role by ID - Received data', {
      id: req.params.id,
      params: req.params,
      query: req.query,
    });
    const role = await rolesService.getRoleById(req.params.id);
    logger.info('Role fetched successfully', { id: role.id });
    res.json(role);
  } catch (err) {
    logger.warn('Failed to fetch role', { error: err.message, id: req.params.id });
    const status = err.message === 'Role not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getActiveRoles = async (req, res) => {
  try {
    logger.info('Fetching active roles - Received data', {
      query: req.query,
      params: req.params,
    });
    const roles = await rolesService.getActiveRoles();
    logger.info('Active roles fetched successfully', { count: roles.length });
    res.json(roles);
  } catch (err) {
    logger.warn('Failed to fetch active roles', { error: err.message });
    res.status(500).json({ message: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    logger.info('Updating role - Received data', {
      id: req.params.id,
      body: req.body,
      params: req.params,
    });
    const role = await rolesService.updateRole(req.params.id, req.body);
    logger.info('Role updated successfully', { id: role.id });
    res.json(role);
  } catch (err) {
    logger.warn('Failed to update role', {
      error: err.message,
      id: req.params.id,
      receivedData: req.body,
    });
    const status = err.message === 'Role not found' ? 404 : err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    logger.info('Deleting role - Received data', {
      id: req.params.id,
      params: req.params,
    });
    const result = await rolesService.deleteRole(req.params.id);
    logger.info('Role deleted successfully', { id: req.params.id });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete role', { error: err.message, id: req.params.id });
    const status = err.message === 'Role not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getActiveRoles,
  updateRole,
  deleteRole,
};

