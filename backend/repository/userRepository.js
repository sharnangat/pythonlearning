const User = require('../models/users');

const createUser = (data) => User.create(data);
const getUsers = () => User.findAll();
const getUserById = (id) => User.findByPk(id);
const findByEmail = (email) => User.findOne({ where: { email } });
const findByPhone = (phone) => User.findOne({ where: { phone } });
const findByEmailOrPhone = async (identifier) => {
  // Try to find by email first
  let user = await User.findOne({ where: { email: identifier } });
  if (user) return user;
  
  // If not found by email, try to find by phone
  user = await User.findOne({ where: { phone: identifier } });
  return user;
};
const updateUser = async (id, data) => {
  await User.update(data, { where: { id } });
  return User.findByPk(id);
};
const deleteUser = (id) => User.destroy({ where: { id } });

module.exports = { createUser, getUsers, getUserById, findByEmail, findByPhone, findByEmailOrPhone, updateUser, deleteUser };
