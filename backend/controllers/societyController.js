const { query } = require('../config/database');

// Get all societies
const getSocieties = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, status, city, state } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            whereClause += ` AND (society_name ILIKE $${paramCount} OR registration_number ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (status) {
            paramCount++;
            whereClause += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (city) {
            paramCount++;
            whereClause += ` AND city = $${paramCount}`;
            params.push(city);
        }

        if (state) {
            paramCount++;
            whereClause += ` AND state = $${paramCount}`;
            params.push(state);
        }

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT s.*, 
                   u1.username as created_by_username,
                   u2.username as updated_by_username
            FROM societies s
            LEFT JOIN users u1 ON s.created_by = u1.id
            LEFT JOIN users u2 ON s.updated_by = u2.id
            ${whereClause}
            ORDER BY s.created_at DESC
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        const countResult = await query(`SELECT COUNT(*) as total FROM societies ${whereClause}`, params.slice(0, -2));

        res.json({
            success: true,
            data: {
                societies: result.rows,
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

// Get society by ID
const getSocietyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT s.*,
                   u1.username as created_by_username,
                   u2.username as updated_by_username
            FROM societies s
            LEFT JOIN users u1 ON s.created_by = u1.id
            LEFT JOIN users u2 ON s.updated_by = u2.id
            WHERE s.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Society not found.'
            });
        }

        // Get member count
        const memberCount = await query('SELECT COUNT(*) as count FROM members WHERE society_id = $1 AND status = $2', [id, 'active']);

        const society = result.rows[0];
        society.member_count = parseInt(memberCount.rows[0].count);

        res.json({
            success: true,
            data: { society }
        });
    } catch (error) {
        next(error);
    }
};

// Create society
const createSociety = async (req, res, next) => {
    try {
        const {
            society_name,
            registration_number,
            address,
            city,
            state,
            country,
            pincode,
            phone,
            email,
            website,
            registration_date,
            total_flats,
            description
        } = req.body;

        const result = await query(`
            INSERT INTO societies (
                society_name, registration_number, address, city, state, country,
                pincode, phone, email, website, registration_date, total_flats,
                description, status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `, [
            society_name,
            registration_number,
            address,
            city,
            state || 'India',
            country || 'India',
            pincode,
            phone,
            email,
            website,
            registration_date || new Date(),
            total_flats,
            description,
            'active',
            req.userId,
            req.userId
        ]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'society', result.rows[0].id, 'Society created', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Society created successfully.',
            data: { society: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update society
const updateSociety = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = [];
        const params = [];
        let paramCount = 0;

        const allowedFields = ['society_name', 'address', 'city', 'state', 'pincode', 'phone', 'email', 'website', 'total_flats', 'description', 'status'];
        
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                paramCount++;
                updates.push(`${field} = $${paramCount}`);
                params.push(req.body[field]);
            }
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
            UPDATE societies
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Society not found.'
            });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'society', id, 'Society updated', req.ip]);

        res.json({
            success: true,
            message: 'Society updated successfully.',
            data: { society: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete society
const deleteSociety = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if society exists
        const societyResult = await query('SELECT id FROM societies WHERE id = $1', [id]);
        if (societyResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Society not found.'
            });
        }

        // Soft delete
        await query('UPDATE societies SET status = $1, updated_by = $2 WHERE id = $3', ['closed', req.userId, id]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'society', id, 'Society deleted', req.ip]);

        res.json({
            success: true,
            message: 'Society deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSocieties,
    getSocietyById,
    createSociety,
    updateSociety,
    deleteSociety
};

