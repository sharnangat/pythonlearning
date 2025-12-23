const CompanyConfig = require('../models/companyConfig');

const createCompanyConfig = (data) => CompanyConfig.create(data);
const getCompanyConfigs = () => CompanyConfig.findAll();
const getCompanyConfigById = (id) => CompanyConfig.findByPk(id);
const getActiveCompanyConfig = () => CompanyConfig.findOne({ where: { is_active: true } });
const updateCompanyConfig = async (id, data) => {
  await CompanyConfig.update(data, { where: { id } });
  return CompanyConfig.findByPk(id);
};
const deleteCompanyConfig = (id) => CompanyConfig.destroy({ where: { id } });

module.exports = {
  createCompanyConfig,
  getCompanyConfigs,
  getCompanyConfigById,
  getActiveCompanyConfig,
  updateCompanyConfig,
  deleteCompanyConfig,
};

