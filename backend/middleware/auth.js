const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please provide a valid token.'
            });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token.'
            });
        }

        // Get user from database
        const userResult = await query(
            'SELECT id, username, email, first_name, last_name, status, email_verified FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found.'
            });
        }

        const user = userResult.rows[0];

        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is not active. Please contact administrator.'
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed.'
        });
    }
};

// Permission check middleware
const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required.'
                });
            }

            // Get user roles
            const rolesResult = await query(`
                SELECT r.id, r.role_name, r.hierarchy_level, ur.society_id
                FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = $1 AND ur.is_active = TRUE
                AND (ur.valid_until IS NULL OR ur.valid_until > NOW())
            `, [req.userId]);

            if (rolesResult.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'No active roles assigned.'
                });
            }

            const roles = rolesResult.rows;
            const roleIds = roles.map(r => r.id);

            // Check if user has superAdmin role
            const hasSuperAdmin = roles.some(r => r.role_name === 'superAdmin');
            if (hasSuperAdmin) {
                return next();
            }

            // Check permissions
            const permissionCode = `${resource.toUpperCase().substring(0, 3)}_${action.toUpperCase()}`;
            const permissionResult = await query(`
                SELECT p.id
                FROM permissions p
                JOIN role_permissions rp ON p.id = rp.permission_id
                WHERE rp.role_id = ANY($1::uuid[])
                AND (p.permission_code = $2 OR p.permission_name = $3)
                AND rp.granted = TRUE
            `, [roleIds, permissionCode, `${resource}.${action}`]);

            if (permissionResult.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: `You don't have permission to ${action} ${resource}.`
                });
            }

            req.userRoles = roles;
            next();
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Permission check failed.'
            });
        }
    };
};

// Role check middleware
const checkRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required.'
                });
            }

            const rolesResult = await query(`
                SELECT r.role_name
                FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = $1 AND ur.is_active = TRUE
                AND (ur.valid_until IS NULL OR ur.valid_until > NOW())
            `, [req.userId]);

            const userRoles = rolesResult.rows.map(r => r.role_name);
            const hasRole = allowedRoles.some(role => userRoles.includes(role));

            if (!hasRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Role check failed.'
            });
        }
    };
};

module.exports = {
    generateToken,
    verifyToken,
    authenticate,
    checkPermission,
    checkRole
};

