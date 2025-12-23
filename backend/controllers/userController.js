const bcrypt = require('bcrypt');
const { query } = require('../config/database');

// Get all users
const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            whereClause += ` AND (username ILIKE $${paramCount} OR email ILIKE $${paramCount} OR first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (status) {
            paramCount++;
            whereClause += ` AND status = $${paramCount}`;
            params.push(status);
        }

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT id, username, email, first_name, last_name, phone, status, email_verified, phone_verified, created_at, last_login
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        const countResult = await query(`SELECT COUNT(*) as total FROM users ${whereClause}`, params.slice(0, -2));

        res.json({
            success: true,
            data: {
                users: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].total),
                    pages: Math.ceil(countResult.rows[0].total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT id, username, email, first_name, last_name, phone, status, email_verified, phone_verified, created_at, last_login, last_login_ip
            FROM users
            WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
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
        `, [id]);

        const user = result.rows[0];
        user.roles = rolesResult.rows;

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// Update user
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, status } = req.body;

        const updates = [];
        const params = [];
        let paramCount = 0;

        if (first_name !== undefined) {
            paramCount++;
            updates.push(`first_name = $${paramCount}`);
            params.push(first_name);
        }
        if (last_name !== undefined) {
            paramCount++;
            updates.push(`last_name = $${paramCount}`);
            params.push(last_name);
        }
        if (phone !== undefined) {
            paramCount++;
            updates.push(`phone = $${paramCount}`);
            params.push(phone);
        }
        if (status !== undefined) {
            paramCount++;
            updates.push(`status = $${paramCount}`);
            params.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update.'
            });
        }

        paramCount++;
        updates.push(`updated_by = $${paramCount}`);
        params.push(req.userId);
        paramCount++;
        params.push(id);

        const result = await query(`
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, username, email, first_name, last_name, phone, status, email_verified, phone_verified
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'user', id, 'User updated', req.ip]);

        res.json({
            success: true,
            message: 'User updated successfully.',
            data: { user: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const userResult = await query('SELECT id FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Soft delete (update status)
        await query('UPDATE users SET status = $1, updated_by = $2 WHERE id = $3', ['inactive', req.userId, id]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'user', id, 'User deleted', req.ip]);

        res.json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

// Change password
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id || req.userId;

        // Get user
        const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Verify current password (if not admin changing someone else's password)
        if (userId === req.userId) {
            const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect.'
                });
            }
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await query('UPDATE users SET password_hash = $1, updated_by = $2 WHERE id = $3', [passwordHash, req.userId, userId]);

        res.json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword
};

