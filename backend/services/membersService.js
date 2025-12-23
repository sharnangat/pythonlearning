const membersRepository = require('../repository/membersRepository');
const logger = require('../config/logger');

// Helper function to validate email format
const isValidEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone format
const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Helper function to validate UUID format
const isValidUUID = (uuid) => {
  if (!uuid) return false; // Return false for null, undefined, or empty string
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to validate URL format
const isValidURL = (url) => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  if (!dateString) return true; // Optional field
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Helper function to sanitize string fields to their max lengths
const sanitizeStringFields = (data) => {
  const sanitized = { ...data };
  
  // Field length constraints based on model definition
  const fieldMaxLengths = {
    first_name: 100,
    middle_name: 100,
    last_name: 100,
    gender: 10,
    nationality: 50,
    primary_phone: 15,
    secondary_phone: 15,
    email: 255,
    emergency_contact_name: 255,
    emergency_contact_phone: 15,
    aadhar_number: 12,
    pan_number: 10,
    passport_number: 20,
    occupation: 255,
    organization: 255,
    designation: 255,
    membership_number: 50,
    profile_image_url: 500,
  };
  
  Object.keys(fieldMaxLengths).forEach((field) => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      if (typeof sanitized[field] === 'string') {
        // Trim whitespace and limit to max length
        sanitized[field] = sanitized[field].trim().substring(0, fieldMaxLengths[field]);
        // If after trimming it's empty, set to null for optional fields
        if (sanitized[field].length === 0 && field !== 'first_name' && field !== 'last_name' && field !== 'primary_phone') {
          sanitized[field] = null;
        }
      }
    }
  });
  
  return sanitized;
};

const createMember = async (data) => {
  logger.info('createMember - Received data', { keys: Object.keys(data) });

  // Validate required fields
  if (!data.society_id || !isValidUUID(data.society_id)) {
    throw new Error('Valid society_id (UUID) is required');
  }

  if (!data.first_name || typeof data.first_name !== 'string' || data.first_name.trim().length === 0) {
    throw new Error('First name is required');
  }

  if (!data.last_name || typeof data.last_name !== 'string' || data.last_name.trim().length === 0) {
    throw new Error('Last name is required');
  }

  if (!data.primary_phone || !isValidPhone(data.primary_phone)) {
    throw new Error('Valid primary phone number is required');
  }

  if (!data.member_type || typeof data.member_type !== 'string' || data.member_type.trim().length === 0) {
    throw new Error('Member type is required');
  }

  // Validate optional email field
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Valid email address is required');
  }

  // Validate optional phone fields
  if (data.secondary_phone && !isValidPhone(data.secondary_phone)) {
    throw new Error('Valid secondary phone number is required');
  }

  if (data.emergency_contact_phone && !isValidPhone(data.emergency_contact_phone)) {
    throw new Error('Valid emergency contact phone number is required');
  }

  // Validate UUID fields
  if (data.user_id && !isValidUUID(data.user_id)) {
    throw new Error('Valid UUID is required for user_id');
  }

  // Validate date fields
  if (data.date_of_birth && !isValidDate(data.date_of_birth)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for date_of_birth');
  }

  if (data.joining_date && !isValidDate(data.joining_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for joining_date');
  }

  if (data.leaving_date && !isValidDate(data.leaving_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for leaving_date');
  }

  // Validate URL field
  if (data.profile_image_url && !isValidURL(data.profile_image_url)) {
    throw new Error('Valid URL is required for profile_image_url');
  }

  // Check if membership number already exists (if provided)
  if (data.membership_number) {
    const existingMember = await membersRepository.findByMembershipNumber(data.membership_number);
    if (existingMember) {
      throw new Error('Member with this membership number already exists');
    }
  }

  // Check if society_id and email combination already exists (if email provided)
  if (data.email) {
    const existingMember = await membersRepository.findBySocietyIdAndEmail(data.society_id, data.email);
    if (existingMember) {
      throw new Error('Member with this email already exists in this society');
    }
  }

  // Sanitize string fields to ensure they don't exceed max lengths
  const sanitizedData = sanitizeStringFields(data);
  
  // Validate Aadhar number length (must be exactly 12 digits if provided)
  if (sanitizedData.aadhar_number) {
    // Remove any spaces or dashes
    sanitizedData.aadhar_number = sanitizedData.aadhar_number.replace(/[\s-]/g, '');
    if (sanitizedData.aadhar_number.length > 12) {
      throw new Error('Aadhar number must be exactly 12 digits');
    }
    if (sanitizedData.aadhar_number.length < 12 && sanitizedData.aadhar_number.length > 0) {
      throw new Error('Aadhar number must be exactly 12 digits');
    }
  }

  // Validate PAN number length (must be exactly 10 characters if provided)
  if (sanitizedData.pan_number) {
    sanitizedData.pan_number = sanitizedData.pan_number.replace(/[\s-]/g, '').toUpperCase();
    if (sanitizedData.pan_number.length > 10) {
      throw new Error('PAN number must be exactly 10 characters');
    }
    if (sanitizedData.pan_number.length < 10 && sanitizedData.pan_number.length > 0) {
      throw new Error('PAN number must be exactly 10 characters');
    }
  }

  const member = await membersRepository.createMember(sanitizedData);
  logger.info('Member created successfully', { id: member.id, membership_number: member.membership_number });
  return member;
};

const getMembers = async () => {
  const members = await membersRepository.getMembers();
  logger.info('Members fetched successfully', { count: members.length });
  return members;
};

const getMemberById = async (id) => {
  const member = await membersRepository.getMemberById(id);
  if (!member) {
    throw new Error('Member not found');
  }
  return member;
};

const getMembersBySocietyId = async (societyId) => {
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const members = await membersRepository.getMembersBySocietyId(societyId);
  logger.info('Members fetched by society_id', { societyId, count: members.length });
  return members;
};

const getActiveMembers = async () => {
  const members = await membersRepository.getActiveMembers();
  logger.info('Active members fetched successfully', { count: members.length });
  return members;
};

const getActiveMembersBySocietyId = async (societyId) => {
  if (!isValidUUID(societyId)) {
    throw new Error('Valid society_id (UUID) is required');
  }
  const members = await membersRepository.getActiveMembersBySocietyId(societyId);
  logger.info('Active members fetched by society_id', { societyId, count: members.length });
  return members;
};

const getMembersByUserId = async (userId) => {
  if (!isValidUUID(userId)) {
    throw new Error('Valid user_id (UUID) is required');
  }
  const members = await membersRepository.getMembersByUserId(userId);
  logger.info('Members fetched by user_id', { userId, count: members.length });
  return members;
};

const updateMember = async (id, data) => {
  logger.info('updateMember - Received data', { id, keys: Object.keys(data) });

  // Validate UUID if provided
  if (data.society_id !== undefined && data.society_id !== null && !isValidUUID(data.society_id)) {
    throw new Error('Valid UUID is required for society_id');
  }

  if (data.user_id !== undefined && data.user_id !== null && !isValidUUID(data.user_id)) {
    throw new Error('Valid UUID is required for user_id');
  }

  // Validate member_type if provided
  if (data.member_type !== undefined && data.member_type !== null) {
    if (typeof data.member_type !== 'string' || data.member_type.trim().length === 0) {
      throw new Error('Member type must be a non-empty string');
    }
  }

  // Validate optional email field if provided
  if (data.email !== undefined && data.email !== null && !isValidEmail(data.email)) {
    throw new Error('Valid email address is required');
  }

  // Validate optional phone fields if provided
  if (data.primary_phone !== undefined && data.primary_phone !== null && !isValidPhone(data.primary_phone)) {
    throw new Error('Valid primary phone number is required');
  }

  if (data.secondary_phone !== undefined && data.secondary_phone !== null && !isValidPhone(data.secondary_phone)) {
    throw new Error('Valid secondary phone number is required');
  }

  if (data.emergency_contact_phone !== undefined && data.emergency_contact_phone !== null && !isValidPhone(data.emergency_contact_phone)) {
    throw new Error('Valid emergency contact phone number is required');
  }

  // Validate date fields if provided
  if (data.date_of_birth !== undefined && data.date_of_birth !== null && !isValidDate(data.date_of_birth)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for date_of_birth');
  }

  if (data.joining_date !== undefined && data.joining_date !== null && !isValidDate(data.joining_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for joining_date');
  }

  if (data.leaving_date !== undefined && data.leaving_date !== null && !isValidDate(data.leaving_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for leaving_date');
  }

  // Validate URL field if provided
  if (data.profile_image_url !== undefined && data.profile_image_url !== null && !isValidURL(data.profile_image_url)) {
    throw new Error('Valid URL is required for profile_image_url');
  }

  // Sanitize string fields to ensure they don't exceed max lengths
  const sanitizedData = sanitizeStringFields(data);
  
  // Validate Aadhar number length (must be exactly 12 digits if provided)
  if (sanitizedData.aadhar_number !== undefined && sanitizedData.aadhar_number !== null) {
    // Remove any spaces or dashes
    sanitizedData.aadhar_number = sanitizedData.aadhar_number.replace(/[\s-]/g, '');
    if (sanitizedData.aadhar_number.length > 12) {
      throw new Error('Aadhar number must be exactly 12 digits');
    }
    if (sanitizedData.aadhar_number.length < 12 && sanitizedData.aadhar_number.length > 0) {
      throw new Error('Aadhar number must be exactly 12 digits');
    }
  }

  // Validate PAN number length (must be exactly 10 characters if provided)
  if (sanitizedData.pan_number !== undefined && sanitizedData.pan_number !== null) {
    sanitizedData.pan_number = sanitizedData.pan_number.replace(/[\s-]/g, '').toUpperCase();
    if (sanitizedData.pan_number.length > 10) {
      throw new Error('PAN number must be exactly 10 characters');
    }
    if (sanitizedData.pan_number.length < 10 && sanitizedData.pan_number.length > 0) {
      throw new Error('PAN number must be exactly 10 characters');
    }
  }

  // Check if membership number is being changed and already exists
  if (sanitizedData.membership_number) {
    const existingMember = await membersRepository.findByMembershipNumber(sanitizedData.membership_number);
    if (existingMember && existingMember.id !== id) {
      throw new Error('Member with this membership number already exists');
    }
  }

  // Check if society_id and email combination already exists (if being updated)
  if (sanitizedData.email || sanitizedData.society_id) {
    const existingMember = await membersRepository.getMemberById(id);
    if (existingMember) {
      const societyId = sanitizedData.society_id || existingMember.society_id;
      const email = sanitizedData.email || existingMember.email;
      if (email) {
        const duplicateMember = await membersRepository.findBySocietyIdAndEmail(societyId, email);
        if (duplicateMember && duplicateMember.id !== id) {
          throw new Error('Member with this email already exists in this society');
        }
      }
    }
  }

  const existingMember = await membersRepository.getMemberById(id);
  if (!existingMember) {
    throw new Error('Member not found');
  }

  const updatedMember = await membersRepository.updateMember(id, sanitizedData);
  logger.info('Member updated successfully', { id: updatedMember.id });
  return updatedMember;
};

const updateMemberByMembershipNumber = async (membershipNumber, data) => {
  logger.info('updateMemberByMembershipNumber - Received data', { membershipNumber, keys: Object.keys(data) });

  // First, find the member by membership number
  const existingMember = await membersRepository.findByMembershipNumber(membershipNumber);
  if (!existingMember) {
    throw new Error('Member not found');
  }

  // Use the same validation logic as updateMember
  // Validate UUID if provided
  if (data.society_id !== undefined && data.society_id !== null && !isValidUUID(data.society_id)) {
    throw new Error('Valid UUID is required for society_id');
  }

  if (data.user_id !== undefined && data.user_id !== null && !isValidUUID(data.user_id)) {
    throw new Error('Valid UUID is required for user_id');
  }

  // Validate member_type if provided
  if (data.member_type !== undefined && data.member_type !== null) {
    if (typeof data.member_type !== 'string' || data.member_type.trim().length === 0) {
      throw new Error('Member type must be a non-empty string');
    }
  }

  // Validate optional email field if provided
  if (data.email !== undefined && data.email !== null && !isValidEmail(data.email)) {
    throw new Error('Valid email address is required');
  }

  // Validate optional phone fields if provided
  if (data.primary_phone !== undefined && data.primary_phone !== null && !isValidPhone(data.primary_phone)) {
    throw new Error('Valid primary phone number is required');
  }

  if (data.secondary_phone !== undefined && data.secondary_phone !== null && !isValidPhone(data.secondary_phone)) {
    throw new Error('Valid secondary phone number is required');
  }

  if (data.emergency_contact_phone !== undefined && data.emergency_contact_phone !== null && !isValidPhone(data.emergency_contact_phone)) {
    throw new Error('Valid emergency contact phone number is required');
  }

  // Validate date fields if provided
  if (data.date_of_birth !== undefined && data.date_of_birth !== null && !isValidDate(data.date_of_birth)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for date_of_birth');
  }

  if (data.joining_date !== undefined && data.joining_date !== null && !isValidDate(data.joining_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for joining_date');
  }

  if (data.leaving_date !== undefined && data.leaving_date !== null && !isValidDate(data.leaving_date)) {
    throw new Error('Valid date format (YYYY-MM-DD) is required for leaving_date');
  }

  // Validate URL field if provided
  if (data.profile_image_url !== undefined && data.profile_image_url !== null && !isValidURL(data.profile_image_url)) {
    throw new Error('Valid URL is required for profile_image_url');
  }

  // Sanitize string fields to ensure they don't exceed max lengths
  const sanitizedData = sanitizeStringFields(data);
  
  // Validate Aadhar number length (must be exactly 12 digits if provided)
  if (sanitizedData.aadhar_number !== undefined && sanitizedData.aadhar_number !== null) {
    // Remove any spaces or dashes
    sanitizedData.aadhar_number = sanitizedData.aadhar_number.replace(/[\s-]/g, '');
    if (sanitizedData.aadhar_number.length > 12) {
      throw new Error('Aadhar number must be exactly 12 digits');
    }
    if (sanitizedData.aadhar_number.length < 12 && sanitizedData.aadhar_number.length > 0) {
      throw new Error('Aadhar number must be exactly 12 digits');
    }
  }

  // Validate PAN number length (must be exactly 10 characters if provided)
  if (sanitizedData.pan_number !== undefined && sanitizedData.pan_number !== null) {
    sanitizedData.pan_number = sanitizedData.pan_number.replace(/[\s-]/g, '').toUpperCase();
    if (sanitizedData.pan_number.length > 10) {
      throw new Error('PAN number must be exactly 10 characters');
    }
    if (sanitizedData.pan_number.length < 10 && sanitizedData.pan_number.length > 0) {
      throw new Error('PAN number must be exactly 10 characters');
    }
  }

  // Check if membership number is being changed and already exists
  if (sanitizedData.membership_number && sanitizedData.membership_number !== membershipNumber) {
    const duplicateMember = await membersRepository.findByMembershipNumber(sanitizedData.membership_number);
    if (duplicateMember) {
      throw new Error('Member with this membership number already exists');
    }
  }

  // Check if society_id and email combination already exists (if being updated)
  if (sanitizedData.email || sanitizedData.society_id) {
    const societyId = sanitizedData.society_id || existingMember.society_id;
    const email = sanitizedData.email || existingMember.email;
    if (email) {
      const duplicateMember = await membersRepository.findBySocietyIdAndEmail(societyId, email);
      if (duplicateMember && duplicateMember.id !== existingMember.id) {
        throw new Error('Member with this email already exists in this society');
      }
    }
  }

  const updatedMember = await membersRepository.updateMemberByMembershipNumber(membershipNumber, sanitizedData);
  logger.info('Member updated successfully by membership number', { membershipNumber, id: updatedMember.id });
  return updatedMember;
};

const deleteMember = async (id) => {
  const existingMember = await membersRepository.getMemberById(id);
  if (!existingMember) {
    throw new Error('Member not found');
  }

  await membersRepository.deleteMember(id);
  logger.info('Member deleted successfully', { id });
  return { message: 'Member deleted successfully' };
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  getMembersBySocietyId,
  getActiveMembers,
  getActiveMembersBySocietyId,
  getMembersByUserId,
  updateMember,
  updateMemberByMembershipNumber,
  deleteMember,
};

