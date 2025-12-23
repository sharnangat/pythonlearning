const { query } = require('../config/database');

// Get bill items for a bill
const getBillItems = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT mbi.*, mc.charge_name as charge_template_name
            FROM maintenance_bill_items mbi
            LEFT JOIN maintenance_charges mc ON mbi.charge_id = mc.id
            WHERE mbi.bill_id = $1
            ORDER BY mbi.created_at
        `, [req.params.bill_id]);

        res.json({ success: true, data: { bill_items: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Create bill item
const createBillItem = async (req, res, next) => {
    try {
        const { bill_id, charge_id, charge_name, description, quantity, unit_rate, amount } = req.body;

        // Verify bill exists
        const billResult = await query('SELECT id, total_amount FROM maintenance_bills WHERE id = $1', [bill_id]);
        if (billResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Bill not found.' });
        }

        const result = await query(`
            INSERT INTO maintenance_bill_items (bill_id, charge_id, charge_name, description, quantity, unit_rate, amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [bill_id, charge_id || null, charge_name, description || null, quantity || 1, unit_rate || 0, amount]);

        // Recalculate bill total
        const itemsResult = await query('SELECT SUM(amount) as total FROM maintenance_bill_items WHERE bill_id = $1', [bill_id]);
        const newTotal = parseFloat(itemsResult.rows[0].total || 0);
        const bill = billResult.rows[0];
        const paidAmount = parseFloat(bill.total_amount || 0);
        const newPendingAmount = newTotal - paidAmount;

        await query(`
            UPDATE maintenance_bills
            SET total_amount = $1, pending_amount = $2, updated_by = $3
            WHERE id = $4
        `, [newTotal, newPendingAmount, req.userId, bill_id]);

        res.status(201).json({
            success: true,
            message: 'Bill item created successfully.',
            data: { bill_item: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update bill item
const updateBillItem = async (req, res, next) => {
    try {
        const { charge_name, description, quantity, unit_rate, amount } = req.body;
        const updates = [];
        const params = [];
        let paramCount = 0;

        if (charge_name !== undefined) {
            paramCount++;
            updates.push(`charge_name = $${paramCount}`);
            params.push(charge_name);
        }
        if (description !== undefined) {
            paramCount++;
            updates.push(`description = $${paramCount}`);
            params.push(description);
        }
        if (quantity !== undefined) {
            paramCount++;
            updates.push(`quantity = $${paramCount}`);
            params.push(quantity);
        }
        if (unit_rate !== undefined) {
            paramCount++;
            updates.push(`unit_rate = $${paramCount}`);
            params.push(unit_rate);
        }
        if (amount !== undefined) {
            paramCount++;
            updates.push(`amount = $${paramCount}`);
            params.push(amount);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        params.push(req.params.id);

        const result = await query(`UPDATE maintenance_bill_items SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Bill item not found.' });
        }

        // Recalculate bill total
        const billId = result.rows[0].bill_id;
        const itemsResult = await query('SELECT SUM(amount) as total FROM maintenance_bill_items WHERE bill_id = $1', [billId]);
        const newTotal = parseFloat(itemsResult.rows[0].total || 0);
        const billResult = await query('SELECT paid_amount FROM maintenance_bills WHERE id = $1', [billId]);
        const paidAmount = parseFloat(billResult.rows[0].paid_amount || 0);

        await query(`
            UPDATE maintenance_bills
            SET total_amount = $1, pending_amount = $1 - $2, updated_by = $3
            WHERE id = $4
        `, [newTotal, paidAmount, req.userId, billId]);

        res.json({
            success: true,
            message: 'Bill item updated successfully.',
            data: { bill_item: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete bill item
const deleteBillItem = async (req, res, next) => {
    try {
        // Get bill_id before deleting
        const itemResult = await query('SELECT bill_id FROM maintenance_bill_items WHERE id = $1', [req.params.id]);
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Bill item not found.' });
        }

        const billId = itemResult.rows[0].bill_id;
        await query('DELETE FROM maintenance_bill_items WHERE id = $1', [req.params.id]);

        // Recalculate bill total
        const itemsResult = await query('SELECT SUM(amount) as total FROM maintenance_bill_items WHERE bill_id = $1', [billId]);
        const newTotal = parseFloat(itemsResult.rows[0].total || 0);
        const billResult = await query('SELECT paid_amount FROM maintenance_bills WHERE id = $1', [billId]);
        const paidAmount = parseFloat(billResult.rows[0].paid_amount || 0);

        await query(`
            UPDATE maintenance_bills
            SET total_amount = $1, pending_amount = $1 - $2, updated_by = $3
            WHERE id = $4
        `, [newTotal, paidAmount, req.userId, billId]);

        res.json({ success: true, message: 'Bill item deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBillItems,
    createBillItem,
    updateBillItem,
    deleteBillItem
};

