const { Pool } = require('pg');
require('dotenv').config();
const logger = require('../utils/logger');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'soc_db',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
    logger.error('Unexpected database pool error', {
        error: err.message,
        stack: err.stack,
    });
});

// Test connection
pool.query('SELECT NOW()')
    .then(() => {
        logger.info('Database connected successfully', {
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
        });
        console.log('✓ Database connected successfully');
    })
    .catch((err) => {
        logger.error('Database connection failed', {
            error: err.message,
            stack: err.stack,
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
        });
        console.error('✗ Database connection error:', err.message);
        process.exit(1);
    });

// Query helper function
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        
        // Log slow queries
        if (duration > 1000) {
            logger.warn('Slow query detected', {
                duration: `${duration}ms`,
                query: text.substring(0, 200), // First 200 chars
                rowCount: result.rowCount,
            });
        }
        
        // Log queries in development
        if (process.env.NODE_ENV === 'development') {
            logger.debug('Database query executed', {
                duration: `${duration}ms`,
                rowCount: result.rowCount,
                query: text.substring(0, 200),
            });
        }
        
        return result;
    } catch (error) {
        logger.error('Database query error', {
            error: error.message,
            code: error.code,
            query: text.substring(0, 200),
            params: params ? params.slice(0, 5) : null, // First 5 params only
            stack: error.stack,
        });
        throw error;
    }
};

// Get a client from the pool (for transactions)
const getClient = async () => {
    return await pool.connect();
};

module.exports = {
    query,
    getClient,
    pool
};

