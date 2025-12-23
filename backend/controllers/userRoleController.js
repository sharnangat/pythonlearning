const { query } = require('../config/database');

// Get all user roles
const getUserRoles = async (req, res, next) => {
    try {
        const { user_id, role_id, society_id, is_active } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (user_id) {
            paramCount++;
            whereClause += ` AND ur.user_id = $${paramCount}`;
            params.push(user_id);
        }
        if (role_id) {
            paramCount++;
            whereClause += ` AND ur.role_id = $${paramCount}`;
            params.push(role_id);
        }
        if (society_id) {
            paramCount++;
            whereClause += ` AND ur.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (is_active !== undefined) {
            paramCount++;
            whereClause += ` AND ur.is_active = $${paramCount}`;
            params.push(is_active === 'true');
        }

        const result = await query(`
            SELECT ur.*,
                   u.username, u.email,
                   r.role_name, r.display_name as role_display_name,
                   s.society_name,
                   assigned_by_user.username as assigned_by_username
            FROM user_roles ur
            LEFT JOIN users u ON ur.user_id = u.id
            LEFT JOIN roles r ON ur.role_id = r.id
            LEFT JOIN societies s ON ur.society_id = s.id
            LEFT JOIN users assigned_by_user ON ur.assigned_by = assigned_by_user.id
            ${whereClause}
            ORDER BY ur.assigned_date DESC
        `, params);

        res.json({ success: true, data: { user_roles: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get user role by ID
const getUserRoleById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT ur.*,
                   u.username, u.email,
                   r.role_name, r.display_name as role_display_name,
                   s.society_name,
                   assigned_by_user.username as assigned_by_username
            FROM user_roles ur
            LEFT JOIN users u ON ur.user_id = u.id
            LEFT JOIN roles r ON ur.role_id = r.id
            LEFT JOIN societies s ON ur.society_id = s.id
            LEFT JOIN users assigned_by_user ON ur.assigned_by = assigned_by_user.id
            WHERE ur.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User role not found.' });
        }

        res.json({ success: true, data: { user_role: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Update user role
const updateUserRole = async (req, res, next) => {
    try {
        const { is_active, valid_until, revoked_at } = req.body;
        const updates = [];
        const params = [];
        let paramCount = 0;

        if (is_active !== undefined) {
            paramCount++;
            updates.push(`is_active = $${paramCount}`);
            params.push(is_active);
        }
        if (valid_until !== undefined) {
            paramCount++;
            updates.push(`valid_until = $${paramCount}`);
            params.push(valid_until);
        }
        if (revoked_at !== undefined) {
            paramCount++;
            updates.push(`revoked_at = $${paramCount}, revoked_by = $${paramCount + 1}`);
            params.push(revoked_at, req.userId);
            paramCount++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        params.push(req.params.id);

        const result = await query(`
            UPDATE user_roles
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User role not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'user_role', req.params.id, 'User role updated', req.ip]);

        res.json({
            success: true,
            message: 'User role updated successfully.',
            data: { user_role: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Revoke/Delete user role
const revokeUserRole = async (req, res, next) => {
    try {
        const result = await query(`
            UPDATE user_roles
            SET is_active = FALSE, revoked_at = NOW(), revoked_by = $1
            WHERE id = $2
            RETURNING id
        `, [req.userId, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User role not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'user_role', req.params.id, 'User role revoked', req.ip]);

        res.json({ success: true, message: 'User role revoked successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserRoles,
    getUserRoleById,
    updateUserRole,
    revokeUserRole
};

