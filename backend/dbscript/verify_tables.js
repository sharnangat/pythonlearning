#!/usr/bin/env node

/**
 * Verify Database Tables Script
 * Lists all tables created in the database
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

async function verifyTables() {
    const client = new Client(dbConfig);
    
    try {
        await client.connect();
        console.log('\n✓ Connected to database:', dbConfig.database);
        
        // Get all tables
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        console.log(`\n📊 Total Tables Created: ${tablesResult.rows.length}\n`);
        
        if (tablesResult.rows.length > 0) {
            console.log('Tables:');
            tablesResult.rows.forEach((row, index) => {
                console.log(`  ${index + 1}. ${row.table_name}`);
            });
        } else {
            console.log('⚠ No tables found!');
        }
        
        // Get all functions
        const functionsResult = await client.query(`
            SELECT routine_name 
            FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_type = 'FUNCTION'
            ORDER BY routine_name;
        `);
        
        console.log(`\n⚙️  Total Functions Created: ${functionsResult.rows.length}\n`);
        if (functionsResult.rows.length > 0) {
            console.log('Functions:');
            functionsResult.rows.forEach((row, index) => {
                console.log(`  ${index + 1}. ${row.routine_name}`);
            });
        }
        
        // Get all triggers
        const triggersResult = await client.query(`
            SELECT trigger_name, event_object_table 
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public'
            ORDER BY event_object_table, trigger_name;
        `);
        
        console.log(`\n🔔 Total Triggers Created: ${triggersResult.rows.length}\n`);
        if (triggersResult.rows.length > 0) {
            console.log('Triggers:');
            triggersResult.rows.forEach((row, index) => {
                console.log(`  ${index + 1}. ${row.trigger_name} (on ${row.event_object_table})`);
            });
        }
        
        await client.end();
        console.log('\n✅ Verification complete!\n');
        
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

verifyTables();

