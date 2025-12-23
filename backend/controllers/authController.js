const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

// Register new user
const register = async (req, res, next) => {
    try {
        const { username, email, password, first_name, last_name, phone } = req.body;

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            logger.warn('Registration failed: user already exists', { username, email, ip: req.ip });
            return res.status(409).json({
                success: false,
                message: 'Username or email already exists.'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = await query(`
            INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, username, email, first_name, last_name, phone, status, created_at
        `, [
            username,
            email,
            passwordHash,
            first_name || null,
            last_name || null,
            phone || null,
            'pending_verification',
            false
        ]);

        const user = result.rows[0];

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email });

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            user.id,
            'create',
            'user',
            user.id,
            'User registered',
            req.ip
        ]);

        logger.info('User registered successfully', {
            userId: user.id,
            username: user.username,
            email: user.email,
            ip: req.ip,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    status: user.status
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        logger.info('Login attempt', { username: username || email, ip: req.ip });

        if (!username && !email) {
            logger.warn('Login failed: missing credentials', { ip: req.ip });
            return res.status(400).json({
                success: false,
                message: 'Username or email is required.'
            });
        }

        if (!password) {
            logger.warn('Login failed: missing password', { username: username || email, ip: req.ip });
            return res.status(400).json({
                success: false,
                message: 'Password is required.'
            });
        }

        // Find user
        const userResult = await query(
            'SELECT id, username, email, password_hash, first_name, last_name, status, email_verified, failed_login_attempts, account_locked_until FROM users WHERE username = $1 OR email = $2',
            [username || email, username || email]
        );

        if (userResult.rows.length === 0) {
            logger.warn('Login failed: user not found', { username: username || email, ip: req.ip });
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
        }

        const user = userResult.rows[0];

        // Check if account is locked
        if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
            logger.warn('Login failed: account locked', {
                userId: user.id,
                username: user.username,
                ip: req.ip,
                lockedUntil: user.account_locked_until,
            });
            return res.status(403).json({
                success: false,
                message: 'Account is locked. Please try again later.'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            // Increment failed login attempts
            const failedAttempts = (user.failed_login_attempts || 0) + 1;
            const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // Lock for 30 minutes after 5 failed attempts

            await query(
                'UPDATE users SET failed_login_attempts = $1, account_locked_until = $2 WHERE id = $3',
                [failedAttempts, lockUntil, user.id]
            );

            logger.warn('Login failed: invalid password', {
                userId: user.id,
                username: user.username,
                ip: req.ip,
                failedAttempts,
                accountLocked: failedAttempts >= 5,
            });

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
                ...(failedAttempts >= 5 && { lockMessage: 'Account will be locked after 5 failed attempts.' })
            });
        }

        // Reset failed login attempts
        await query(
            'UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL, last_login = NOW(), last_login_ip = $1 WHERE id = $2',
            [req.ip, user.id]
        );

        logger.info('User logged in successfully', {
            userId: user.id,
            username: user.username,
            email: user.email,
            ip: req.ip,
        });

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email });

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, description, ip_address)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            user.id,
            'login',
            'user',
            'User logged in',
            req.ip
        ]);

        res.json({
            success: true,
            message: 'Login successful.',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    status: user.status,
                    email_verified: user.email_verified
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get current user profile
const getProfile = async (req, res, next) => {
    try {
        const userResult = await query(`
            SELECT id, username, email, first_name, last_name, phone, status, email_verified, phone_verified, created_at, last_login
            FROM users
            WHERE id = $1
        `, [req.userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Get user roles
        const rolesResult = await query(`
            SELECT r.id, r.role_name, r.display_name, ur.society_id, s.society_name
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            LEFT JOIN societies s ON ur.society_id = s.id
            WHERE ur.user_id = $1 AND ur.is_active = TRUE
            AND (ur.valid_until IS NULL OR ur.valid_until > NOW())
        `, [req.userId]);

        const user = userResult.rows[0];
        user.roles = rolesResult.rows;

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// Logout (client-side token removal, but we can log it)
const logout = async (req, res, next) => {
    try {
        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, description, ip_address)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            req.userId,
            'logout',
            'user',
            'User logged out',
            req.ip
        ]);

        res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    logout
};

