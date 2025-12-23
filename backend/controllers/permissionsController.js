const permissionsService = require('../services/permissionsService');
const logger = require('../config/logger');

const createPermission = async (req, res) => {
  try {
    logger.info('Creating new permission - Received data', req.body);
    const permission = await permissionsService.createPermission(req.body);
    logger.info('Permission created successfully', { id: permission.permission_id, code: permission.permission_code });
    res.status(201).json(permission);
  } catch (err) {
    logger.warn('Failed to create permission', { error: err.message, receivedData: req.body });
    const status = err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getPermissions = async (req, res) => {
  try {
    logger.info('Fetching all permissions - Received data', {
      query: req.query,
      params: req.params,
    });
    const permissions = await permissionsService.getPermissions();
    logger.info('Permissions fetched successfully', { count: permissions.length });
    res.json(permissions);
  } catch (err) {
    logger.error('Failed to fetch permissions', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getPermissionById = async (req, res) => {
  try {
    logger.info('Fetching permission by ID - Received data', {
      id: req.params.id,
      params: req.params,
      query: req.query,
    });
    const permission = await permissionsService.getPermissionById(req.params.id);
    logger.info('Permission fetched successfully', { id: permission.permission_id });
    res.json(permission);
  } catch (err) {
    logger.warn('Failed to fetch permission', { error: err.message, id: req.params.id });
    const status = err.message === 'Permission not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getActivePermissions = async (req, res) => {
  try {
    logger.info('Fetching active permissions - Received data', {
      query: req.query,
      params: req.params,
    });
    const permissions = await permissionsService.getActivePermissions();
    logger.info('Active permissions fetched successfully', { count: permissions.length });
    res.json(permissions);
  } catch (err) {
    logger.error('Failed to fetch active permissions', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getPermissionByCode = async (req, res) => {
  try {
    logger.info('Fetching permission by code - Received data', {
      code: req.params.code,
      params: req.params,
      query: req.query,
    });
    const permission = await permissionsService.getPermissionByCode(req.params.code);
    logger.info('Permission fetched successfully by code', { code: permission.permission_code });
    res.json(permission);
  } catch (err) {
    logger.warn('Failed to fetch permission by code', { error: err.message, code: req.params.code });
    const status = err.message === 'Permission not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getPermissionByName = async (req, res) => {
  try {
    logger.info('Fetching permission by name - Received data', {
      name: req.params.name,
      params: req.params,
      query: req.query,
    });
    const permission = await permissionsService.getPermissionByName(req.params.name);
    logger.info('Permission fetched successfully by name', { name: permission.permission_name });
    res.json(permission);
  } catch (err) {
    logger.warn('Failed to fetch permission by name', { error: err.message, name: req.params.name });
    const status = err.message === 'Permission not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getPermissionsByModule = async (req, res) => {
  try {
    logger.info('Fetching permissions by module - Received data', {
      module: req.params.module,
      params: req.params,
      query: req.query,
    });
    const permissions = await permissionsService.getPermissionsByModule(req.params.module);
    logger.info('Permissions fetched successfully by module', { module: req.params.module, count: permissions.length });
    res.json(permissions);
  } catch (err) {
    logger.warn('Failed to fetch permissions by module', { error: err.message, module: req.params.module });
    res.status(400).json({ message: err.message });
  }
};

const getActivePermissionsByModule = async (req, res) => {
  try {
    logger.info('Fetching active permissions by module - Received data', {
      module: req.params.module,
      params: req.params,
      query: req.query,
    });
    const permissions = await permissionsService.getActivePermissionsByModule(req.params.module);
    logger.info('Active permissions fetched successfully by module', { module: req.params.module, count: permissions.length });
    res.json(permissions);
  } catch (err) {
    logger.warn('Failed to fetch active permissions by module', { error: err.message, module: req.params.module });
    res.status(400).json({ message: err.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    logger.info('Updating permission - Received data', { id: req.params.id, body: req.body });
    const permission = await permissionsService.updatePermission(req.params.id, req.body);
    logger.info('Permission updated successfully', { id: permission.permission_id });
    res.json(permission);
  } catch (err) {
    logger.warn('Failed to update permission', { error: err.message, id: req.params.id, receivedData: req.body });
    const status = err.message === 'Permission not found' ? 404 : err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const deletePermission = async (req, res) => {
  try {
    logger.info('Deleting permission - Received data', { id: req.params.id });
    const result = await permissionsService.deletePermission(req.params.id);
    logger.info('Permission deleted successfully', { id: req.params.id });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete permission', { error: err.message, id: req.params.id });
    const status = err.message === 'Permission not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
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

