const { query } = require('../config/database');

// Get notifications for current user
const getNotifications = async (req, res, next) => {
    try {
        const { is_read, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE user_id = $1';
        const params = [req.userId];
        let paramCount = 1;

        if (is_read !== undefined) {
            paramCount++;
            whereClause += ` AND is_read = $${paramCount}`;
            params.push(is_read === 'true');
        }

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT * FROM notifications
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        const countResult = await query(`SELECT COUNT(*) as total FROM notifications ${whereClause}`, params.slice(0, -2));

        res.json({
            success: true,
            data: {
                notifications: result.rows,
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

// Mark notification as read
const markNotificationAsRead = async (req, res, next) => {
    try {
        const result = await query(`
            UPDATE notifications
            SET is_read = TRUE, read_at = NOW()
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `, [req.params.id, req.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        res.json({
            success: true,
            message: 'Notification marked as read.',
            data: { notification: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Mark all as read
const markAllAsRead = async (req, res, next) => {
    try {
        await query('UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = $1 AND is_read = FALSE', [req.userId]);
        res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead
};

