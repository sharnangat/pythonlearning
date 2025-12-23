const { query } = require('../config/database');

// Get visitor logs
const getVisitorLogs = async (req, res, next) => {
    try {
        const {
            visitor_id,
            society_id,
            action,
            start_date,
            end_date,
            page = 1,
            limit = 50
        } = req.query;

        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (visitor_id) {
            paramCount++;
            whereClause += ` AND vl.visitor_id = $${paramCount}`;
            params.push(visitor_id);
        }
        if (society_id) {
            paramCount++;
            whereClause += ` AND vl.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (action) {
            paramCount++;
            whereClause += ` AND vl.action = $${paramCount}`;
            params.push(action);
        }
        if (start_date) {
            paramCount++;
            whereClause += ` AND vl.action_time >= $${paramCount}`;
            params.push(start_date);
        }
        if (end_date) {
            paramCount++;
            whereClause += ` AND vl.action_time <= $${paramCount}`;
            params.push(end_date);
        }

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT vl.*,
                   v.visitor_name, v.flat_number,
                   s.society_name,
                   u.username as performed_by_username
            FROM visitor_logs vl
            LEFT JOIN visitors v ON vl.visitor_id = v.id
            LEFT JOIN societies s ON vl.society_id = s.id
            LEFT JOIN users u ON vl.performed_by = u.id
            ${whereClause}
            ORDER BY vl.action_time DESC
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        const countResult = await query(`SELECT COUNT(*) as total FROM visitor_logs vl ${whereClause}`, params.slice(0, -2));

        res.json({
            success: true,
            data: {
                visitor_logs: result.rows,
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

// Get visitor log by ID
const getVisitorLogById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT vl.*,
                   v.visitor_name, v.flat_number,
                   s.society_name,
                   u.username as performed_by_username
            FROM visitor_logs vl
            LEFT JOIN visitors v ON vl.visitor_id = v.id
            LEFT JOIN societies s ON vl.society_id = s.id
            LEFT JOIN users u ON vl.performed_by = u.id
            WHERE vl.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Visitor log not found.' });
        }

        res.json({ success: true, data: { visitor_log: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getVisitorLogs,
    getVisitorLogById
};

