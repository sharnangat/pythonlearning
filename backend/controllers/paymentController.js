const { query } = require('../config/database');

// Get payments
const getPayments = async (req, res, next) => {
    try {
        const { society_id, subscription_id, payment_status } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND p.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (subscription_id) {
            paramCount++;
            whereClause += ` AND p.subscription_id = $${paramCount}`;
            params.push(subscription_id);
        }
        if (payment_status) {
            paramCount++;
            whereClause += ` AND p.payment_status = $${paramCount}`;
            params.push(payment_status);
        }

        const result = await query(`
            SELECT p.*, s.society_name
            FROM payments p
            LEFT JOIN societies s ON p.society_id = s.id
            ${whereClause}
            ORDER BY p.created_at DESC
        `, params);

        res.json({ success: true, data: { payments: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Process maintenance payment
const processMaintenancePayment = async (req, res, next) => {
    try {
        const { bill_id, payment_amount, payment_method, payment_reference } = req.body;

        // Get bill details
        const billResult = await query('SELECT * FROM maintenance_bills WHERE id = $1', [bill_id]);
        if (billResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Bill not found.' });
        }

        const bill = billResult.rows[0];
        const newPaidAmount = (bill.paid_amount || 0) + payment_amount;
        const newPendingAmount = bill.total_amount - newPaidAmount;
        const newStatus = newPendingAmount <= 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : 'pending';

        // Create payment record
        const paymentResult = await query(`
            INSERT INTO maintenance_payments (
                bill_id, society_id, member_id, payment_amount, payment_date,
                payment_method, payment_reference, payment_status, received_by,
                receipt_number, created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            bill_id,
            bill.society_id,
            bill.member_id,
            payment_amount,
            payment_method,
            payment_reference,
            'completed',
            req.userId,
            `RCP${Date.now()}`,
            req.userId,
            req.userId
        ]);

        // Update bill
        await query(`
            UPDATE maintenance_bills
            SET paid_amount = $1, pending_amount = $2, status = $3, paid_at = NOW(), updated_by = $4
            WHERE id = $5
        `, [newPaidAmount, newPendingAmount, newStatus, req.userId, bill_id]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'maintenance_payment', paymentResult.rows[0].id, 'Maintenance payment processed', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Payment processed successfully.',
            data: { payment: paymentResult.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPayments,
    processMaintenancePayment
};

