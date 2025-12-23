const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const companyConfigRoutes = require('./routes/companyConfigRoutes');
const societiesRoutes = require('./routes/societiesRoutes');
const membersRoutes = require('./routes/membersRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const userRolesRoutes = require('./routes/userRolesRoutes');
const assetsRoutes = require('./routes/assetsRoutes');
const permissionsRoutes = require('./routes/permissionsRoutes');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for mobile app
app.use(cors({
  origin: '*', // In production, specify your mobile app's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Request logging middleware - log all received data (including password for debugging)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body, // DEBUG: Print full body including password
    contentType: req.get('content-type'),
    passwordValue: req.body?.password, // DEBUG: Print actual password
  });
  next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api', companyConfigRoutes);
app.use('/api', societiesRoutes);
app.use('/api', membersRoutes);
app.use('/api', rolesRoutes);
app.use('/api', userRolesRoutes);
app.use('/api', assetsRoutes);
app.use('/api', permissionsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connected successfully');
    
    // Use alter in dev to align Postgres schema with the current model.
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized');
    
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();
