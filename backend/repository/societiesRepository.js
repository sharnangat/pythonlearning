const Society = require('../models/societies');

const createSociety = (data) => Society.create(data);
const getSocieties = () => Society.findAll();
const getSocietyByRegistrationNumber = (registrationNumber) => Society.findByPk(registrationNumber);
const getActiveSocieties = () => Society.findAll({ where: { is_active: true } });
const getSocietiesByState = (state) => Society.findAll({ where: { state } });
const updateSociety = async (registrationNumber, data) => {
  await Society.update(data, { where: { registration_number: registrationNumber } });
  return Society.findByPk(registrationNumber);
};
const deleteSociety = (registrationNumber) => Society.destroy({ where: { registration_number: registrationNumber } });
const findByRegistrationNumber = (registrationNumber) => Society.findByPk(registrationNumber);

module.exports = {
  createSociety,
  getSocieties,
  getSocietyByRegistrationNumber,
  getActiveSocieties,
  getSocietiesByState,
  updateSociety,
  deleteSociety,
  findByRegistrationNumber,
};

