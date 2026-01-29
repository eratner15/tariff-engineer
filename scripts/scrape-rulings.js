/**
 * CBP CROSS Rulings Scraper
 *
 * Fetches rulings from https://rulings.cbp.gov/
 * Target: N300000-N305000 (5K subset to start)
 *
 * Extracts:
 * - Ruling ID
 * - Issue date
 * - HTS codes
 * - Product description
 * - Decision text
 */

const fs = require('fs');
const path = require('path');

// Simple fetch wrapper with retry logic
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        return await response.text();
      }

      // If 404, ruling doesn't exist - return null
      if (response.status === 404) {
        return null;
      }

      // For other errors, retry
      console.log(`Attempt ${i + 1} failed for ${url}: ${response.status}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      console.log(`Attempt ${i + 1} error for ${url}:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  return null;
}

// Parse HTML to extract ruling data
function parseRuling(html, rulingId) {
  if (!html) return null;

  try {
    // Extract HTS codes - look for patterns like 1234.56.78
    const htsPattern = /\b\d{4}\.\d{2}(?:\.\d{2,4})?\b/g;
    const htsCodes = [...new Set(html.match(htsPattern) || [])];

    // Extract date - look for common date formats
    const datePattern = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/;
    const dateMatch = html.match(datePattern);
    const issueDate = dateMatch ? dateMatch[0] : null;

    // Extract product description - get text between common markers
    // This is simplified - real implementation would need better HTML parsing
    let productDescription = '';
    const descMatch = html.match(/description[:\s]+(.*?)(?:\.|ruling|classification)/i);
    if (descMatch) {
      productDescription = descMatch[1].substring(0, 500).trim();
    }

    // Extract decision text - simplified
    let decision = '';
    const decisionMatch = html.match(/(?:HOLDING|DECISION)[:\s]+(.*?)(?:EFFECT|Sincerely)/is);
    if (decisionMatch) {
      decision = decisionMatch[1].substring(0, 1000).trim();
    }

    return {
      id: rulingId,
      issueDate,
      htsCodes,
      productDescription,
      decision,
      url: `https://rulings.cbp.gov/ruling/${rulingId}`
    };
  } catch (error) {
    console.error(`Error parsing ruling ${rulingId}:`, error.message);
    return null;
  }
}

// Main scraping function
async function scrapeRulings(startId, endId, batchSize = 10) {
  const rulings = [];
  const dataDir = path.join(__dirname, '..', 'data');

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Scraping rulings from ${startId} to ${endId}...`);
  console.log(`Batch size: ${batchSize} concurrent requests`);

  // Process in batches to avoid overwhelming the server
  for (let i = startId; i <= endId; i += batchSize) {
    const batch = [];
    const batchEnd = Math.min(i + batchSize - 1, endId);

    console.log(`Processing batch: N${i} to N${batchEnd}`);

    // Fetch batch concurrently
    for (let j = i; j <= batchEnd; j++) {
      const rulingId = `N${j}`;
      const url = `https://rulings.cbp.gov/ruling/${rulingId}`;

      batch.push(
        fetchWithRetry(url)
          .then(html => {
            if (html) {
              const ruling = parseRuling(html, rulingId);
              if (ruling && ruling.htsCodes.length > 0) {
                console.log(`✓ ${rulingId}: ${ruling.htsCodes.join(', ')}`);
                return ruling;
              }
            }
            return null;
          })
          .catch(error => {
            console.error(`✗ ${rulingId}:`, error.message);
            return null;
          })
      );
    }

    // Wait for batch to complete
    const batchResults = await Promise.all(batch);

    // Add successful results
    batchResults.forEach(ruling => {
      if (ruling) {
        rulings.push(ruling);
      }
    });

    // Rate limiting - wait 2 seconds between batches
    if (batchEnd < endId) {
      console.log(`Waiting 2s before next batch... (${rulings.length} rulings collected so far)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Save results
  const outputPath = path.join(dataDir, 'rulings.json');
  fs.writeFileSync(outputPath, JSON.stringify(rulings, null, 2));

  console.log(`\n✓ Scraping complete!`);
  console.log(`  Total rulings: ${rulings.length}`);
  console.log(`  Saved to: ${outputPath}`);

  return rulings;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
CBP CROSS Rulings Scraper

Usage:
  node scrape-rulings.js [options]

Options:
  --start <id>     Start ruling ID (default: 300000)
  --end <id>       End ruling ID (default: 305000)
  --batch <size>   Batch size for concurrent requests (default: 10)
  --help           Show this help message

Examples:
  node scrape-rulings.js
  node scrape-rulings.js --start 300000 --end 301000
  node scrape-rulings.js --start 300000 --end 305000 --batch 5
    `);
    process.exit(0);
  }

  const startId = parseInt(args[args.indexOf('--start') + 1] || '300000');
  const endId = parseInt(args[args.indexOf('--end') + 1] || '305000');
  const batchSize = parseInt(args[args.indexOf('--batch') + 1] || '10');

  scrapeRulings(startId, endId, batchSize)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { scrapeRulings, parseRuling, fetchWithRetry };
