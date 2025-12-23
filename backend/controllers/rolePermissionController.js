const { query } = require('../config/database');

// Get role permissions
const getRolePermissions = async (req, res, next) => {
    try {
        const { role_id } = req.query;
        let whereClause = '';
        const params = [];

        if (role_id) {
            whereClause = 'WHERE rp.role_id = $1';
            params.push(role_id);
        }

        const result = await query(`
            SELECT rp.*, 
                   r.role_name, r.display_name as role_display_name,
                   p.permission_code, p.permission_name, p.display_name as permission_display_name,
                   p.resource, p.action
            FROM role_permissions rp
            JOIN roles r ON rp.role_id = r.id
            JOIN permissions p ON rp.permission_id = p.id
            ${whereClause}
            ORDER BY r.role_name, p.resource, p.action
        `, params);

        res.json({ success: true, data: { role_permissions: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Assign permission to role
const assignPermissionToRole = async (req, res, next) => {
    try {
        const { role_id, permission_id, granted = true } = req.body;

        const result = await query(`
            INSERT INTO role_permissions (role_id, permission_id, granted, granted_by)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (role_id, permission_id) DO UPDATE
            SET granted = $3, granted_by = $4, granted_at = NOW()
            RETURNING *
        `, [role_id, permission_id, granted, req.userId]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'role_permission', result.rows[0].id, 'Permission assigned to role', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Permission assigned to role successfully.',
            data: { role_permission: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update role permission
const updateRolePermission = async (req, res, next) => {
    try {
        const { granted } = req.body;

        const result = await query(`
            UPDATE role_permissions
            SET granted = $1, granted_by = $2, granted_at = NOW()
            WHERE id = $3
            RETURNING *
        `, [granted, req.userId, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Role permission not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'role_permission', req.params.id, 'Role permission updated', req.ip]);

        res.json({
            success: true,
            message: 'Role permission updated successfully.',
            data: { role_permission: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Remove permission from role
const removePermissionFromRole = async (req, res, next) => {
    try {
        const result = await query('DELETE FROM role_permissions WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Role permission not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'role_permission', req.params.id, 'Permission removed from role', req.ip]);

        res.json({ success: true, message: 'Permission removed from role successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRolePermissions,
    assignPermissionToRole,
    updateRolePermission,
    removePermissionFromRole
};

