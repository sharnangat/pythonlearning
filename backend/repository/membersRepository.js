const Member = require('../models/members');

const createMember = (data) => Member.create(data);
const getMembers = () => Member.findAll();
const getMemberById = (id) => Member.findByPk(id);
const getMembersBySocietyId = (societyId) => Member.findAll({ where: { society_id: societyId } });
const getActiveMembers = () => Member.findAll({ where: { is_active: true } });
const getActiveMembersBySocietyId = (societyId) => Member.findAll({ where: { society_id: societyId, is_active: true } });
const getMembersByUserId = (userId) => Member.findAll({ where: { user_id: userId } });
const findByMembershipNumber = (membershipNumber) => Member.findOne({ where: { membership_number: membershipNumber } });
const findBySocietyIdAndEmail = async (societyId, email) => {
  return Member.findOne({ where: { society_id: societyId, email } });
};
const updateMember = async (id, data) => {
  await Member.update(data, { where: { id } });
  return Member.findByPk(id);
};
const updateMemberByMembershipNumber = async (membershipNumber, data) => {
  await Member.update(data, { where: { membership_number: membershipNumber } });
  return Member.findOne({ where: { membership_number: membershipNumber } });
};
const deleteMember = (id) => Member.destroy({ where: { id } });

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  getMembersBySocietyId,
  getActiveMembers,
  getActiveMembersBySocietyId,
  getMembersByUserId,
  findByMembershipNumber,
  findBySocietyIdAndEmail,
  updateMember,
  updateMemberByMembershipNumber,
  deleteMember,
};

