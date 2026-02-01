/**
 * Database Initialization Script
 *
 * This script sets up the complete database schema for Tariff Engineer.
 * Run this ONCE before loading any data.
 *
 * Usage: npm run db:init
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Create connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
});

// Helper function to execute queries
async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'setup-database.sql');
    console.log(`📖 Reading schema from: ${schemaPath}`);

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    console.log('✅ Schema file loaded successfully\n');

    console.log('📝 Executing schema SQL...\n');

    // Execute the entire schema as one transaction
    try {
      await query(schemaSQL);
      console.log('✅ Schema executed successfully!\n');

      console.log('='.repeat(60));
      console.log('📊 Database Initialization Complete!\n');
      console.log('='.repeat(60));

      console.log('\n🎉 Database is ready for data loading!');
      console.log('\nNext steps:');
      console.log('  1. npm run db:load-hts          (Load HTS codes)');
      console.log('  2. npm run db:seed-strategies   (Seed curated strategies)');
      console.log('  3. npm run db:scrape-rulings    (Scrape CBP rulings)');

    } catch (error: any) {
      console.error('\n❌ Error executing schema:');
      console.error(error.message);
      throw error;
    }

  } catch (error: any) {
    console.error('\n❌ Fatal error during database initialization:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export { initializeDatabase };
