/**
 * Data Verification Script
 *
 * Verifies that all data was loaded correctly into the database
 * and performs basic integrity checks.
 *
 * Usage: npm run db:verify
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getStats, searchHTSCodes, searchRulingsSemantic, getAllStrategies } from '../lib/db';
import { createEmbedding, isEmbeddingsConfigured } from '../lib/embeddings';

/**
 * Verify HTS data
 */
async function verifyHTSData() {
  console.log('\n📦 Verifying HTS Data...');

  try {
    // Test search functionality
    const results = await searchHTSCodes('footwear', 5);

    console.log(`   ✅ HTS search working`);
    console.log(`   Sample results (footwear):` );
    results.slice(0, 3).forEach(r => {
      console.log(`      - ${r.hts_code}: ${r.description?.substring(0, 50)}... (${r.general_rate})`);
    });

    return true;
  } catch (error: any) {
    console.error(`   ❌ HTS verification failed:`, error.message);
    return false;
  }
}

/**
 * Verify rulings data and embeddings
 */
async function verifyRulingsData() {
  console.log('\n📋 Verifying Rulings Data...');

  try {
    // Check if embeddings are configured
    if (!isEmbeddingsConfigured()) {
      console.log(`   ⚠️  OpenAI API key not configured - skipping semantic search test`);
      return true;
    }

    // Test semantic search
    console.log(`   Creating test query embedding...`);
    const testQuery = 'athletic shoe with rubber sole';
    const queryEmbedding = await createEmbedding(testQuery);

    console.log(`   Testing semantic search...`);
    const results = await searchRulingsSemantic(queryEmbedding, 0.3, 5);

    console.log(`   ✅ Semantic search working`);
    console.log(`   Found ${results.length} similar rulings for "${testQuery}"`);

    if (results.length > 0) {
      console.log(`   Top result:`);
      console.log(`      - ${results[0].id}: ${results[0].product_description?.substring(0, 60)}...`);
      console.log(`      - Similarity: ${(results[0].similarity * 100).toFixed(1)}%`);
      console.log(`      - HTS Codes: ${results[0].hts_codes?.join(', ')}`);
    }

    return true;
  } catch (error: any) {
    console.error(`   ❌ Rulings verification failed:`, error.message);
    return false;
  }
}

/**
 * Verify strategies data
 */
async function verifyStrategiesData() {
  console.log('\n🎯 Verifying Strategies Data...');

  try {
    const strategies = await getAllStrategies();

    console.log(`   ✅ Strategies loaded`);
    console.log(`   Total active strategies: ${strategies.length}`);

    if (strategies.length > 0) {
      console.log(`   Sample strategies:`);
      strategies.slice(0, 3).forEach(s => {
        console.log(`      - ${s.name}: ${s.current_rate} → ${s.target_rate} (${s.savings_percentage}% savings)`);
      });
    }

    return true;
  } catch (error: any) {
    console.error(`   ❌ Strategies verification failed:`, error.message);
    return false;
  }
}

/**
 * Main verification function
 */
async function verifyData() {
  console.log('🚀 Starting Data Verification\n');
  console.log('='.repeat(60));

  try {
    // Get overall stats
    const stats = await getStats();

    console.log('\n📊 Database Statistics:');
    console.log(`   HTS Codes: ${stats.htsCodes.toLocaleString()}`);
    console.log(`   Rulings: ${stats.rulings.toLocaleString()}`);
    console.log(`   Strategies: ${stats.strategies.toLocaleString()}`);
    console.log(`   Audits: ${stats.audits.toLocaleString()}`);
    console.log(`   Leads: ${stats.leads.toLocaleString()}`);

    // Check minimum data requirements
    const checks = {
      hts: stats.htsCodes >= 1000,
      rulings: stats.rulings >= 100,
      strategies: stats.strategies >= 1,
    };

    console.log('\n🔍 Data Requirements Check:');
    console.log(`   HTS Codes (≥1000): ${checks.hts ? '✅' : '❌'} (${stats.htsCodes})`);
    console.log(`   Rulings (≥100): ${checks.rulings ? '✅' : '❌'} (${stats.rulings})`);
    console.log(`   Strategies (≥1): ${checks.strategies ? '✅' : '❌'} (${stats.strategies})`);

    // Run verification tests
    const htsOk = await verifyHTSData();
    const rulingsOk = await verifyRulingsData();
    const strategiesOk = await verifyStrategiesData();

    // Final report
    console.log('\n' + '='.repeat(60));
    console.log('📋 Verification Results:\n');

    const allPassed = checks.hts && checks.rulings && checks.strategies && htsOk && rulingsOk && strategiesOk;

    if (allPassed) {
      console.log('✅ All checks passed!');
      console.log('\n🎉 Database is ready for production use!');
      console.log('\n💡 Next steps:');
      console.log('   1. Update API routes to use real database');
      console.log('   2. Test semantic search in frontend');
      console.log('   3. Deploy to Vercel');
    } else {
      console.log('⚠️  Some checks failed. Review the output above.');
      console.log('\n💡 Recommendations:');

      if (!checks.hts) {
        console.log('   - Run: npm run db:load-hts');
      }
      if (!checks.rulings) {
        console.log('   - Run: npm run db:scrape-rulings');
        console.log('   - Note: Full scraping takes 6-8 hours for 10K rulings');
      }
      if (!checks.strategies) {
        console.log('   - Run: npm run db:seed-strategies');
      }
    }

    console.log('='.repeat(60) + '\n');

    process.exit(allPassed ? 0 : 1);

  } catch (error: any) {
    console.error('\n❌ Fatal error during verification:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  verifyData();
}

export { verifyData };
