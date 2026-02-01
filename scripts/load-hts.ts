/**
 * HTS Data Loader Script
 *
 * Downloads the Harmonized Tariff Schedule (HTS) from USITC
 * and loads it into the database.
 *
 * Data source: USITC HTS 2025 Revision
 *
 * Usage: npm run db:load-hts
 */

import { insertHTSCodes, getStats } from '../lib/db';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const HTS_DATA_URL = 'https://www.usitc.gov/sites/default/files/tata/hts/hts_2025_revision_32_json.json';
const CACHE_FILE = path.join(__dirname, '../data/hts-cache.json');

interface HTSRecord {
  htsno?: string;
  hts?: string;
  description?: string;
  brief_description?: string;
  general?: string;
  special?: string;
  other?: string;
  indent?: number;
}

/**
 * Download HTS data from USITC
 */
async function downloadHTSData(): Promise<HTSRecord[]> {
  console.log('📡 Downloading HTS data from USITC...');
  console.log(`   URL: ${HTS_DATA_URL}\n`);

  return new Promise((resolve, reject) => {
    https.get(HTS_DATA_URL, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ Downloaded ${jsonData.length} HTS records\n`);

          // Cache the data for faster re-runs
          const dataDir = path.dirname(CACHE_FILE);
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          fs.writeFileSync(CACHE_FILE, JSON.stringify(jsonData, null, 2));
          console.log(`💾 Cached data to: ${CACHE_FILE}\n`);

          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Download failed: ${error.message}`));
    });
  });
}

/**
 * Load cached HTS data if available
 */
function loadCachedData(): HTSRecord[] | null {
  if (fs.existsSync(CACHE_FILE)) {
    console.log('📦 Found cached HTS data');
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    const jsonData = JSON.parse(data);
    console.log(`   Loaded ${jsonData.length} records from cache\n`);
    return jsonData;
  }
  return null;
}

/**
 * Transform USITC data format to our database format
 */
function transformHTSRecord(record: HTSRecord): any {
  const htsCode = record.htsno || record.hts || '';

  if (!htsCode) return null;

  return {
    hts_code: htsCode,
    description: record.description || record.brief_description || '',
    general_rate: record.general || '',
    special_rate: record.special || '',
    other_rate: record.other || '',
    chapter: htsCode.substring(0, 2),
    heading: htsCode.substring(0, 4),
    subheading: htsCode.substring(0, 6),
    indent: record.indent || 0,
  };
}

/**
 * Load HTS data into database
 */
async function loadHTSData() {
  console.log('🚀 Starting HTS data loading process\n');
  console.log('='.repeat(60) + '\n');

  try {
    // Try to use cached data first, fallback to download
    let htsData: HTSRecord[];

    const cached = loadCachedData();
    if (cached) {
      htsData = cached;
    } else {
      htsData = await downloadHTSData();
    }

    // Transform and filter records
    console.log('🔄 Transforming HTS records...');
    const transformedRecords = htsData
      .map(transformHTSRecord)
      .filter(record => record !== null && record.hts_code.length > 0);

    console.log(`   Valid records: ${transformedRecords.length}\n`);

    // Insert in batches of 1000
    const BATCH_SIZE = 1000;
    const totalBatches = Math.ceil(transformedRecords.length / BATCH_SIZE);

    console.log(`📝 Inserting records in ${totalBatches} batches...\n`);

    for (let i = 0; i < transformedRecords.length; i += BATCH_SIZE) {
      const batch = transformedRecords.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      try {
        await insertHTSCodes(batch);
        const progress = ((i + batch.length) / transformedRecords.length * 100).toFixed(1);
        console.log(`   [${batchNumber}/${totalBatches}] Inserted ${batch.length} records (${progress}% complete)`);
      } catch (error: any) {
        console.error(`   ❌ Error in batch ${batchNumber}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ HTS data loading complete!\n');

    // Show stats
    const stats = await getStats();
    console.log('📊 Database Statistics:');
    console.log(`   HTS Codes: ${stats.htsCodes.toLocaleString()}`);
    console.log(`   Rulings: ${stats.rulings.toLocaleString()}`);
    console.log(`   Strategies: ${stats.strategies.toLocaleString()}`);
    console.log('='.repeat(60) + '\n');

    console.log('💡 Next steps:');
    console.log('   1. npm run db:seed-strategies   (Seed curated strategies)');
    console.log('   2. npm run db:scrape-rulings    (Scrape CBP rulings)');

  } catch (error: any) {
    console.error('\n❌ Fatal error during HTS data loading:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  loadHTSData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export { loadHTSData };
