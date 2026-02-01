/**
 * Strategies Seeder Script
 *
 * Seeds the database with curated tariff engineering strategies
 * from the existing presets.json file.
 *
 * Usage: npm run db:seed-strategies
 */

import { upsertStrategy, getStats } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface Preset {
  id: string;
  name: string;
  category: string;
  input: string;
  current: {
    hts: string;
    rate: string;
  };
  hack: {
    newHts: string;
    newRate: string;
    modification: string;
    ruling: string;
    savings: string;
  };
}

/**
 * Load presets from JSON file
 */
function loadPresets(): Preset[] {
  const presetsPath = path.join(__dirname, '../app/data/presets.json');

  if (!fs.existsSync(presetsPath)) {
    throw new Error(`Presets file not found at: ${presetsPath}`);
  }

  const data = fs.readFileSync(presetsPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Calculate savings percentage from rates
 */
function calculateSavingsPercentage(currentRate: string, newRate: string): number {
  const current = parseFloat(currentRate.replace('%', ''));
  const target = parseFloat(newRate.replace('%', ''));

  if (isNaN(current) || isNaN(target)) {
    return 0;
  }

  return current - target;
}

/**
 * Extract ruling IDs from preset data
 */
function extractRulingIds(ruling: string): string[] {
  // Extract ruling IDs like "NY N293844", "N293844", "H301876", etc.
  const matches = ruling.match(/[NH]\s*\d{6,7}/g) || [];
  return matches.map(m => m.replace(/\s+/g, ''));
}

/**
 * Determine confidence level based on ruling availability
 */
function determineConfidence(preset: Preset): string {
  const rulingIds = extractRulingIds(preset.hack.ruling);

  if (rulingIds.length >= 2) {
    return 'high'; // Multiple rulings support
  } else if (rulingIds.length === 1) {
    return 'medium'; // Single ruling
  } else {
    return 'low'; // No specific ruling cited
  }
}

/**
 * Seed strategies from presets
 */
async function seedStrategies() {
  console.log('🚀 Starting strategies seeding process\n');
  console.log('='.repeat(60) + '\n');

  try {
    // Load presets
    console.log('📖 Loading presets from file...');
    const presets = loadPresets();
    console.log(`   Found ${presets.length} presets\n`);

    // Show current stats
    const statsBefore = await getStats();
    console.log('📊 Current Database Statistics:');
    console.log(`   Strategies: ${statsBefore.strategies}\n`);

    // Seed each preset
    let seeded = 0;
    let errors = 0;

    for (const preset of presets) {
      try {
        const savingsPercentage = calculateSavingsPercentage(
          preset.current.rate,
          preset.hack.newRate
        );

        const rulingIds = extractRulingIds(preset.hack.ruling);
        const confidence = determineConfidence(preset);

        const strategy = {
          name: preset.name,
          category: preset.category.toLowerCase(),
          current_hts: preset.current.hts,
          current_rate: preset.current.rate,
          target_hts: preset.hack.newHts,
          target_rate: preset.hack.newRate,
          modification_required: preset.hack.modification,
          supporting_rulings: rulingIds,
          savings_percentage: savingsPercentage,
          confidence,
          notes: `Input: ${preset.input}. Ruling: ${preset.hack.ruling}`,
        };

        console.log(`   [${seeded + 1}/${presets.length}] Seeding: ${strategy.name}`);
        console.log(`      Category: ${strategy.category}`);
        console.log(`      Savings: ${savingsPercentage.toFixed(1)}%`);
        console.log(`      Confidence: ${confidence}`);
        console.log(`      Rulings: ${rulingIds.join(', ') || 'None cited'}`);

        await upsertStrategy(strategy);

        seeded++;
        console.log(`      ✅ Seeded successfully\n`);

      } catch (error: any) {
        console.error(`      ❌ Error seeding ${preset.name}:`, error.message, '\n');
        errors++;
      }
    }

    // Show final stats
    const statsAfter = await getStats();

    console.log('='.repeat(60));
    console.log('✅ Strategy seeding complete!\n');
    console.log('📊 Results:');
    console.log(`   Seeded: ${seeded}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Total Strategies: ${statsAfter.strategies} (+${statsAfter.strategies - statsBefore.strategies})`);
    console.log('='.repeat(60) + '\n');

    console.log('💡 Next steps:');
    console.log('   1. npm run db:scrape-rulings   (Scrape CBP rulings)');
    console.log('   2. npm run db:verify           (Verify data integrity)');

  } catch (error: any) {
    console.error('\n❌ Fatal error during strategy seeding:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedStrategies()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export { seedStrategies };
