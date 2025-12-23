#!/usr/bin/env node

/**
 * List all tables in the database
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'soc_db'
};

async function listTables() {
    const client = new Client(dbConfig);
    
    try {
        await client.connect();
        console.log('\n✓ Connected to database:', dbConfig.database);
        
        // Get all tables with row counts
        const result = await client.query(`
            SELECT 
                schemaname,
                tablename,
                (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = schemaname AND table_name = tablename) as column_count
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `);
        
        console.log(`\n📊 Total Tables: ${result.rows.length}\n`);
        
        if (result.rows.length > 0) {
            console.log('Tables in database:');
            console.log('─'.repeat(60));
            result.rows.forEach((row, index) => {
                console.log(`${String(index + 1).padStart(2)}. ${row.tablename.padEnd(35)} (${row.column_count} columns)`);
            });
            console.log('─'.repeat(60));
        } else {
            console.log('⚠ No tables found in the database!');
        }
        
        // Verify by trying to query each table
        console.log('\n🔍 Verifying tables are accessible...\n');
        for (const row of result.rows) {
            try {
                const countResult = await client.query(`SELECT COUNT(*) as count FROM ${row.tablename}`);
                console.log(`✓ ${row.tablename.padEnd(35)} - ${countResult.rows[0].count} rows`);
            } catch (error) {
                console.log(`✗ ${row.tablename.padEnd(35)} - ERROR: ${error.message}`);
            }
        }
        
        await client.end();
        console.log('\n✅ Verification complete!\n');
        
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

listTables();

