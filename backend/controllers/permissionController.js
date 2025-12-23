const { query } = require('../config/database');

// Get all permissions
const getPermissions = async (req, res, next) => {
    try {
        const { resource, action } = req.query;
        let whereClause = '';
        const params = [];

        if (resource) {
            whereClause = 'WHERE resource = $1';
            params.push(resource);
        }

        if (action && resource) {
            whereClause += ' AND action = $2';
            params.push(action);
        } else if (action) {
            whereClause = 'WHERE action = $1';
            params.push(action);
        }

        const result = await query(`SELECT * FROM permissions ${whereClause} ORDER BY resource, action`, params);
        res.json({ success: true, data: { permissions: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get permission by ID
const getPermissionById = async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM permissions WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Permission not found.' });
        }
        res.json({ success: true, data: { permission: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Create permission
const createPermission = async (req, res, next) => {
    try {
        const { permission_code, permission_name, display_name, description, resource, action, is_system_permission } = req.body;

        const result = await query(`
            INSERT INTO permissions (permission_code, permission_name, display_name, description, resource, action, is_system_permission, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [permission_code, permission_name, display_name, description, resource, action, is_system_permission || false, req.userId, req.userId]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'permission', result.rows[0].id, 'Permission created', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Permission created successfully.',
            data: { permission: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update permission
const updatePermission = async (req, res, next) => {
    try {
        const { display_name, description } = req.body;
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

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        updates.push(`updated_by = $${paramCount}`);
        params.push(req.userId);
        paramCount++;
        params.push(req.params.id);

        const result = await query(`UPDATE permissions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Permission not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'permission', req.params.id, 'Permission updated', req.ip]);

        res.json({ success: true, message: 'Permission updated successfully.', data: { permission: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Delete permission
const deletePermission = async (req, res, next) => {
    try {
        const result = await query('DELETE FROM permissions WHERE id = $1 AND is_system_permission = FALSE RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Permission not found or is a system permission.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'permission', req.params.id, 'Permission deleted', req.ip]);

        res.json({ success: true, message: 'Permission deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
};

