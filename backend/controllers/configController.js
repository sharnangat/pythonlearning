const { query } = require('../config/database');

// Get config
const getConfigs = async (req, res, next) => {
    try {
        const { society_id, category, config_key } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND society_id = $${paramCount}`;
            params.push(society_id);
        } else {
            whereClause += ` AND society_id IS NULL`;
        }

        if (category) {
            paramCount++;
            whereClause += ` AND category = $${paramCount}`;
            params.push(category);
        }

        if (config_key) {
            paramCount++;
            whereClause += ` AND config_key = $${paramCount}`;
            params.push(config_key);
        }

        const result = await query(`SELECT * FROM company_config ${whereClause} ORDER BY category, config_key`, params);
        res.json({ success: true, data: { configs: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Update config
const updateConfig = async (req, res, next) => {
    try {
        const { config_value } = req.body;

        const result = await query(`
            UPDATE company_config
            SET config_value = $1, updated_by = $2
            WHERE id = $3 AND is_editable = TRUE
            RETURNING *
        `, [config_value, req.userId, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Config not found or not editable.'
            });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'config', req.params.id, 'Config updated', req.ip]);

        res.json({
            success: true,
            message: 'Config updated successfully.',
            data: { config: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getConfigs,
    updateConfig
};

