const { query } = require('../config/database');

// Get all roles
const getRoles = async (req, res, next) => {
    try {
        const { society_id } = req.query;
        let whereClause = '';
        const params = [];

        if (society_id) {
            whereClause = 'WHERE society_id = $1';
            params.push(society_id);
        } else {
            whereClause = 'WHERE society_id IS NULL';
        }

        const result = await query(`SELECT * FROM roles ${whereClause} ORDER BY hierarchy_level DESC`, params);
        res.json({ success: true, data: { roles: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get permissions
const getPermissions = async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM permissions ORDER BY resource, action');
        res.json({ success: true, data: { permissions: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Assign role to user
const assignRoleToUser = async (req, res, next) => {
    try {
        const { user_id, role_id, society_id, valid_until } = req.body;

        const result = await query(`
            INSERT INTO user_roles (user_id, role_id, society_id, valid_until, assigned_by, is_active)
            VALUES ($1, $2, $3, $4, $5, TRUE)
            ON CONFLICT (user_id, role_id, society_id) DO UPDATE
            SET is_active = TRUE, valid_until = $4, assigned_by = $5
            RETURNING *
        `, [user_id, role_id, society_id || null, valid_until || null, req.userId]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'user_role', result.rows[0].id, 'Role assigned to user', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Role assigned successfully.',
            data: { user_role: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Create role
const createRole = async (req, res, next) => {
    try {
        const { role_name, display_name, description, hierarchy_level, society_id, is_active } = req.body;

        // Check if user has permission to create role for this society
        if (society_id) {
            const userRoles = await query(`
                SELECT r.role_name FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = $1 AND ur.society_id = $2 AND ur.is_active = TRUE
            `, [req.userId, society_id]);

            const hasPermission = userRoles.rows.some(r => ['superAdmin', 'societyAdmin'].includes(r.role_name));
            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to create roles for this society.'
                });
            }
        }

        const result = await query(`
            INSERT INTO roles (role_name, display_name, description, hierarchy_level, society_id, is_active, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [role_name, display_name, description, hierarchy_level || 0, society_id || null, is_active !== undefined ? is_active : true, req.userId, req.userId]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'role', result.rows[0].id, 'Role created', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Role created successfully.',
            data: { role: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update role
const updateRole = async (req, res, next) => {
    try {
        const { display_name, description, hierarchy_level, is_active } = req.body;
        const updates = [];
        const params = [];
        let paramCount = 0;

        if (display_name !== undefined) {
            paramCount++;
            updates.push(`display_name = $${paramCount}`);
            params.push(display_name);
        }
        if (description !== undefined) {
            paramCount++;
            updates.push(`description = $${paramCount}`);
            params.push(description);
        }
        if (hierarchy_level !== undefined) {
            paramCount++;
            updates.push(`hierarchy_level = $${paramCount}`);
            params.push(hierarchy_level);
        }
        if (is_active !== undefined) {
            paramCount++;
            updates.push(`is_active = $${paramCount}`);
            params.push(is_active);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        updates.push(`updated_by = $${paramCount}`);
        params.push(req.userId);
        paramCount++;
        params.push(req.params.id);

        const result = await query(`UPDATE roles SET ${updates.join(', ')} WHERE id = $${paramCount} AND is_system_role = FALSE RETURNING *`, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Role not found or is a system role.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'role', req.params.id, 'Role updated', req.ip]);

        res.json({ success: true, message: 'Role updated successfully.', data: { role: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Delete role
const deleteRole = async (req, res, next) => {
    try {
        const result = await query('DELETE FROM roles WHERE id = $1 AND is_system_role = FALSE RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Role not found or is a system role.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'role', req.params.id, 'Role deleted', req.ip]);

        res.json({ success: true, message: 'Role deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRoles,
    getPermissions,
    assignRoleToUser,
    createRole,
    updateRole,
    deleteRole
};

