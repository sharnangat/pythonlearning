require('dotenv').config();
const { sequelize, connectDB } = require('../config/db');
const userService = require('../services/userService');
const logger = require('../config/logger');

// Mock user data
const mockUsers = [
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    status: 'active',
    email_verified: true,
    phone_verified: false,
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '0987654321',
    status: 'active',
    email_verified: true,
    phone_verified: true,
  },
  {
    username: 'bob_wilson',
    email: 'bob.wilson@example.com',
    password: 'test123',
    first_name: 'Bob',
    last_name: 'Wilson',
    phone: '5551234567',
    status: 'pending_verification',
    email_verified: false,
    phone_verified: false,
  },
  {
    username: 'alice_brown',
    email: 'alice.brown@example.com',
    password: 'securepass',
    first_name: 'Alice',
    last_name: 'Brown',
    phone: '5559876543',
    status: 'active',
    email_verified: true,
    phone_verified: true,
  },
  {
    username: 'charlie_davis',
    email: 'charlie.davis@example.com',
    password: 'mypassword',
    first_name: 'Charlie',
    last_name: 'Davis',
    phone: '5555555555',
    status: 'pending_verification',
    email_verified: false,
    phone_verified: false,
  },
];

async function insertMockData() {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connected', { 
      database: process.env.DB_NAME || 'society',
      table: 'users'
    });

    // Verify database and table
    const [results] = await sequelize.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME || 'society'}' 
      AND table_name = 'users'
    `);
    
    if (results.length > 0) {
      logger.info(`✓ Found table: ${results[0].table_schema}.${results[0].table_name}`);
    } else {
      logger.warn('⚠ Table society.users not found, will be created on sync');
    }

    // Sync models
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized', { 
      database: process.env.DB_NAME || 'society',
      table: 'users'
    });

    let successCount = 0;
    let errorCount = 0;

    // Insert each mock user into society.users table
    logger.info(`\nInserting data into ${process.env.DB_NAME || 'society'}.users table...\n`);
    
    for (const userData of mockUsers) {
      try {
        logger.info(`Creating user in society.users: ${userData.email}`);
        const user = await userService.createUser(userData);
        logger.info(`✓ User created successfully in society.users: ${user.email} (ID: ${user.id})`);
        successCount++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          logger.warn(`⚠ User already exists: ${userData.email}`);
        } else {
          logger.error(`✗ Failed to create user ${userData.email}:`, error.message);
          errorCount++;
        }
      }
    }

    logger.info('\n=== Mock Data Insertion Summary ===');
    logger.info(`Database: ${process.env.DB_NAME || 'society'}`);
    logger.info(`Table: users`);
    logger.info(`Total users: ${mockUsers.length}`);
    logger.info(`Successfully created: ${successCount}`);
    logger.info(`Errors/Skipped: ${errorCount}`);
    logger.info('===================================\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error inserting mock data:', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Run the script
insertMockData();

