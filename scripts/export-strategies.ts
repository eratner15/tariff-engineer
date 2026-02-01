/**
 * Export all strategies from database to static JSON file
 * This allows the frontend to load strategies without API calls
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getAllStrategies } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function exportStrategies() {
  console.log('🔍 Fetching strategies from database...');

  try {
    const strategies = await getAllStrategies();

    console.log(`✅ Fetched ${strategies.length} strategies`);

    // Transform to preset format
    const presets = strategies.map(strategy => ({
      id: `strategy-${strategy.id}`,
      name: strategy.name.toUpperCase(),
      category: strategy.category.toUpperCase(),
      input: strategy.name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim(),
      current: {
        hts: strategy.current_hts,
        description: `From ${strategy.current_hts}`,
        rate: strategy.current_rate
      },
      hack: {
        modification: strategy.modification_required,
        newHts: strategy.target_hts,
        newRate: strategy.target_rate,
        ruling: strategy.supporting_rulings?.[0] || 'See database',
        rulingUrl: strategy.supporting_rulings?.[0]
          ? `https://rulings.cbp.gov/ruling/${strategy.supporting_rulings[0]}`
          : undefined,
        savings: `${strategy.savings_percentage}% duty reduction`
      },
      perUnit: undefined,
      atScale: undefined,
      chapter: strategy.current_hts.substring(0, 2)
    }));

    // Write to public directory
    const outputPath = path.join(process.cwd(), 'public', 'strategies.json');
    fs.writeFileSync(outputPath, JSON.stringify(presets, null, 2));

    console.log(`✅ Exported ${presets.length} strategies to ${outputPath}`);
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Error exporting strategies:', error.message);
    process.exit(1);
  }
}

exportStrategies();
