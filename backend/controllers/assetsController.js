const assetsService = require('../services/assetsService');
const logger = require('../config/logger');

const createAsset = async (req, res) => {
  try {
    logger.info('Creating new asset - Received data', req.body);
    const asset = await assetsService.createAsset(req.body);
    logger.info('Asset created successfully', { id: asset.id, asset_code: asset.asset_code });
    res.status(201).json(asset);
  } catch (err) {
    logger.warn('Failed to create asset', { error: err.message, receivedData: req.body });
    const status = err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getAssets = async (req, res) => {
  try {
    logger.info('Fetching all assets - Received data', {
      query: req.query,
      params: req.params,
    });
    const assets = await assetsService.getAssets();
    logger.info('Assets fetched successfully', { count: assets.length });
    res.json(assets);
  } catch (err) {
    logger.error('Failed to fetch assets', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getAssetById = async (req, res) => {
  try {
    logger.info('Fetching asset by ID - Received data', {
      id: req.params.id,
      params: req.params,
      query: req.query,
    });
    const asset = await assetsService.getAssetById(req.params.id);
    logger.info('Asset fetched successfully', { id: asset.id });
    res.json(asset);
  } catch (err) {
    logger.warn('Failed to fetch asset', { error: err.message, id: req.params.id });
    const status = err.message === 'Asset not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getAssetsBySocietyId = async (req, res) => {
  try {
    const { society_id } = req.params;
    logger.info('Fetching assets by society_id - Received data', {
      society_id,
      params: req.params,
      query: req.query,
    });
    const assets = await assetsService.getAssetsBySocietyId(society_id);
    logger.info('Assets fetched by society_id successfully', { society_id, count: assets.length });
    res.json(assets);
  } catch (err) {
    logger.warn('Failed to fetch assets by society_id', { error: err.message, society_id: req.params.society_id });
    res.status(400).json({ message: err.message });
  }
};

const getActiveAssets = async (req, res) => {
  try {
    logger.info('Fetching active assets - Received data', {
      query: req.query,
      params: req.params,
    });
    const assets = await assetsService.getActiveAssets();
    logger.info('Active assets fetched successfully', { count: assets.length });
    res.json(assets);
  } catch (err) {
    logger.warn('Failed to fetch active assets', { error: err.message });
    res.status(500).json({ message: err.message });
  }
};

const getActiveAssetsBySocietyId = async (req, res) => {
  try {
    const { society_id } = req.params;
    logger.info('Fetching active assets by society_id - Received data', {
      society_id,
      params: req.params,
      query: req.query,
    });
    const assets = await assetsService.getActiveAssetsBySocietyId(society_id);
    logger.info('Active assets fetched by society_id successfully', { society_id, count: assets.length });
    res.json(assets);
  } catch (err) {
    logger.warn('Failed to fetch active assets by society_id', { error: err.message, society_id: req.params.society_id });
    res.status(400).json({ message: err.message });
  }
};

const updateAsset = async (req, res) => {
  try {
    logger.info('Updating asset - Received data', {
      id: req.params.id,
      body: req.body,
      params: req.params,
    });
    const asset = await assetsService.updateAsset(req.params.id, req.body);
    logger.info('Asset updated successfully', { id: asset.id });
    res.json(asset);
  } catch (err) {
    logger.warn('Failed to update asset', {
      error: err.message,
      id: req.params.id,
      receivedData: req.body,
    });
    const status = err.message === 'Asset not found' ? 404 : err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const deleteAsset = async (req, res) => {
  try {
    logger.info('Deleting asset - Received data', {
      id: req.params.id,
      params: req.params,
    });
    const result = await assetsService.deleteAsset(req.params.id);
    logger.info('Asset deleted successfully', { id: req.params.id });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete asset', { error: err.message, id: req.params.id });
    const status = err.message === 'Asset not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
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

