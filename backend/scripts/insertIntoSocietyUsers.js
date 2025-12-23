require('dotenv').config();
const { Sequelize } = require('sequelize');
const { connectDB, sequelize } = require('../config/db');
const userService = require('../services/userService');
const logger = require('../config/logger');

// Mock user data for society.users table
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

async function insertIntoSocietyUsers() {
  try {
    const dbName = process.env.DB_NAME || 'society';
    
    console.log(`\n=== Inserting Data into ${dbName}.users Table ===\n`);
    
    // Connect to database
    await connectDB();
    logger.info(`Connected to database: ${dbName}`);

    // Verify table exists
    try {
      const [results] = await sequelize.query(`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = '${dbName}' 
        AND table_name = 'users'
      `);
      
      if (results.length > 0) {
        console.log(`✓ Table found: ${results[0].table_schema}.${results[0].table_name}`);
      } else {
        console.log(`⚠ Table ${dbName}.users not found, will be created...`);
      }
    } catch (err) {
      console.log(`⚠ Could not verify table (might not exist yet): ${err.message}`);
    }

    // Sync models to ensure table exists
    await sequelize.sync({ alter: true });
    logger.info(`Database models synchronized - Table: ${dbName}.users`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Insert each mock user into society.users table
    console.log(`\nInserting ${mockUsers.length} users into ${dbName}.users...\n`);
    
    for (const userData of mockUsers) {
      try {
        console.log(`Creating user: ${userData.email}`);
        const user = await userService.createUser(userData);
        console.log(`✓ User created: ${user.email} (ID: ${user.id})`);
        console.log(`  → Inserted into: ${dbName}.users table\n`);
        successCount++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠ User already exists: ${userData.email} (skipped)\n`);
          skippedCount++;
        } else {
          console.log(`✗ Failed to create user ${userData.email}: ${error.message}\n`);
          errorCount++;
        }
      }
    }

    // Final summary
    console.log('\n=== Insertion Summary ===');
    console.log(`Database: ${dbName}`);
    console.log(`Table: users`);
    console.log(`Total users: ${mockUsers.length}`);
    console.log(`✓ Successfully created: ${successCount}`);
    console.log(`⚠ Already existed (skipped): ${skippedCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log('========================\n');

    // Verify inserted data
    try {
      const [count] = await sequelize.query(`
        SELECT COUNT(*) as total 
        FROM ${dbName}.users
      `);
      console.log(`Total users in ${dbName}.users table: ${count[0].total}\n`);
    } catch (err) {
      console.log(`Could not verify count: ${err.message}\n`);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error inserting data into society.users:', {
      error: error.message,
      stack: error.stack,
    });
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
insertIntoSocietyUsers();


