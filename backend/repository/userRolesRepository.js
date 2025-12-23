const UserRole = require('../models/userRoles');
const { Op } = require('sequelize');

const createUserRole = (data) => UserRole.create(data);
const getUserRoles = () => UserRole.findAll();
const getUserRoleById = (id) => UserRole.findByPk(id);
const getActiveUserRoles = () => UserRole.findAll({ where: { is_active: true } });

// Search functions
const getUserRolesByUserId = (userId) => UserRole.findAll({ where: { user_id: userId } });
const getUserRolesBySocietyId = (societyId) => UserRole.findAll({ where: { society_id: societyId } });
const getUserRolesByRoleId = (roleId) => UserRole.findAll({ where: { role_id: roleId } });
const getUserRolesByUserAndSociety = (userId, societyId) => 
  UserRole.findAll({ where: { user_id: userId, society_id: societyId } });
const getUserRolesByUserSocietyAndRole = (userId, societyId, roleId) =>
  UserRole.findOne({ where: { user_id: userId, society_id: societyId, role_id: roleId } });
const getActiveUserRolesByUserId = (userId) => 
  UserRole.findAll({ where: { user_id: userId, is_active: true } });
const getActiveUserRolesBySocietyId = (societyId) => 
  UserRole.findAll({ where: { society_id: societyId, is_active: true } });
const getActiveUserRolesByRoleId = (roleId) => 
  UserRole.findAll({ where: { role_id: roleId, is_active: true } });

// Search with multiple filters
const searchUserRoles = (filters) => {
  const where = {};
  
  if (filters.user_id) {
    where.user_id = filters.user_id;
  }
  if (filters.society_id) {
    where.society_id = filters.society_id;
  }
  if (filters.role_id) {
    where.role_id = filters.role_id;
  }
  if (filters.assigned_by) {
    where.assigned_by = filters.assigned_by;
  }
  if (filters.is_active !== undefined) {
    where.is_active = filters.is_active;
  }
  
  // Handle date filters
  if (filters.current_date) {
    // Check if role is currently valid (valid_from <= current_date AND (valid_until IS NULL OR valid_until >= current_date))
    const currentDate = filters.current_date;
    where.valid_from = { [Op.lte]: currentDate };
    where[Op.or] = [
      { valid_until: null },
      { valid_until: { [Op.gte]: currentDate } }
    ];
  } else {
    // Only apply these if current_date is not specified
    if (filters.valid_from) {
      where.valid_from = { [Op.gte]: filters.valid_from };
    }
    if (filters.valid_until) {
      where.valid_until = { [Op.lte]: filters.valid_until };
    }
  }

  return UserRole.findAll({ where });
};

const updateUserRole = async (id, data) => {
  await UserRole.update(data, { where: { id } });
  return UserRole.findByPk(id);
};

const deleteUserRole = (id) => UserRole.destroy({ where: { id } });

module.exports = {
  createUserRole,
  getUserRoles,
  getUserRoleById,
  getActiveUserRoles,
  getUserRolesByUserId,
  getUserRolesBySocietyId,
  getUserRolesByRoleId,
  getUserRolesByUserAndSociety,
  getUserRolesByUserSocietyAndRole,
  getActiveUserRolesByUserId,
  getActiveUserRolesBySocietyId,
  getActiveUserRolesByRoleId,
  searchUserRoles,
  updateUserRole,
  deleteUserRole,
};

