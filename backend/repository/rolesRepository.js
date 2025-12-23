const Role = require('../models/roles');

const createRole = (data) => Role.create(data);
const getRoles = () => Role.findAll();
const getRoleById = (id) => Role.findByPk(id);
const getActiveRoles = () => Role.findAll({ where: { is_active: true } });
const getRoleByRoleName = (roleName) => Role.findOne({ where: { role_name: roleName } });
const updateRole = async (id, data) => {
  await Role.update(data, { where: { id } });
  return Role.findByPk(id);
};
const deleteRole = (id) => Role.destroy({ where: { id } });

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getActiveRoles,
  getRoleByRoleName,
  updateRole,
  deleteRole,
};

