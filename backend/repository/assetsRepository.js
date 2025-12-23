const Asset = require('../models/assets');

const createAsset = (data) => Asset.create(data);
const getAssets = () => Asset.findAll();
const getAssetById = (id) => Asset.findByPk(id);
const getActiveAssets = () => Asset.findAll({ where: { is_active: true } });
const getAssetsBySocietyId = (societyId) => Asset.findAll({ where: { society_id: societyId } });
const getActiveAssetsBySocietyId = (societyId) => Asset.findAll({ where: { society_id: societyId, is_active: true } });
const getAssetByAssetCode = (assetCode) => Asset.findOne({ where: { asset_code: assetCode } });
const updateAsset = async (id, data) => {
  await Asset.update(data, { where: { id } });
  return Asset.findByPk(id);
};
const deleteAsset = (id) => Asset.destroy({ where: { id } });

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  getActiveAssets,
  getAssetsBySocietyId,
  getActiveAssetsBySocietyId,
  getAssetByAssetCode,
  updateAsset,
  deleteAsset,
};

