const { query } = require('../config/database');

// Get audit logs
const getAuditLogs = async (req, res, next) => {
    try {
        const {
            user_id,
            action,
            resource_type,
            resource_id,
            start_date,
            end_date,
            page = 1,
            limit = 50
        } = req.query;

        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (user_id) {
            paramCount++;
            whereClause += ` AND al.user_id = $${paramCount}`;
            params.push(user_id);
        }
        if (action) {
            paramCount++;
            whereClause += ` AND al.action = $${paramCount}`;
            params.push(action);
        }
        if (resource_type) {
            paramCount++;
            whereClause += ` AND al.resource_type = $${paramCount}`;
            params.push(resource_type);
        }
        if (resource_id) {
            paramCount++;
            whereClause += ` AND al.resource_id = $${paramCount}`;
            params.push(resource_id);
        }
        if (start_date) {
            paramCount++;
            whereClause += ` AND al.created_at >= $${paramCount}`;
            params.push(start_date);
        }
        if (end_date) {
            paramCount++;
            whereClause += ` AND al.created_at <= $${paramCount}`;
            params.push(end_date);
        }

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT al.*, u.username, u.email
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ${whereClause}
            ORDER BY al.created_at DESC
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        const countResult = await query(`SELECT COUNT(*) as total FROM audit_logs al ${whereClause}`, params.slice(0, -2));

        res.json({
            success: true,
            data: {
                audit_logs: result.rows,
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

// Get audit log by ID
const getAuditLogById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT al.*, u.username, u.email
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Audit log not found.' });
        }

        res.json({ success: true, data: { audit_log: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAuditLogs,
    getAuditLogById
};

