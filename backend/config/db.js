const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('./logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Database connection failed', {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
