const { query } = require('../config/database');

// Get payment methods
const getPaymentMethods = async (req, res, next) => {
    try {
        const { society_id, is_active, is_default } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND pm.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (is_active !== undefined) {
            paramCount++;
            whereClause += ` AND pm.is_active = $${paramCount}`;
            params.push(is_active === 'true');
        }
        if (is_default !== undefined) {
            paramCount++;
            whereClause += ` AND pm.is_default = $${paramCount}`;
            params.push(is_default === 'true');
        }

        const result = await query(`
            SELECT pm.*, s.society_name
            FROM payment_methods pm
            LEFT JOIN societies s ON pm.society_id = s.id
            ${whereClause}
            ORDER BY pm.is_default DESC, pm.created_at DESC
        `, params);

        res.json({ success: true, data: { payment_methods: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get payment method by ID
const getPaymentMethodById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT pm.*, s.society_name
            FROM payment_methods pm
            LEFT JOIN societies s ON pm.society_id = s.id
            WHERE pm.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment method not found.' });
        }

        res.json({ success: true, data: { payment_method: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Create payment method
const createPaymentMethod = async (req, res, next) => {
    try {
        const {
            society_id,
            payment_type,
            provider,
            account_holder_name,
            account_number_last4,
            expiry_date,
            is_default,
            is_active
        } = req.body;

        // If setting as default, unset other defaults for this society
        if (is_default) {
            await query('UPDATE payment_methods SET is_default = FALSE WHERE society_id = $1', [society_id]);
        }

        const result = await query(`
            INSERT INTO payment_methods (
                society_id, payment_type, provider, account_holder_name,
                account_number_last4, expiry_date, is_default, is_active,
                created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            society_id,
            payment_type,
            provider,
            account_holder_name,
            account_number_last4,
            expiry_date || null,
            is_default || false,
            is_active !== undefined ? is_active : true,
            req.userId,
            req.userId
        ]);

        res.status(201).json({
            success: true,
            message: 'Payment method created successfully.',
            data: { payment_method: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update payment method
const updatePaymentMethod = async (req, res, next) => {
    try {
        const { provider, account_holder_name, account_number_last4, expiry_date, is_default, is_active } = req.body;

        // Get current payment method to check society_id
        const currentResult = await query('SELECT society_id FROM payment_methods WHERE id = $1', [req.params.id]);
        if (currentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment method not found.' });
        }

        // If setting as default, unset other defaults for this society
        if (is_default) {
            await query('UPDATE payment_methods SET is_default = FALSE WHERE society_id = $1 AND id != $2', [currentResult.rows[0].society_id, req.params.id]);
        }

        const updates = [];
        const params = [];
        let paramCount = 0;

        if (provider !== undefined) {
            paramCount++;
            updates.push(`provider = $${paramCount}`);
            params.push(provider);
        }
        if (account_holder_name !== undefined) {
            paramCount++;
            updates.push(`account_holder_name = $${paramCount}`);
            params.push(account_holder_name);
        }
        if (account_number_last4 !== undefined) {
            paramCount++;
            updates.push(`account_number_last4 = $${paramCount}`);
            params.push(account_number_last4);
        }
        if (expiry_date !== undefined) {
            paramCount++;
            updates.push(`expiry_date = $${paramCount}`);
            params.push(expiry_date);
        }
        if (is_default !== undefined) {
            paramCount++;
            updates.push(`is_default = $${paramCount}`);
            params.push(is_default);
        }
        if (is_active !== undefined) {
            paramCount++;
            updates.push(`is_active = $${paramCount}`);
            params.push(is_active);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        updates.push(`updated_by = $${paramCount}`);
        params.push(req.userId);
        paramCount++;
        params.push(req.params.id);

        const result = await query(`UPDATE payment_methods SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, params);

        res.json({
            success: true,
            message: 'Payment method updated successfully.',
            data: { payment_method: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete payment method
const deletePaymentMethod = async (req, res, next) => {
    try {
        const result = await query('DELETE FROM payment_methods WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment method not found.' });
        }

        res.json({ success: true, message: 'Payment method deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
};

