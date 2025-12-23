const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const societyRoutes = require('./routes/societyRoutes');
const memberRoutes = require('./routes/memberRoutes');
const roleRoutes = require('./routes/roleRoutes');
const roleManagementRoutes = require('./routes/roleManagementRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const assetRoutes = require('./routes/assetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const maintenanceChargeRoutes = require('./routes/maintenanceChargeRoutes');
const memberMaintenanceChargeRoutes = require('./routes/memberMaintenanceChargeRoutes');
const maintenanceBillItemRoutes = require('./routes/maintenanceBillItemRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const visitorLogRoutes = require('./routes/visitorLogRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const subscriptionManagementRoutes = require('./routes/subscriptionManagementRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const auditRoutes = require('./routes/auditRoutes');
const configRoutes = require('./routes/configRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/roles', roleManagementRoutes); // CRUD operations for roles
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/maintenance-charges', maintenanceChargeRoutes);
app.use('/api/member-maintenance-charges', memberMaintenanceChargeRoutes);
app.use('/api/maintenance-bill-items', maintenanceBillItemRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/visitor-logs', visitorLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/subscriptions', subscriptionManagementRoutes); // CRUD operations for subscriptions
app.use('/api/payments', paymentRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/config', configRoutes);
app.use('/api/logs', logRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
    });
    
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`📋 Logs directory: ./logs/`);
});

module.exports = app;

