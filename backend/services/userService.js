const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userRepository = require('../repository/userRepository');
const userRolesRepository = require('../repository/userRolesRepository');
const rolesRepository = require('../repository/rolesRepository');
const logger = require('../config/logger');
const emailService = require('./emailService');
const { generateToken } = require('../config/jwt');

// Helper function to validate UUID format
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to sanitize date fields
const sanitizeDateFields = (data) => {
  const dateFields = [
    'account_locked_until',
    'password_reset_expires',
    'email_verification_expires',
    'last_login',
  ];
  
  const sanitized = { ...data };
  
  dateFields.forEach((field) => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      // If it's already a Date object, keep it
      if (sanitized[field] instanceof Date) {
        return;
      }
      
      // If it's a string, try to parse it
      if (typeof sanitized[field] === 'string') {
        const parsedDate = new Date(sanitized[field]);
        // Check if the date is valid
        if (isNaN(parsedDate.getTime()) || sanitized[field].toLowerCase() === 'invalid date') {
          // Remove invalid date fields
          logger.warn(`Removing invalid date field: ${field}`, { value: sanitized[field] });
          delete sanitized[field];
        } else {
          sanitized[field] = parsedDate;
        }
      } else {
        // For other types, remove the field
        logger.warn(`Removing non-date value from date field: ${field}`, { value: sanitized[field], type: typeof sanitized[field] });
        delete sanitized[field];
      }
    }
  });
  
  return sanitized;
};

// Helper function to sanitize UUID fields
const sanitizeUUIDFields = (data) => {
  const uuidFields = ['created_by', 'id'];
  
  const sanitized = { ...data };
  
  uuidFields.forEach((field) => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      // Convert to string if not already
      const uuidValue = String(sanitized[field]).trim();
      
      // Remove empty strings or invalid UUIDs
      if (uuidValue === '' || !isValidUUID(uuidValue)) {
        logger.warn(`Removing invalid UUID field: ${field}`, { value: sanitized[field] });
        delete sanitized[field];
      } else {
        sanitized[field] = uuidValue;
      }
    }
  });
  
  return sanitized;
};

// Generate email verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format (basic validation)
const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const createUser = async (data) => {
  // Log received data for debugging (including password)
  logger.info('createUser - Received data keys', { 
    keys: Object.keys(data),
    hasPassword: !!data.password,
    passwordType: typeof data.password,
    passwordLength: data.password ? data.password.length : 0,
    passwordValue: data.password, // DEBUG: Print actual password
    fullData: data // DEBUG: Print full data including password
  });

  // Validate required fields
  if (!data.email || !isValidEmail(data.email)) {
    throw new Error('Valid email address is required');
  }

  // Check if password exists and is not empty
  if (!data.password) {
    logger.warn('createUser - Password missing', { receivedData: Object.keys(data) });
    throw new Error('Password is required');
  }
  
  if (typeof data.password !== 'string') {
    logger.warn('createUser - Password is not a string', { passwordType: typeof data.password });
    throw new Error('Password must be a string');
  }
  
  if (data.password.trim().length === 0) {
    logger.warn('createUser - Password is empty or whitespace');
    throw new Error('Password cannot be empty');
  }

  // Validate optional fields if provided
  if (data.username && (data.username.length < 3 || data.username.length > 50)) {
    throw new Error('Username must be between 3 and 50 characters');
  }

  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error('Invalid phone number format');
  }

  if (data.first_name && data.first_name.length > 100) {
    throw new Error('First name must be 100 characters or less');
  }

  if (data.last_name && data.last_name.length > 100) {
    throw new Error('Last name must be 100 characters or less');
  }

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password before storing
  const saltRounds = 10;
  logger.info('Hashing password before storing', { 
    passwordLength: data.password.length,
    saltRounds 
  });
  const password_hash = await bcrypt.hash(data.password, saltRounds);
  logger.info('Password hashed successfully', { 
    hashLength: password_hash.length,
    hashPrefix: password_hash.substring(0, 20) + '...'
  });

  // Sanitize date and UUID fields before creating user
  let sanitizedData = sanitizeDateFields(data);
  sanitizedData = sanitizeUUIDFields(sanitizedData);
  
  // Prepare user data - include all allowed model fields
  const userData = {
    // Required fields
    email: sanitizedData.email.trim().toLowerCase(),
    password_hash: password_hash,
    
    // Optional user fields
    username: sanitizedData.username ? sanitizedData.username.trim() : `user_${Date.now()}`,
    first_name: sanitizedData.first_name ? sanitizedData.first_name.trim() : null,
    last_name: sanitizedData.last_name ? sanitizedData.last_name.trim() : null,
    phone: sanitizedData.phone ? sanitizedData.phone.trim() : null,
    
    // Status fields (can be set during registration)
    status: sanitizedData.status || 'pending_verification',
    
    // Email verification fields (can be set but defaults to false)
    email_verified: sanitizedData.email_verified === true ? true : false,
    phone_verified: sanitizedData.phone_verified === true ? true : false,
    
    // Created by (if provided and valid UUID)
    created_by: sanitizedData.created_by || null,
  };

  // Generate email verification token
  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date();
  verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours from now
  
  // Add verification token and expiration
  userData.email_verification_token = verificationToken;
  userData.email_verification_expires = verificationExpires;
  
  // Create user
  const user = await userRepository.createUser(userData);
  
  // Send registration email (don't wait for it, send asynchronously)
  emailService.sendRegistrationEmail(user, verificationToken).catch((error) => {
    logger.error('Failed to send registration email after user creation', {
      error: error.message,
      userId: user.id,
      email: user.email,
    });
  });
  
  return user;
};
const getUsers = async () => userRepository.getUsers();
const getUserById = async (id) => {
  const user1 = await userRepository.getUserById(id);
  if (!user1) throw new Error('User not found');
  return user1;
};
const updateUser = async (id, data) => {
  // Sanitize date and UUID fields before updating user
  let sanitizedData = sanitizeDateFields(data);
  sanitizedData = sanitizeUUIDFields(sanitizedData);
  // Don't allow updating the id field
  delete sanitizedData.id;
  const updatedUser = await userRepository.updateUser(id, sanitizedData);
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};
const deleteUser = async (id) => {
  const deleted = await userRepository.deleteUser(id);
  if (!deleted) throw new Error('User not found');
  return { message: 'User deleted successfully' };
};

// Helper function to check if identifier is email or phone
const isEmail = (identifier) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
};

const loginUser = async (identifier, password, ipAddress) => {
  // Find user by email or phone
  const user = await userRepository.findByEmailOrPhone(identifier);
  
  if (!user) {
    logger.warn('Login attempt with non-existent identifier', { 
      identifier, 
      isEmail: isEmail(identifier) 
    });
    throw new Error('Invalid email/phone or password');
  }

  // Check if account is locked
  if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
    logger.warn('Login attempt on locked account', {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      lockedUntil: user.account_locked_until,
    });
    throw new Error('Account is locked. Please try again later.');
  }

  // Verify password using bcrypt.compare
  logger.info('Verifying password', { 
    email: user.email,
    hasPasswordHash: !!user.password_hash,
    passwordHashLength: user.password_hash ? user.password_hash.length : 0
  });
  
  if (!user.password_hash) {
    logger.error('User has no password hash stored', { userId: user.id, email: user.email, phone: user.phone });
    throw new Error('Invalid email/phone or password');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  logger.info('Password verification result', { 
    email: user.email,
    isValid: isPasswordValid
  });
  
  if (!isPasswordValid) {
    // Increment failed login attempts
    const failedAttempts = (user.failed_login_attempts || 0) + 1;
    const maxAttempts = 5;
    const lockDurationHours = 1;

    let updateData = {
      failed_login_attempts: failedAttempts,
    };

    // Lock account after max attempts
    if (failedAttempts >= maxAttempts) {
      const lockUntil = new Date();
      lockUntil.setHours(lockUntil.getHours() + lockDurationHours);
      updateData.account_locked_until = lockUntil;
      
      logger.warn('Account locked due to too many failed login attempts', {
        userId: user.id,
        email: user.email,
        failedAttempts,
        lockedUntil: lockUntil,
      });
    }

    await userRepository.updateUser(user.id, updateData);

    logger.warn('Invalid login attempt', {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      failedAttempts,
      ipAddress,
    });

    throw new Error('Invalid email/phone or password');
  }

  // Successful login - reset failed attempts and update last login
  const updateData = {
    failed_login_attempts: 0,
    account_locked_until: null,
    last_login: new Date(),
    last_login_ip: ipAddress,
  };

  await userRepository.updateUser(user.id, updateData);

  // Fetch user roles and verify roles exist
  const userRoles = await userRolesRepository.getActiveUserRolesByUserId(user.id);
  
  // Get role details for each user role and verify role validity
  const rolesWithDetails = [];
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  for (const userRole of userRoles) {
    // Verify role exists in roles table
    const role = await rolesRepository.getRoleById(userRole.role_id);
    if (!role) {
      logger.warn('User role references non-existent role', {
        userId: user.id,
        userRoleId: userRole.id,
        roleId: userRole.role_id,
      });
      continue;
    }
    
    // Verify role is active
    if (!role.is_active) {
      logger.warn('User role references inactive role', {
        userId: user.id,
        roleId: role.id,
        roleName: role.role_name,
      });
      continue;
    }
    
    // Verify user role is currently valid (check date range)
    if (userRole.valid_from && userRole.valid_from > currentDate) {
      logger.warn('User role not yet valid', {
        userId: user.id,
        roleId: role.id,
        roleName: role.role_name,
        validFrom: userRole.valid_from,
        currentDate,
      });
      continue;
    }
    
    if (userRole.valid_until && userRole.valid_until < currentDate) {
      logger.warn('User role expired', {
        userId: user.id,
        roleId: role.id,
        roleName: role.role_name,
        validUntil: userRole.valid_until,
        currentDate,
      });
      continue;
    }
    
    // Role is valid, include in response
    rolesWithDetails.push({
      user_role_id: userRole.id,
      role_id: role.id,
      role_name: role.role_name,
      display_name: role.display_name,
      description: role.description,
      hierarchy_level: role.hierarchy_level,
      society_id: userRole.society_id,
      assigned_date: userRole.assigned_date,
      valid_from: userRole.valid_from,
      valid_until: userRole.valid_until,
      is_active: userRole.is_active,
    });
  }

  // Verify user has at least one valid role
  if (rolesWithDetails.length === 0) {
    logger.warn('User logged in but has no active roles', {
      userId: user.id,
      email: user.email,
    });
    // Don't block login, but log a warning
  }

  // Generate JWT token
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    roles: rolesWithDetails.map(r => r.role_name), // Include role names in token
  };

  const token = generateToken(tokenPayload);

  logger.info('User logged in successfully', {
    userId: user.id,
    email: user.email,
    ipAddress,
    rolesCount: rolesWithDetails.length,
    roles: rolesWithDetails.map(r => r.role_name),
  });

  // Return user data without sensitive information
  const userResponse = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    status: user.status,
    email_verified: user.email_verified,
    phone_verified: user.phone_verified,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return {
    user: userResponse,
    token,
    roles: rolesWithDetails, // Include user role details in response
  };
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser };
