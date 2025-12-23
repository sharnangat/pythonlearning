const { query } = require('../config/database');

// Get visitors
const getVisitors = async (req, res, next) => {
    try {
        const { society_id, status, member_id } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND v.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (status) {
            paramCount++;
            whereClause += ` AND v.status = $${paramCount}`;
            params.push(status);
        }
        if (member_id) {
            paramCount++;
            whereClause += ` AND v.member_id = $${paramCount}`;
            params.push(member_id);
        }

        const result = await query(`
            SELECT v.*, s.society_name, m.first_name || ' ' || m.last_name as member_name, m.flat_number
            FROM visitors v
            LEFT JOIN societies s ON v.society_id = s.id
            LEFT JOIN members m ON v.member_id = m.id
            ${whereClause}
            ORDER BY v.entry_time DESC
        `, params);

        res.json({ success: true, data: { visitors: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Create visitor entry
const createVisitor = async (req, res, next) => {
    try {
        const {
            society_id,
            member_id,
            flat_number,
            visitor_name,
            visitor_phone,
            visitor_email,
            visitor_id_type,
            visitor_id_number,
            purpose_of_visit,
            number_of_visitors,
            vehicle_number,
            vehicle_type,
            entry_gate,
            is_expected
        } = req.body;

        const result = await query(`
            INSERT INTO visitors (
                society_id, member_id, flat_number, visitor_name, visitor_phone, visitor_email,
                visitor_id_type, visitor_id_number, purpose_of_visit, number_of_visitors,
                vehicle_number, vehicle_type, entry_time, entry_gate, checked_in_by,
                status, is_expected, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13, $14, $15, $16, $17, $18)
            RETURNING *
        `, [
            society_id,
            member_id,
            flat_number,
            visitor_name,
            visitor_phone,
            visitor_email,
            visitor_id_type,
            visitor_id_number,
            purpose_of_visit,
            number_of_visitors || 1,
            vehicle_number,
            vehicle_type,
            entry_gate || 'Main Gate',
            req.userId,
            'inside',
            is_expected || false,
            req.userId,
            req.userId
        ]);

        res.status(201).json({
            success: true,
            message: 'Visitor checked in successfully.',
            data: { visitor: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Check out visitor
const checkoutVisitor = async (req, res, next) => {
    try {
        const { exit_gate } = req.body;

        const result = await query(`
            UPDATE visitors
            SET exit_time = NOW(), exit_gate = $1, checked_out_by = $2, status = $3, updated_by = $4
            WHERE id = $5 AND status = 'inside'
            RETURNING *
        `, [exit_gate || 'Main Gate', req.userId, 'exited', req.userId, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Visitor not found or already checked out.'
            });
        }

        res.json({
            success: true,
            message: 'Visitor checked out successfully.',
            data: { visitor: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Pre-register visitor
const preRegisterVisitor = async (req, res, next) => {
    try {
        const {
            society_id,
            member_id,
            visitor_name,
            visitor_phone,
            visitor_email,
            purpose_of_visit,
            expected_entry_time,
            expected_exit_time,
            number_of_visitors,
            vehicle_number,
            vehicle_type,
            visitor_id_type,
            visitor_id_number
        } = req.body;

        const result = await query(`
            INSERT INTO visitor_pre_registrations (
                society_id, member_id, registered_by, visitor_name, visitor_phone, visitor_email,
                purpose_of_visit, expected_entry_time, expected_exit_time, number_of_visitors,
                vehicle_number, vehicle_type, visitor_id_type, visitor_id_number,
                status, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *
        `, [
            society_id,
            member_id,
            req.userId,
            visitor_name,
            visitor_phone,
            visitor_email,
            purpose_of_visit,
            expected_entry_time,
            expected_exit_time,
            number_of_visitors || 1,
            vehicle_number,
            vehicle_type,
            visitor_id_type,
            visitor_id_number,
            'pending',
            req.userId,
            req.userId
        ]);

        res.status(201).json({
            success: true,
            message: 'Visitor pre-registered successfully.',
            data: { pre_registration: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getVisitors,
    createVisitor,
    checkoutVisitor,
    preRegisterVisitor
};

