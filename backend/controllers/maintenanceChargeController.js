const { query } = require('../config/database');

// Get maintenance charges
const getMaintenanceCharges = async (req, res, next) => {
    try {
        const { society_id, is_active, charge_type, applicable_to } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND mc.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (is_active !== undefined) {
            paramCount++;
            whereClause += ` AND mc.is_active = $${paramCount}`;
            params.push(is_active === 'true');
        }
        if (charge_type) {
            paramCount++;
            whereClause += ` AND mc.charge_type = $${paramCount}`;
            params.push(charge_type);
        }
        if (applicable_to) {
            paramCount++;
            whereClause += ` AND mc.applicable_to = $${paramCount}`;
            params.push(applicable_to);
        }

        const result = await query(`
            SELECT mc.*, s.society_name
            FROM maintenance_charges mc
            LEFT JOIN societies s ON mc.society_id = s.id
            ${whereClause}
            ORDER BY mc.effective_from DESC, mc.charge_name
        `, params);

        res.json({ success: true, data: { maintenance_charges: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get maintenance charge by ID
const getMaintenanceChargeById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT mc.*, s.society_name
            FROM maintenance_charges mc
            LEFT JOIN societies s ON mc.society_id = s.id
            WHERE mc.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Maintenance charge not found.' });
        }

        res.json({ success: true, data: { maintenance_charge: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Create maintenance charge
const createMaintenanceCharge = async (req, res, next) => {
    try {
        const {
            society_id,
            charge_name,
            charge_type,
            base_amount,
            per_unit_rate,
            unit_type,
            is_active,
            is_recurring,
            applicable_to,
            effective_from,
            effective_until,
            description
        } = req.body;

        const result = await query(`
            INSERT INTO maintenance_charges (
                society_id, charge_name, charge_type, base_amount, per_unit_rate,
                unit_type, is_active, is_recurring, applicable_to,
                effective_from, effective_until, description,
                created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `, [
            society_id,
            charge_name,
            charge_type,
            base_amount || 0,
            per_unit_rate || 0,
            unit_type,
            is_active !== undefined ? is_active : true,
            is_recurring !== undefined ? is_recurring : true,
            applicable_to || 'all',
            effective_from || new Date(),
            effective_until || null,
            description || null,
            req.userId,
            req.userId
        ]);

        res.status(201).json({
            success: true,
            message: 'Maintenance charge created successfully.',
            data: { maintenance_charge: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update maintenance charge
const updateMaintenanceCharge = async (req, res, next) => {
    try {
        const updates = [];
        const params = [];
        let paramCount = 0;
        const allowedFields = [
            'charge_name', 'charge_type', 'base_amount', 'per_unit_rate',
            'unit_type', 'is_active', 'is_recurring', 'applicable_to',
            'effective_from', 'effective_until', 'description'
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
            UPDATE maintenance_charges
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Maintenance charge not found.' });
        }

        res.json({
            success: true,
            message: 'Maintenance charge updated successfully.',
            data: { maintenance_charge: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete maintenance charge
const deleteMaintenanceCharge = async (req, res, next) => {
    try {
        const result = await query('DELETE FROM maintenance_charges WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Maintenance charge not found.' });
        }

        res.json({ success: true, message: 'Maintenance charge deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMaintenanceCharges,
    getMaintenanceChargeById,
    createMaintenanceCharge,
    updateMaintenanceCharge,
    deleteMaintenanceCharge
};

