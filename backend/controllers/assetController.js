const { query } = require('../config/database');

// Get all assets
const getAssets = async (req, res, next) => {
    try {
        const { society_id, asset_type, status } = req.query;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (society_id) {
            paramCount++;
            whereClause += ` AND a.society_id = $${paramCount}`;
            params.push(society_id);
        }
        if (asset_type) {
            paramCount++;
            whereClause += ` AND a.asset_type = $${paramCount}`;
            params.push(asset_type);
        }
        if (status) {
            paramCount++;
            whereClause += ` AND a.status = $${paramCount}`;
            params.push(status);
        }

        const result = await query(`
            SELECT a.*, s.society_name 
            FROM assets a 
            LEFT JOIN societies s ON a.society_id = s.id 
            ${whereClause} 
            ORDER BY a.created_at DESC
        `, params);

        res.json({ success: true, data: { assets: result.rows } });
    } catch (error) {
        next(error);
    }
};

// Get asset by ID
const getAssetById = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT a.*, s.society_name 
            FROM assets a 
            LEFT JOIN societies s ON a.society_id = s.id 
            WHERE a.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found.' });
        }

        res.json({ success: true, data: { asset: result.rows[0] } });
    } catch (error) {
        next(error);
    }
};

// Create asset
const createAsset = async (req, res, next) => {
    try {
        const {
            society_id,
            asset_name,
            asset_type,
            asset_code,
            description,
            location,
            purchase_date,
            purchase_cost,
            current_value,
            depreciation_rate,
            vendor_name,
            warranty_expiry,
            condition_status
        } = req.body;

        const result = await query(`
            INSERT INTO assets (
                society_id, asset_name, asset_type, asset_code, description, location,
                purchase_date, purchase_cost, current_value, depreciation_rate,
                vendor_name, warranty_expiry, condition_status, status,
                created_by, updated_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `, [
            society_id,
            asset_name,
            asset_type,
            asset_code,
            description,
            location,
            purchase_date,
            purchase_cost,
            current_value,
            depreciation_rate,
            vendor_name,
            warranty_expiry,
            condition_status || 'good',
            'active',
            req.userId,
            req.userId
        ]);

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'create', 'asset', result.rows[0].id, 'Asset created', req.ip]);

        res.status(201).json({
            success: true,
            message: 'Asset created successfully.',
            data: { asset: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Update asset
const updateAsset = async (req, res, next) => {
    try {
        const updates = [];
        const params = [];
        let paramCount = 0;
        const allowedFields = [
            'asset_name', 'description', 'location', 'current_value',
            'status', 'condition_status', 'depreciation_rate', 'warranty_expiry'
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
            UPDATE assets 
            SET ${updates.join(', ')} 
            WHERE id = $${paramCount} 
            RETURNING *
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'update', 'asset', req.params.id, 'Asset updated', req.ip]);

        res.json({
            success: true,
            message: 'Asset updated successfully.',
            data: { asset: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

// Delete asset
const deleteAsset = async (req, res, next) => {
    try {
        const result = await query(`
            UPDATE assets 
            SET status = $1, updated_by = $2 
            WHERE id = $3 
            RETURNING id
        `, ['inactive', req.userId, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found.' });
        }

        // Log audit
        await query(`
            INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [req.userId, 'delete', 'asset', req.params.id, 'Asset deleted', req.ip]);

        res.json({ success: true, message: 'Asset deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};

