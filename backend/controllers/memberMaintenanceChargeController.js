const { query } = require('../config/database');

// Get member maintenance charges
const getMemberMaintenanceCharges = async (req, res, next) => {
    try {
        const { society_id, member_id, charge_id, is_active } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND mmc.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (member_id) {
            paramCount++;
            whereClause += ` AND mmc.member_id = $${paramCount}`;
            params.push(member_id);
        }
        if (charge_id) {
            paramCount++;
            whereClause += ` AND mmc.charge_id = $${paramCount}`;
            params.push(charge_id);
        }
        if (is_active !== undefined) {
            paramCount++;
            whereClause += ` AND mmc.is_active = $${paramCount}`;
            params.push(is_active === 'true');
        }

        const result = await query(`
            SELECT mmc.*,
                   s.society_name,
                   m.first_name || ' ' || m.last_name as member_name,
                   m.membership_number, m.flat_number,
                   mc.charge_name as charge_template_name
            FROM member_maintenance_charges mmc
            LEFT JOIN societies s ON mmc.society_id = s.id
            LEFT JOIN members m ON mmc.member_id = m.id
            LEFT JOIN maintenance_charges mc ON mmc.charge_id = mc.id
            ${whereClause}
            ORDER BY mmc.effective_from DESC
        `, params);

        res.json({ success: true, data: { member_maintenance_charges: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get member maintenance charge by ID
const getMemberMaintenanceChargeById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT mmc.*,
                   s.society_name,
                   m.first_name || ' ' || m.last_name as member_name,
                   m.membership_number, m.flat_number,
                   mc.charge_name as charge_template_name
            FROM member_maintenance_charges mmc
            LEFT JOIN societies s ON mmc.society_id = s.id
            LEFT JOIN members m ON mmc.member_id = m.id
            LEFT JOIN maintenance_charges mc ON mmc.charge_id = mc.id
            WHERE mmc.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member maintenance charge not found.' });
        }

        res.json({ success: true, data: { member_maintenance_charge: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Create member maintenance charge
const createMemberMaintenanceCharge = async (req, res, next) => {
    try {
        const {
            society_id,
            member_id,
            charge_id,
            charge_name,
            charge_type,
            amount,
            calculation_basis,
            is_active,
            effective_from,
            effective_until,
            notes
        } = req.body;

        const result = await query(`
            INSERT INTO member_maintenance_charges (
                society_id, member_id, charge_id, charge_name, charge_type,
                amount, calculation_basis, is_active,
                effective_from, effective_until, notes,
                created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (member_id, charge_id, effective_from) WHERE charge_id IS NOT NULL
            DO UPDATE SET amount = EXCLUDED.amount, updated_by = EXCLUDED.updated_by
            RETURNING *
        `, [
            society_id,
            member_id,
            charge_id || null,
            charge_name,
            charge_type,
            amount,
            calculation_basis || null,
            is_active !== undefined ? is_active : true,
            effective_from || new Date(),
            effective_until || null,
            notes || null,
            req.userId,
            req.userId
        ]);

        res.status(201).json({
            success: true,
            message: 'Member maintenance charge created successfully.',
            data: { member_maintenance_charge: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update member maintenance charge
const updateMemberMaintenanceCharge = async (req, res, next) => {
    try {
        const updates = [];
        const params = [];
        let paramCount = 0;
        const allowedFields = [
            'charge_name', 'charge_type', 'amount', 'calculation_basis',
            'is_active', 'effective_from', 'effective_until', 'notes'
        ];

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
            UPDATE member_maintenance_charges
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member maintenance charge not found.' });
        }

        res.json({
            success: true,
            message: 'Member maintenance charge updated successfully.',
            data: { member_maintenance_charge: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete member maintenance charge
const deleteMemberMaintenanceCharge = async (req, res, next) => {
    try {
        const result = await query('DELETE FROM member_maintenance_charges WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member maintenance charge not found.' });
        }

        res.json({ success: true, message: 'Member maintenance charge deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMemberMaintenanceCharges,
    getMemberMaintenanceChargeById,
    createMemberMaintenanceCharge,
    updateMemberMaintenanceCharge,
    deleteMemberMaintenanceCharge
};

