const societiesService = require('../services/societiesService');
const logger = require('../config/logger');

const createSociety = async (req, res) => {
  try {
    logger.info('Creating new society - Received data', req.body);
    const society = await societiesService.createSociety(req.body);
    logger.info('Society created successfully', { registration_number: society.registration_number, name: society.name });
    res.status(201).json(society);
  } catch (err) {
    logger.warn('Failed to create society', { error: err.message, receivedData: req.body });
    const status = err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getSocieties = async (req, res) => {
  try {
    logger.info('Fetching all societies - Received data', {
      query: req.query,
      params: req.params,
      headers: req.headers,
    });
    const societies = await societiesService.getSocieties();
    logger.info('Societies fetched successfully', { count: societies.length });
    res.json(societies);
  } catch (err) {
    logger.error('Failed to fetch societies', {
      error: err.message,
      stack: err.stack,
      query: req.query,
      params: req.params,
    });
    res.status(500).json({ message: err.message });
  }
};

const getSocietyByRegistrationNumber = async (req, res) => {
  try {
    logger.info('Fetching society by registration number - Received data', {
      registration_number: req.params.registration_number,
      params: req.params,
      query: req.query,
    });
    const society = await societiesService.getSocietyByRegistrationNumber(req.params.registration_number);
    logger.info('Society fetched successfully', { registration_number: society.registration_number });
    res.json(society);
  } catch (err) {
    logger.warn('Failed to fetch society', { error: err.message, registration_number: req.params.registration_number });
    const status = err.message === 'Society not found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const getActiveSocieties = async (req, res) => {
  try {
    logger.info('Fetching active societies - Received data', {
      query: req.query,
      params: req.params,
    });
    const societies = await societiesService.getActiveSocieties();
    logger.info('Active societies fetched successfully', { count: societies.length });
    res.json(societies);
  } catch (err) {
    logger.warn('Failed to fetch active societies', { error: err.message });
    res.status(500).json({ message: err.message });
  }
};

const getSocietiesByState = async (req, res) => {
  try {
    const { state } = req.params;
    logger.info('Fetching societies by state - Received data', {
      state,
      params: req.params,
      query: req.query,
    });
    const societies = await societiesService.getSocietiesByState(state);
    logger.info('Societies fetched by state successfully', { state, count: societies.length });
    res.json(societies);
  } catch (err) {
    logger.warn('Failed to fetch societies by state', { error: err.message, state: req.params.state });
    res.status(500).json({ message: err.message });
  }
};

const updateSociety = async (req, res) => {
  try {
    logger.info('Updating society - Received data', {
      registration_number: req.params.registration_number,
      body: req.body,
      params: req.params,
    });
    const society = await societiesService.updateSociety(req.params.registration_number, req.body);
    logger.info('Society updated successfully', { registration_number: society.registration_number });
    res.json(society);
  } catch (err) {
    logger.warn('Failed to update society', {
      error: err.message,
      registration_number: req.params.registration_number,
      receivedData: req.body,
    });
    const status = err.message === 'Society not found' ? 404 : err.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const deleteSociety = async (req, res) => {
  try {
    logger.info('Deleting society - Received data', {
      registration_number: req.params.registration_number,
      params: req.params,
    });
    const result = await societiesService.deleteSociety(req.params.registration_number);
    logger.info('Society deleted successfully', { registration_number: req.params.registration_number });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete society', { error: err.message, registration_number: req.params.registration_number });
    const status = err.message === 'Society not found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
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

