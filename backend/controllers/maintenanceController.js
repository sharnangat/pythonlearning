const { query } = require('../config/database');

// Get maintenance requests
const getMaintenanceRequests = async (req, res, next) => {
    try {
        const { society_id, status, priority, member_id } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND mr.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (status) {
            paramCount++;
            whereClause += ` AND mr.status = $${paramCount}`;
            params.push(status);
        }
        if (priority) {
            paramCount++;
            whereClause += ` AND mr.priority = $${paramCount}`;
            params.push(priority);
        }
        if (member_id) {
            paramCount++;
            whereClause += ` AND mr.member_id = $${paramCount}`;
            params.push(member_id);
        }

        const result = await query(`
            SELECT mr.*, s.society_name, m.first_name || ' ' || m.last_name as member_name
            FROM maintenance_requests mr
            LEFT JOIN societies s ON mr.society_id = s.id
            LEFT JOIN members m ON mr.member_id = m.id
            ${whereClause}
            ORDER BY mr.created_at DESC
        `, params);

        res.json({ success: true, data: { requests: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Create maintenance request
const createMaintenanceRequest = async (req, res, next) => {
    try {
        const { society_id, member_id, request_type, title, description, location, priority } = req.body;

        const result = await query(`
            INSERT INTO maintenance_requests (
                society_id, member_id, requested_by, request_type, title, description,
                location, priority, status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            society_id,
            member_id,
            req.userId,
            request_type,
            title,
            description,
            location,
            priority || 'medium',
            'pending',
            req.userId,
            req.userId
        ]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'maintenance_request', result.rows[0].id, 'Maintenance request created', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Maintenance request created successfully.',
            data: { request: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update maintenance request
const updateMaintenanceRequest = async (req, res, next) => {
    try {
        const updates = [];
        const params = [];
        let paramCount = 0;
        const allowedFields = ['status', 'priority', 'assigned_to', 'estimated_cost', 'actual_cost', 'completion_date'];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                paramCount++;
                updates.push(`${field} = $${paramCount}`);
                params.push(req.body[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        updates.push(`updated_by = $${paramCount}`);
        params.push(req.userId);
        paramCount++;
        params.push(req.params.id);

        const result = await query(`
            UPDATE maintenance_requests 
            SET ${updates.join(', ')} 
            WHERE id = $${paramCount} 
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'maintenance_request', req.params.id, 'Maintenance request updated', req.ip]);

        res.json({
            success: true,
            message: 'Request updated successfully.',
            data: { request: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Get maintenance bills
const getMaintenanceBills = async (req, res, next) => {
    try {
        const { society_id, member_id, status, billing_month } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND mb.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (member_id) {
            paramCount++;
            whereClause += ` AND mb.member_id = $${paramCount}`;
            params.push(member_id);
        }
        if (status) {
            paramCount++;
            whereClause += ` AND mb.status = $${paramCount}`;
            params.push(status);
        }

        const result = await query(`
            SELECT mb.*, s.society_name, m.first_name || ' ' || m.last_name as member_name, m.flat_number
            FROM maintenance_bills mb
            LEFT JOIN societies s ON mb.society_id = s.id
            LEFT JOIN members m ON mb.member_id = m.id
            ${whereClause}
            ORDER BY mb.billing_month DESC
        `, params);

        res.json({ success: true, data: { bills: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get maintenance bill by ID
const getMaintenanceBillById = async (req, res, next) => {
    try {
        const billResult = await query('SELECT * FROM maintenance_bills WHERE id = $1', [req.params.id]);
        if (billResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Bill not found.' });
        }

        const itemsResult = await query('SELECT * FROM maintenance_bill_items WHERE bill_id = $1', [req.params.id]);
        const bill = billResult.rows[0];
        bill.items = itemsResult.rows;

        res.json({ success: true, data: { bill } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    getMaintenanceBills,
    getMaintenanceBillById
};

