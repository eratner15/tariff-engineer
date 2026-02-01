/**
 * Database Initialization Script
 *
 * This script sets up the complete database schema for Tariff Engineer.
 * Run this ONCE before loading any data.
 *
 * Usage: npm run db:init
 */

import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

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

    // Split schema into individual statements (by semicolon)
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Extract a brief description for logging
      const firstLine = statement.split('\n')[0].substring(0, 60);

      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${firstLine}...`);
        await sql.query(statement);
        successCount++;
      } catch (error: any) {
        // Some errors are acceptable (e.g., "already exists")
        if (error.message?.includes('already exists')) {
          console.log(`  ⏭️  Skipped (already exists)`);
          successCount++;
        } else {
          console.error(`  ❌ Error: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Database Initialization Complete!\n');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(60));

    if (errorCount === 0) {
      console.log('\n🎉 Database is ready for data loading!');
      console.log('\nNext steps:');
      console.log('  1. npm run db:load-hts          (Load HTS codes)');
      console.log('  2. npm run db:seed-strategies   (Seed curated strategies)');
      console.log('  3. npm run db:scrape-rulings    (Scrape CBP rulings)');
    } else {
      console.log('\n⚠️  Some errors occurred. Review the output above.');
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
