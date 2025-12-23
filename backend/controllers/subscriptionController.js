const { query } = require('../config/database');

// Get subscription plans
const getSubscriptionPlans = async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM subscription_plans WHERE is_active = TRUE ORDER BY base_price');
        res.json({ success: true, data: { plans: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Create subscription plan
const createSubscriptionPlan = async (req, res, next) => {
    try {
        const { plan_name, display_name, description, base_price, price_per_member, min_members, max_members, features, is_active, is_default, trial_days } = req.body;

        // If setting as default, unset other defaults
        if (is_default) {
            await query('UPDATE subscription_plans SET is_default = FALSE');
        }

        const result = await query(`
            INSERT INTO subscription_plans (
                plan_name, display_name, description, base_price, price_per_member,
                min_members, max_members, features, is_active, is_default, trial_days,
                created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `, [plan_name, display_name, description, base_price, price_per_member, min_members, max_members, features || {}, is_active !== undefined ? is_active : true, is_default || false, trial_days || 0, req.userId, req.userId]);

        res.status(201).json({
            success: true,
            message: 'Subscription plan created successfully.',
            data: { plan: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update subscription plan
const updateSubscriptionPlan = async (req, res, next) => {
    try {
        const { display_name, description, base_price, price_per_member, min_members, max_members, features, is_active, is_default, trial_days } = req.body;

        // If setting as default, unset other defaults
        if (is_default) {
            await query('UPDATE subscription_plans SET is_default = FALSE WHERE id != $1', [req.params.id]);
        }

        const updates = [];
        const params = [];
        let paramCount = 0;
        const allowedFields = ['display_name', 'description', 'base_price', 'price_per_member', 'min_members', 'max_members', 'features', 'is_active', 'is_default', 'trial_days'];

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

        const result = await query(`UPDATE subscription_plans SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found.' });
        }

        res.json({ success: true, message: 'Subscription plan updated successfully.', data: { plan: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Get society subscriptions
const getSocietySubscriptions = async (req, res, next) => {
    try {
        const { society_id } = req.query;
        let whereClause = '';
        const params = [];

        if (society_id) {
            whereClause = 'WHERE ss.society_id = $1';
            params.push(society_id);
        }

        const result = await query(`
            SELECT ss.*, s.society_name, sp.plan_name, sp.display_name as plan_display_name
            FROM society_subscriptions ss
            LEFT JOIN societies s ON ss.society_id = s.id
            LEFT JOIN subscription_plans sp ON ss.plan_id = sp.id
            ${whereClause}
            ORDER BY ss.created_at DESC
        `, params);

        res.json({ success: true, data: { subscriptions: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Create society subscription
const createSocietySubscription = async (req, res, next) => {
    try {
        const { society_id, plan_id, member_count, billing_cycle_start, billing_cycle_end, next_billing_date, auto_renew } = req.body;

        // Get plan details
        const planResult = await query('SELECT base_price, price_per_member FROM subscription_plans WHERE id = $1', [plan_id]);
        if (planResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found.' });
        }

        const plan = planResult.rows[0];
        const monthlyAmount = parseFloat(plan.base_price) + (parseFloat(plan.price_per_member) * (member_count || 0));

        const result = await query(`
            INSERT INTO society_subscriptions (
                society_id, plan_id, member_count, monthly_amount, billing_cycle_start,
                billing_cycle_end, next_billing_date, status, auto_renew, subscription_start_date,
                created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [
            society_id,
            plan_id,
            member_count || 0,
            monthlyAmount,
            billing_cycle_start || new Date(),
            billing_cycle_end || new Date(),
            next_billing_date || new Date(),
            'active',
            auto_renew !== undefined ? auto_renew : true,
            new Date(),
            req.userId,
            req.userId
        ]);

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully.',
            data: { subscription: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update society subscription
const updateSocietySubscription = async (req, res, next) => {
    try {
        const { member_count, auto_renew, status, cancelled_at, cancellation_reason } = req.body;
        const updates = [];
        const params = [];
        let paramCount = 0;

        if (member_count !== undefined) {
            // Recalculate monthly amount
            const subResult = await query('SELECT plan_id FROM society_subscriptions WHERE id = $1', [req.params.id]);
            if (subResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Subscription not found.' });
            }
            const planResult = await query('SELECT base_price, price_per_member FROM subscription_plans WHERE id = $1', [subResult.rows[0].plan_id]);
            const plan = planResult.rows[0];
            const monthlyAmount = parseFloat(plan.base_price) + (parseFloat(plan.price_per_member) * member_count);
            paramCount++;
            updates.push(`member_count = $${paramCount}, monthly_amount = $${paramCount + 1}`);
            params.push(member_count, monthlyAmount);
            paramCount++;
        }

        if (auto_renew !== undefined) {
            paramCount++;
            updates.push(`auto_renew = $${paramCount}`);
            params.push(auto_renew);
        }
        if (status !== undefined) {
            paramCount++;
            updates.push(`status = $${paramCount}`);
            params.push(status);
        }
        if (cancelled_at !== undefined) {
            paramCount++;
            updates.push(`cancelled_at = $${paramCount}, cancelled_by = $${paramCount + 1}`);
            params.push(cancelled_at, req.userId);
            paramCount++;
        }
        if (cancellation_reason !== undefined) {
            paramCount++;
            updates.push(`cancellation_reason = $${paramCount}`);
            params.push(cancellation_reason);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update.' });
        }

        paramCount++;
        updates.push(`updated_by = $${paramCount}`);
        params.push(req.userId);
        paramCount++;
        params.push(req.params.id);

        const result = await query(`UPDATE society_subscriptions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Subscription not found.' });
        }

        res.json({ success: true, message: 'Subscription updated successfully.', data: { subscription: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    getSocietySubscriptions,
    createSocietySubscription,
    updateSocietySubscription
};

