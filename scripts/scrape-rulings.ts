/**
 * CBP Rulings Scraper
 *
 * Scrapes CBP CROSS rulings database and stores them with embeddings
 * for semantic search.
 *
 * This script will take 6-8 hours to scrape 10,000 rulings.
 * Can be stopped and restarted safely - it skips already-scraped rulings.
 *
 * Usage: npm run db:scrape-rulings
 */

import * as cheerio from 'cheerio';
import { upsertRuling, rulingExists, getStats } from '../lib/db';
import { createEmbedding, prepareRulingTextForEmbedding } from '../lib/embeddings';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCRAPE_CONFIG = {
  // Ruling ID ranges to scrape
  NY_START: 330000,
  NY_END: 340000,  // 10,000 rulings
  HQ_START: 310000,
  HQ_END: 312000,  // 2,000 rulings

  // Rate limiting
  DELAY_MS: 500,  // 500ms between requests = ~7200 requests/hour
  BATCH_REPORT_SIZE: 100,  // Report progress every N rulings

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
};

// ============================================================================
// TYPES
// ============================================================================

interface ScrapedRuling {
  id: string;
  ruling_type: string;
  url: string;
  ruling_date: Date | null;
  hts_codes: string[];
  product_description: string;
  classification: string;
  rationale: string;
  keywords: string[];
}

// ============================================================================
// SCRAPING FUNCTIONS
// ============================================================================

/**
 * Delay execution
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Scrape a single ruling from CBP website
 */
async function scrapeRuling(rulingId: string, retries: number = 0): Promise<ScrapedRuling | null> {
  const url = `https://rulings.cbp.gov/ruling/${rulingId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TariffEngineer/1.0 (Educational Research Tool)',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Ruling doesn't exist
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract full ruling text from various possible containers
    const rulingText = $('.ruling-content, .ruling-text, .content, main').text();

    if (!rulingText || rulingText.length < 100) {
      // Too short, probably not a valid ruling page
      return null;
    }

    // Extract HTS codes using regex
    const htsMatches = rulingText.match(/\d{4}\.\d{2}\.\d{2,4}/g) || [];
    const htsCodes = [...new Set(htsMatches)]; // Remove duplicates

    // Extract ruling date
    let rulingDate: Date | null = null;
    const dateMatch = rulingText.match(/(?:Date|Dated)[:\s]+([A-Za-z]+ \d{1,2},? \d{4})/i);
    if (dateMatch) {
      try {
        rulingDate = new Date(dateMatch[1]);
      } catch (e) {
        // Date parsing failed, leave as null
      }
    }

    // Extract product description (usually in first paragraphs)
    const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
    const productDescription = paragraphs.find(p =>
      p.length > 50 &&
      p.length < 500 &&
      (p.toLowerCase().includes('classification') ||
       p.toLowerCase().includes('merchandise') ||
       p.toLowerCase().includes('article') ||
       p.toLowerCase().includes('product'))
    ) || paragraphs[0] || 'No description available';

    // Extract classification decision
    const classificationMatch = rulingText.match(
      /(?:classified|classifiable|proper classification)[^.]{0,200}(\d{4}\.\d{2}\.\d{2,4})[^.]{0,100}/i
    );
    const classification = classificationMatch ? classificationMatch[0] : '';

    // Extract keywords for search
    const keywords = extractKeywords(rulingText);

    return {
      id: rulingId,
      ruling_type: rulingId.startsWith('H') ? 'HQ' : 'NY',
      url,
      ruling_date: rulingDate,
      hts_codes: htsCodes,
      product_description: productDescription.substring(0, 2000),
      classification: classification.substring(0, 1000),
      rationale: rulingText.substring(0, 5000),
      keywords,
    };

  } catch (error: any) {
    if (retries < SCRAPE_CONFIG.MAX_RETRIES) {
      console.log(`     ⚠️  Retry ${retries + 1}/${SCRAPE_CONFIG.MAX_RETRIES} after error: ${error.message}`);
      await delay(SCRAPE_CONFIG.RETRY_DELAY_MS);
      return scrapeRuling(rulingId, retries + 1);
    }

    console.error(`     ❌ Failed after ${SCRAPE_CONFIG.MAX_RETRIES} retries: ${error.message}`);
    return null;
  }
}

/**
 * Extract keywords from ruling text for search indexing
 */
function extractKeywords(text: string): string[] {
  // Extract meaningful keywords
  const words = text.toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);

  // Count frequency
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  // Common stop words to exclude
  const stopWords = new Set([
    'that', 'this', 'with', 'from', 'have', 'been', 'were', 'they',
    'will', 'would', 'could', 'should', 'their', 'which', 'there',
    'these', 'those', 'other', 'into', 'such', 'than', 'only', 'also',
    'made', 'make', 'well', 'must', 'said', 'each', 'does', 'very'
  ]);

  // Return top 20 most frequent non-stop words
  return Object.entries(freq)
    .filter(([word]) => !stopWords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Scrape and store a range of rulings
 */
async function scrapeRulingRange(
  prefix: string,
  startNum: number,
  endNum: number
) {
  console.log(`\n🔍 Scraping ${prefix} rulings: ${prefix}${startNum} to ${prefix}${endNum}`);
  console.log(`   Total to scrape: ${endNum - startNum + 1} rulings`);
  console.log(`   Rate: ~${Math.floor(3600000 / SCRAPE_CONFIG.DELAY_MS)} rulings/hour`);
  console.log(`   Estimated time: ~${Math.ceil((endNum - startNum + 1) * SCRAPE_CONFIG.DELAY_MS / 3600000)} hours\n`);

  let scraped = 0;
  let skipped = 0;
  let notFound = 0;
  let errors = 0;

  const startTime = Date.now();

  for (let i = startNum; i <= endNum; i++) {
    const rulingId = `${prefix}${i}`;

    // Check if already scraped (supports resuming)
    const exists = await rulingExists(rulingId);
    if (exists) {
      skipped++;
      if (skipped % SCRAPE_CONFIG.BATCH_REPORT_SIZE === 0) {
        console.log(`   ⏭️  Skipped ${skipped} (already in database)`);
      }
      continue;
    }

    console.log(`   [${i - startNum + 1}/${endNum - startNum + 1}] Scraping ${rulingId}...`);

    // Scrape the ruling
    const ruling = await scrapeRuling(rulingId);

    if (!ruling) {
      notFound++;
      await delay(SCRAPE_CONFIG.DELAY_MS);
      continue;
    }

    try {
      // Create embedding for semantic search
      const embeddingText = prepareRulingTextForEmbedding({
        productDescription: ruling.product_description,
        classification: ruling.classification,
        rationale: ruling.rationale,
      });

      console.log(`     📝 Creating embedding...`);
      const embedding = await createEmbedding(embeddingText);

      // Store in database
      await upsertRuling({
        ...ruling,
        embedding,
      });

      scraped++;
      console.log(`     ✅ Stored (${ruling.hts_codes.length} HTS codes)`);

    } catch (error: any) {
      console.error(`     ❌ Error processing ${rulingId}:`, error.message);
      errors++;
    }

    // Rate limit
    await delay(SCRAPE_CONFIG.DELAY_MS);

    // Progress report every N rulings
    if ((i - startNum) % SCRAPE_CONFIG.BATCH_REPORT_SIZE === 0) {
      const elapsed = Date.now() - startTime;
      const rate = scraped / (elapsed / 3600000); // rulings per hour
      const remaining = endNum - i;
      const etaHours = remaining / rate;

      console.log(`\n   📊 Progress Report:`);
      console.log(`      Scraped: ${scraped} | Skipped: ${skipped} | Not Found: ${notFound} | Errors: ${errors}`);
      console.log(`      Rate: ${rate.toFixed(0)} rulings/hour`);
      console.log(`      ETA: ~${etaHours.toFixed(1)} hours remaining\n`);
    }
  }

  // Final report
  const totalTime = (Date.now() - startTime) / 1000 / 60; // minutes
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Scraping complete for ${prefix} range`);
  console.log(`   Scraped: ${scraped}`);
  console.log(`   Skipped: ${skipped} (already in database)`);
  console.log(`   Not Found: ${notFound}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total Time: ${totalTime.toFixed(1)} minutes`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Main scraping function
 */
async function scrapeAllRulings() {
  console.log('🚀 Starting CBP Rulings Scraper\n');
  console.log('='.repeat(60));

  try {
    // Show current database stats
    const statsBefore = await getStats();
    console.log('📊 Current Database Statistics:');
    console.log(`   HTS Codes: ${statsBefore.htsCodes.toLocaleString()}`);
    console.log(`   Rulings: ${statsBefore.rulings.toLocaleString()}`);
    console.log(`   Strategies: ${statsBefore.strategies.toLocaleString()}`);

    // Scrape NY rulings (most recent)
    await scrapeRulingRange('N', SCRAPE_CONFIG.NY_START, SCRAPE_CONFIG.NY_END);

    // Scrape HQ rulings (precedential)
    await scrapeRulingRange('H', SCRAPE_CONFIG.HQ_START, SCRAPE_CONFIG.HQ_END);

    // Show final stats
    const statsAfter = await getStats();
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All scraping complete!');
    console.log('\n📊 Final Database Statistics:');
    console.log(`   Rulings: ${statsAfter.rulings.toLocaleString()} (+${(statsAfter.rulings - statsBefore.rulings).toLocaleString()})`);
    console.log('='.repeat(60) + '\n');

    console.log('💡 Next steps:');
    console.log('   1. npm run db:verify    (Verify data integrity)');
    console.log('   2. Test semantic search in API routes');

  } catch (error: any) {
    console.error('\n❌ Fatal error during scraping:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  scrapeAllRulings()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export { scrapeAllRulings, scrapeRuling };
