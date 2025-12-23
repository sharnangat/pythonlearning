const { query } = require('../config/database');

// Get all members
const getMembers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, society_id, search, status, member_type } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND m.society_id = $${paramCount}`;
            params.push(society_id);
        }

        if (search) {
            paramCount++;
            whereClause += ` AND (m.first_name ILIKE $${paramCount} OR m.last_name ILIKE $${paramCount} OR m.membership_number ILIKE $${paramCount} OR m.email ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (status) {
            paramCount++;
            whereClause += ` AND m.status = $${paramCount}`;
            params.push(status);
        }

        if (member_type) {
            paramCount++;
            whereClause += ` AND m.member_type = $${paramCount}`;
            params.push(member_type);
        }

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT m.*, s.society_name, u.username as user_username
            FROM members m
            LEFT JOIN societies s ON m.society_id = s.id
            LEFT JOIN users u ON m.user_id = u.id
            ${whereClause}
            ORDER BY m.created_at DESC
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        const countResult = await query(`SELECT COUNT(*) as total FROM members m ${whereClause}`, params.slice(0, -2));

        res.json({
            success: true,
            data: {
                members: result.rows,
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

// Get member by ID
const getMemberById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT m.*, s.society_name, u.username as user_username
            FROM members m
            LEFT JOIN societies s ON m.society_id = s.id
            LEFT JOIN users u ON m.user_id = u.id
            WHERE m.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found.'
            });
        }

        res.json({
            success: true,
            data: { member: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Create member
const createMember = async (req, res, next) => {
    try {
        const {
            society_id,
            membership_number,
            user_id,
            first_name,
            last_name,
            email,
            phone,
            flat_number,
            floor_number,
            building_name,
            wing,
            member_type,
            ownership_percentage,
            joining_date,
            is_primary_member
        } = req.body;

        const result = await query(`
            INSERT INTO members (
                society_id, membership_number, user_id, first_name, last_name,
                email, phone, flat_number, floor_number, building_name, wing,
                member_type, ownership_percentage, joining_date, is_primary_member,
                status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING *
        `, [
            society_id,
            membership_number,
            user_id || null,
            first_name,
            last_name,
            email,
            phone,
            flat_number,
            floor_number,
            building_name,
            wing,
            member_type || 'owner',
            ownership_percentage || 100.00,
            joining_date || new Date(),
            is_primary_member || false,
            'active',
            req.userId,
            req.userId
        ]);

        // Update society member count
        await query('UPDATE societies SET total_members = (SELECT COUNT(*) FROM members WHERE society_id = $1 AND status = $2) WHERE id = $1', [society_id, 'active']);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'member', result.rows[0].id, 'Member created', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Member created successfully.',
            data: { member: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update member
const updateMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = [];
        const params = [];
        let paramCount = 0;

        const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'alternate_phone', 'flat_number', 'floor_number', 'building_name', 'wing', 'member_type', 'ownership_percentage', 'status'];
        
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
            UPDATE members
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found.'
            });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'member', id, 'Member updated', req.ip]);

        res.json({
            success: true,
            message: 'Member updated successfully.',
            data: { member: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete member
const deleteMember = async (req, res, next) => {
    try {
        const { id } = req.params;

        const memberResult = await query('SELECT society_id FROM members WHERE id = $1', [id]);
        if (memberResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found.'
            });
        }

        await query('UPDATE members SET status = $1, updated_by = $2 WHERE id = $3', ['inactive', req.userId, id]);

        // Update society member count
        const societyId = memberResult.rows[0].society_id;
        await query('UPDATE societies SET total_members = (SELECT COUNT(*) FROM members WHERE society_id = $1 AND status = $2) WHERE id = $1', [societyId, 'active']);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'member', id, 'Member deleted', req.ip]);

        res.json({
            success: true,
            message: 'Member deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};

