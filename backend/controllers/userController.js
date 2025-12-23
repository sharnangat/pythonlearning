const userService = require('../services/userService');
const logger = require('../config/logger');

const createUser = async (req, res) => {
  try {
    // Handle password_hash being sent instead of password (for mobile app compatibility)
    // If password_hash is sent but password is not, treat it as the plain password
    if (!req.body.password && req.body.password_hash) {
      const passwordHash = req.body.password_hash;
      // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$ and is 60 chars)
      const isBcryptHash = /^\$2[ayb]\$.{56}$/.test(passwordHash);
      
      if (!isBcryptHash) {
        // It's a plain password, use it as password
        req.body.password = passwordHash;
        logger.info('Using password_hash as password (plain text detected)', {
          email: req.body.email
        });
      } else {
        // It's already a hash - we can't use it, need plain password
        logger.warn('password_hash appears to be a bcrypt hash, but password field is required');
      }
    }
    
    // Log all received data with password details (for debugging)
    logger.info('Creating new user - Raw request body', {
      hasPassword: !!req.body.password,
      passwordType: typeof req.body.password,
      passwordLength: req.body.password ? req.body.password.length : 0,
      hasPasswordHash: !!req.body.password_hash,
      passwordValue: req.body.password, // DEBUG: Print actual password
      allKeys: Object.keys(req.body),
      bodyKeysCount: Object.keys(req.body).length,
      fullBody: req.body // DEBUG: Print full body including password
    });
    
    // Log all received data (including password for debugging)
    logger.info('Creating new user - Received data', req.body);
    
    // Check if password is missing before calling service
    if (!req.body.password) {
      logger.error('Password missing in request body', { 
        bodyKeys: Object.keys(req.body),
        body: { ...req.body, password: 'NOT PRESENT' }
      });
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const user = await userService.createUser(req.body);
    logger.info('User created successfully', { userId: user.id, email: user.email });
    res.status(201).json(user);
  } catch (err) {
    // Log all received data on error (including password for debugging)
    logger.warn('Failed to create user', { 
      error: err.message, 
      receivedData: req.body, // DEBUG: Print full body including password
      hasPassword: !!req.body.password,
      passwordType: typeof req.body.password,
      passwordValue: req.body.password // DEBUG: Print actual password
    });
    // If user already exists, surface a conflict status; otherwise fall back to bad request.
    const status = err.message === 'User already exists with this email' ? 409 : 400;
    res.status(status).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    logger.info('Fetching all users - Received data', { 
      query: req.query,
      params: req.params,
      headers: req.headers
    });
    const users = await userService.getUsers();
    logger.info('Users fetched successfully', { count: users.length });
    res.json(users);
  } catch (err) {
    logger.error('Failed to fetch users', { 
      error: err.message, 
      stack: err.stack,
      query: req.query,
      params: req.params
    });
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    logger.info('Fetching user by ID - Received data', { 
      userId: req.params.id,
      params: req.params,
      query: req.query
    });
    const user = await userService.getUserById(req.params.id);
    logger.info('User fetched successfully', { userId: user.id });
    res.json(user);
  } catch (err) {
    logger.warn('User not found', { 
      userId: req.params.id, 
      error: err.message,
      params: req.params,
      query: req.query
    });
    res.status(404).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    // Log all received data (mask password if present)
    const logData = { ...req.body };
    if (logData.password) {
      logData.password = '***MASKED***';
    }
    logger.info('Updating user - Received data', { 
      userId: req.params.id, 
      receivedData: logData,
      params: req.params,
      query: req.query
    });
    
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    logger.info('User updated successfully', { userId: updatedUser.id });
    res.json(updatedUser);
  } catch (err) {
    const logData = { ...req.body };
    if (logData.password) {
      logData.password = '***MASKED***';
    }
    logger.warn('Failed to update user', { 
      userId: req.params.id, 
      error: err.message,
      receivedData: logData
    });
    res.status(404).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    logger.info('Deleting user - Received data', { 
      userId: req.params.id,
      params: req.params,
      query: req.query,
      body: req.body
    });
    const result = await userService.deleteUser(req.params.id);
    logger.info('User deleted successfully', { userId: req.params.id });
    res.json(result);
  } catch (err) {
    logger.warn('Failed to delete user', { 
      userId: req.params.id, 
      error: err.message,
      params: req.params,
      query: req.query
    });
    res.status(404).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Determine login identifier (email takes priority if both provided)
    const identifier = email || phone;

    // Log all received data (mask password)
    logger.info('Login attempt - Received data', { 
      email, 
      phone,
      identifier,
      password: '***MASKED***',
      allBodyData: { ...req.body, password: '***MASKED***' }
    });

    // Validate input - either email or phone is required
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email or phone and password are required' });
    }

    // Get IP address from request
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';

    const result = await userService.loginUser(identifier, password, ipAddress);
    logger.info('User logged in successfully', { 
      identifier, 
      email: result.user.email,
      phone: result.user.phone,
      userId: result.user.id 
    });
    res.status(200).json(result);
  } catch (err) {
    // Log all received data on error (mask password)
    logger.warn('Login failed', { 
      error: err.message, 
      email: req.body.email,
      phone: req.body.phone,
      receivedData: { ...req.body, password: '***MASKED***' }
    });
    
    // Determine appropriate status code
    let status = 401;
    if (err.message.includes('locked')) {
      status = 423; // 423 Locked
    } else if (err.message.includes('Invalid email/phone or password') || err.message.includes('Invalid email or password')) {
      status = 401; // Unauthorized
    }

    res.status(status).json({ message: err.message });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser };
