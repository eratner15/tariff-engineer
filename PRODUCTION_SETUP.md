# Tariff Engineer - Production Setup Guide

This guide walks through setting up the production-grade Tariff Engineer system with real government data.

## 🚀 Overview

The production system includes:
- **Vercel Postgres** database with pgvector for semantic search
- **20,000+ HTS codes** from USITC
- **10,000+ CBP rulings** scraped from rulings.cbp.gov
- **Semantic search** using OpenAI embeddings
- **Real-time analysis** using Anthropic Claude

---

## 📋 Prerequisites

1. **Node.js 20+** (currently using v18 but v20+ recommended)
2. **Vercel account** with Postgres add-on
3. **Anthropic API key** (for Claude analysis)
4. **OpenAI API key** (for embeddings)

---

## ⚙️ Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@vercel/postgres` - Database client
- `openai` - Embeddings API
- `cheerio` - HTML parsing for scraping
- `tsx` - TypeScript execution for scripts

### 2. Set Up Vercel Postgres

#### Option A: Via Vercel Dashboard
1. Go to your project on Vercel
2. Navigate to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name it `tariff-engineer-db`
5. Vercel will automatically add env vars to your project

#### Option B: Via Vercel CLI
```bash
vercel link
vercel env pull .env.local
```

This downloads the Postgres connection strings to `.env.local`

### 3. Add API Keys

Edit `.env.local` and add:

```env
# Already populated by Vercel
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Add these manually
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Database

Run the database schema setup:

```bash
npm run db:init
```

This creates all tables, indexes, functions, and enables pgvector extension.

**Expected output:**
```
✅ Successful: 40+
❌ Errors: 0
🎉 Database is ready for data loading!
```

### 5. Load HTS Data (~5 minutes)

Download and load the HTS tariff schedule:

```bash
npm run db:load-hts
```

This:
- Downloads HTS 2025 JSON from USITC (~20MB)
- Parses 20,000+ tariff codes
- Inserts into database in batches

**Expected output:**
```
✅ HTS data loading complete!
📊 HTS Codes: 20,000+
```

### 6. Seed Curated Strategies (~30 seconds)

Load your existing presets as database strategies:

```bash
npm run db:seed-strategies
```

This converts `app/data/presets.json` into database records.

**Expected output:**
```
✅ Strategy seeding complete!
📊 Total Strategies: 8
```

### 7. Scrape CBP Rulings (~6-8 hours)

**⚠️ This is a long-running process. Recommended to run overnight.**

```bash
npm run db:scrape-rulings
```

This script:
- Scrapes 10,000 NY rulings (N330000-N340000)
- Scrapes 2,000 HQ rulings (H310000-H312000)
- Parses HTML to extract product descriptions, HTS codes, classifications
- Creates OpenAI embeddings for each ruling
- Stores everything in database

**Key Features:**
- **Rate limited:** 500ms between requests (~7200/hour)
- **Resumable:** Can stop/restart - skips already-scraped rulings
- **Progress reports:** Updates every 100 rulings
- **Cost estimate:** ~$5-10 in OpenAI embedding costs for 10,000 rulings

**Faster Testing Option:**

Edit `scripts/scrape-rulings.ts` to scrape fewer rulings:

```typescript
const SCRAPE_CONFIG = {
  NY_START: 330000,
  NY_END: 330500,  // Just 500 rulings for testing (~15 minutes)
  // ...
};
```

### 8. Verify Data

After scraping completes, verify everything:

```bash
npm run db:verify
```

**Expected output:**
```
✅ All checks passed!
🎉 Database is ready for production use!

📊 Database Statistics:
   HTS Codes: 20,000+
   Rulings: 10,000+
   Strategies: 8
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 🔧 Configuration

### Scraper Configuration

Edit `scripts/scrape-rulings.ts`:

```typescript
const SCRAPE_CONFIG = {
  NY_START: 330000,      // Starting NY ruling number
  NY_END: 340000,        // Ending NY ruling number
  DELAY_MS: 500,         // Delay between requests (ms)
  BATCH_REPORT_SIZE: 100, // Progress report frequency
};
```

### Embedding Model

The system uses OpenAI's `text-embedding-3-small`:
- **Cost:** $0.02 per 1M tokens
- **Dimensions:** 1536
- **Performance:** Excellent for semantic search

To change models, edit `lib/embeddings.ts`:

```typescript
export const EMBEDDING_MODEL = 'text-embedding-3-large'; // Higher quality
export const EMBEDDING_DIMENSION = 3072; // Must match model
```

**Note:** If changing dimensions, you must recreate the database schema.

---

## 📊 Database Schema

### Key Tables

1. **hts_codes** - Harmonized Tariff Schedule
   ~20,000 rows, full-text search enabled

2. **rulings** - CBP CROSS rulings
   10,000+ rows, vector embeddings for semantic search

3. **strategies** - Curated tariff engineering opportunities
   Seeded from presets.json

4. **audits** - User analysis tracking
   For analytics

5. **leads** - Email captures
   For marketing

### Key Functions

- `search_hts(query, limit)` - Full-text HTS search
- `search_rulings_semantic(embedding, threshold, count)` - Vector similarity search
- `search_rulings_by_hts(prefix, limit)` - Find rulings by HTS code
- `get_strategies_for_chapter(chapter)` - Get relevant strategies

---

## 🚀 Deploying to Production

### 1. Push to GitHub

```bash
git add .
git commit -m "Production infrastructure complete"
git push origin main
```

### 2. Vercel Auto-Deploy

Vercel will automatically:
- Deploy your code
- Use existing Postgres database
- Inject environment variables

### 3. Add Missing Env Vars

In Vercel dashboard, add:
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

### 4. Verify Production

Visit your deployment and test:
1. Search functionality
2. Semantic ruling search
3. Analysis with real data

---

## 💰 Cost Estimates

### One-Time Scraping Costs

- **OpenAI embeddings:** ~$5-10 for 10,000 rulings
- **Total setup cost:** ~$10

### Ongoing Costs

- **Vercel Postgres:** Free tier (256MB) or $20/month (512MB)
- **Per analysis:**
  - Claude API call: ~$0.01-0.03
  - OpenAI embedding: ~$0.0001
  - Total per user: ~$0.01-0.03

### Scaling Costs

At 1,000 analyses/month:
- Anthropic Claude: ~$10-30
- OpenAI embeddings: ~$0.10
- **Total:** ~$30-50/month (plus Vercel hosting)

---

## 🐛 Troubleshooting

### "Cannot connect to database"

Check your `.env.local` has valid `POSTGRES_URL`:

```bash
# Test connection
psql $POSTGRES_URL -c "SELECT 1"
```

### "pgvector extension not available"

Vercel Postgres supports pgvector by default. If error persists:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### "OpenAI API rate limit"

The scraper already includes rate limiting (500ms delays). If you hit limits:

1. Increase `DELAY_MS` in scraper config
2. Use a higher-tier OpenAI account
3. Scrape in smaller batches

### "Scraper failing on specific rulings"

Some rulings may have broken HTML or be missing. The scraper:
- Skips 404s automatically
- Retries failures 3 times
- Logs all errors

Check console output for error patterns.

### Node Version Warning

The app requires Node 20.9.0+ but may work on 18.x. To upgrade:

```bash
nvm install 20
nvm use 20
```

---

## 📝 Next Steps

After completing setup:

1. **Test Semantic Search**
   Try searching for products and verify relevant rulings are returned

2. **Update API Routes**
   The scripts are ready - now connect them to API endpoints

3. **Frontend Integration**
   Replace mock analysis with real database queries

4. **Monitoring**
   Set up Vercel Analytics and error tracking

5. **Continuous Scraping**
   Set up weekly cron job to scrape new rulings

---

## 📚 Additional Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [CBP CROSS Database](https://rulings.cbp.gov)
- [USITC HTS Data](https://hts.usitc.gov)

---

## ⚠️ Important Notes

1. **Scraping is Legal:** CBP rulings are public government documents. Our scraper:
   - Uses polite rate limiting (500ms delays)
   - Identifies itself via User-Agent
   - Does not bypass any access controls

2. **API Keys Security:** Never commit `.env.local` to git. It's in `.gitignore`.

3. **Database Backups:** Vercel Postgres has automatic backups. For extra safety, use:
   ```bash
   pg_dump $POSTGRES_URL > backup.sql
   ```

4. **Embeddings Cost:** First-time scraping costs ~$5-10. After that, only new rulings need embedding.

---

## 🎉 Success Criteria

You're ready for production when:

- ✅ Database has 20,000+ HTS codes
- ✅ Database has 10,000+ rulings with embeddings
- ✅ Semantic search returns relevant results
- ✅ All 8 strategies seeded
- ✅ `npm run db:verify` passes all checks
- ✅ Local dev server shows real data
- ✅ Production deployment working

**Ready to launch!** 🚀
