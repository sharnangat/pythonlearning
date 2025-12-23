#!/usr/bin/env node

/**
 * Database Setup Script for Society Management System
 * This script creates the database and runs the schema.sql file
 * 
 * Usage: node setup_database.js
 * 
 * Requirements:
 * - PostgreSQL must be installed and running
 * - pg package must be installed: npm install pg
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Database configuration from environment variables
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Connect to postgres database first
};

const dbName = process.env.DB_NAME || 'soc_db';
const schemaFile = path.join(__dirname, 'schema.sql');

async function checkConnection() {
    log('\nChecking PostgreSQL connection...', 'yellow');
    const client = new Client(dbConfig);
    try {
        await client.connect();
        log('✓ PostgreSQL connection successful!', 'green');
        await client.end();
        return true;
    } catch (error) {
        log(`✗ Error: Cannot connect to PostgreSQL server`, 'red');
        log(`  ${error.message}`, 'red');
        log('\nPlease ensure:', 'yellow');
        log('  1. PostgreSQL is running', 'yellow');
        log('  2. Database credentials in .env are correct', 'yellow');
        return false;
    }
}

async function checkDatabaseExists(client) {
    const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
    );
    return result.rows.length > 0;
}

async function createDatabase() {
    log('\nChecking if database exists...', 'yellow');
    const client = new Client(dbConfig);
    
    try {
        await client.connect();
        const exists = await checkDatabaseExists(client);
        
        if (exists) {
            log(`Database '${dbName}' already exists.`, 'yellow');
            // In interactive mode, you could ask user here
            // For now, we'll skip recreation
            log('Skipping database creation (already exists).', 'yellow');
            await client.end();
            return true;
        }
        
        log(`Creating database '${dbName}'...`, 'yellow');
        await client.query(`CREATE DATABASE ${dbName}`);
        log(`✓ Database '${dbName}' created successfully!`, 'green');
        await client.end();
        return true;
    } catch (error) {
        log(`✗ Error creating database: ${error.message}`, 'red');
        await client.end();
        return false;
    }
}

/**
 * Parse SQL statements, handling dollar-quoted strings properly
 * PostgreSQL uses $$ or $tag$ for function bodies which can contain semicolons
 */
function parseSQLStatements(sql) {
    const statements = [];
    let currentStatement = '';
    let i = 0;
    let inDollarQuote = false;
    let dollarTag = '';
    
    while (i < sql.length) {
        const char = sql[i];
        
        // Check for dollar-quoted strings ($$ or $tag$)
        if (char === '$' && !inDollarQuote) {
            // Look ahead to find the closing tag
            let tagEnd = sql.indexOf('$', i + 1);
            if (tagEnd !== -1) {
                dollarTag = sql.substring(i, tagEnd + 1);
                inDollarQuote = true;
                currentStatement += dollarTag;
                i = tagEnd + 1;
                continue;
            }
        } else if (inDollarQuote && sql.substring(i).startsWith(dollarTag)) {
            // Found closing dollar tag
            currentStatement += dollarTag;
            i += dollarTag.length;
            inDollarQuote = false;
            dollarTag = '';
            continue;
        }
        
        // If we're inside a dollar-quoted string, add everything
        if (inDollarQuote) {
            currentStatement += char;
            i++;
            continue;
        }
        
        // Handle semicolons (statement terminators) outside dollar quotes
        if (char === ';') {
            const trimmed = currentStatement.trim();
            // Only add non-empty statements that aren't just comments
            if (trimmed.length > 0 && !trimmed.match(/^\s*--/)) {
                statements.push(trimmed);
            }
            currentStatement = '';
            i++;
            continue;
        }
        
        currentStatement += char;
        i++;
    }
    
    // Add any remaining statement
    const trimmed = currentStatement.trim();
    if (trimmed.length > 0 && !trimmed.match(/^\s*--/)) {
        statements.push(trimmed);
    }
    
    return statements;
}

async function runSchema() {
    log('\nRunning schema.sql to create tables...', 'yellow');
    
    if (!fs.existsSync(schemaFile)) {
        log(`✗ Error: Schema file '${schemaFile}' not found`, 'red');
        return false;
    }
    
    const schemaSQL = fs.readFileSync(schemaFile, 'utf8');
    const client = new Client({
        ...dbConfig,
        database: dbName
    });
    
    try {
        await client.connect();
        
        // Parse SQL statements properly handling dollar-quoted strings
        const statements = parseSQLStatements(schemaSQL);
        
        log(`Executing ${statements.length} SQL statements...`, 'blue');
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            try {
                await client.query(statement);
                if ((i + 1) % 10 === 0) {
                    process.stdout.write('.');
                }
            } catch (error) {
                // Some errors are expected (like "already exists")
                if (!error.message.includes('already exists') && 
                    !error.message.includes('does not exist') &&
                    !error.message.includes('duplicate key')) {
                    log(`\n⚠ Warning at statement ${i + 1}: ${error.message}`, 'yellow');
                }
            }
        }
        
        log('\n✓ Schema executed successfully!', 'green');
        await client.end();
        return true;
    } catch (error) {
        log(`\n✗ Error running schema: ${error.message}`, 'red');
        await client.end();
        return false;
    }
}

async function main() {
    log('========================================', 'green');
    log('Database Setup Script', 'green');
    log('========================================', 'green');
    log('\nDatabase Configuration:');
    log(`  Host: ${dbConfig.host}`);
    log(`  Port: ${dbConfig.port}`);
    log(`  User: ${dbConfig.user}`);
    log(`  Database: ${dbName}`);
    
    // Check connection
    if (!(await checkConnection())) {
        process.exit(1);
    }
    
    // Create database
    if (!(await createDatabase())) {
        process.exit(1);
    }
    
    // Run schema
    if (!(await runSchema())) {
        process.exit(1);
    }
    
    log('\n========================================', 'green');
    log('Database setup completed successfully!', 'green');
    log('========================================', 'green');
    log('\nDatabase is ready with all tables created.');
    log('\nNext steps:');
    log('  1. Create a super admin user');
    log('  2. Start your backend server');
    log('');
}

// Run the script
main().catch(error => {
    log(`\n✗ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});

