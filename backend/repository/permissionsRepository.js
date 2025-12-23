const Permission = require('../models/permissions');

const createPermission = (data) => Permission.create(data);
const getPermissions = () => Permission.findAll();
const getPermissionById = (id) => Permission.findByPk(id);
const getActivePermissions = () => Permission.findAll({ where: { is_active: true } });
const getPermissionByCode = (code) => Permission.findOne({ where: { permission_code: code } });
const getPermissionByName = (name) => Permission.findOne({ where: { permission_name: name } });
const getPermissionsByModule = (module) => Permission.findAll({ where: { module } });
const getActivePermissionsByModule = (module) => Permission.findAll({ where: { module, is_active: true } });
const updatePermission = async (id, data) => {
  await Permission.update(data, { where: { permission_id: id } });
  return Permission.findByPk(id);
};
const deletePermission = (id) => Permission.destroy({ where: { permission_id: id } });

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

