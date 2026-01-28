# Tariff Engineer

**The difference between 60% duty and 6% often comes down to product design.**

A tool that helps importers find legal tariff engineering opportunities by analyzing product descriptions against real CBP rulings.

Built with Claude Code in one session. From concept to working prototype.

## What This Does

- Takes natural language product descriptions
- Analyzes them against a curated database of real CBP (Customs and Border Protection) rulings
- Uses Claude AI to identify tariff engineering opportunities
- Suggests specific product modifications that can reduce duty rates
- Shows real CBP ruling precedents that support each strategy
- Calculates potential savings

**The insight:** Nike and Apple have teams for this. Small importers have never heard of it. The precedents are public—we're building the interface that makes them usable.

## Example

**Input:** "Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker"

**Output:**
- Current classification: HTS 6404.19.90 @ 37.5% duty
- **Opportunity #1:** Add felt to sole (>50% weight) → HTS 6405.20.90 @ 7.5% duty = **-30% reduction**
- **Opportunity #2:** Import fitness tracker separately → HTS 9031.80.80 @ 0% duty = **-12% weighted reduction**
- Supporting rulings: NY N293844, HQ H301842, etc.

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **AI:** Claude 3.5 Sonnet via Anthropic API
- **Data:** Curated database of real CBP rulings
- **Design:** Jony Ive minimalism (SF Pro Display, radical whitespace, pill buttons)

## Two Modes

### 🎭 Demo Mode (No API Key Required)
The app works immediately without any setup. It uses intelligent mock data based on product categories:
- Footwear → Real footwear engineering strategies
- Electronics → Real electronics strategies
- Bags → Real bag strategies
- Wearables → Real wearable strategies

Perfect for:
- Testing the UI/UX
- Showing demos to VCs
- Understanding what the tool does
- Previewing before adding API key

### 🤖 AI Mode (Requires Anthropic API Key)
Add an Anthropic API key to get real Claude AI analysis of any product against the full rulings database.

## Quick Start

### Option 1: Run Locally (Immediate, No Setup)

```bash
# Clone and install
git clone https://github.com/eratner15/tariff-engineer.git
cd tariff-engineer
npm install

# Run (works immediately in demo mode)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - it just works!

### Option 2: Deploy to Vercel (Recommended for Production)

1. Fork this repo on GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your forked repo
4. **Optional:** Add environment variable for AI mode:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)
5. Deploy!

**Without API key:** Works in demo mode with smart mock data
**With API key:** Full Claude AI analysis of any product

### Option 3: Deploy to Netlify

1. Fork this repo on GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Optional:** Add `ANTHROPIC_API_KEY` environment variable
6. Deploy!

## How the Two Modes Work

The app automatically detects whether an API key is present:

```typescript
// No ANTHROPIC_API_KEY set → Demo mode with smart mock data
// ANTHROPIC_API_KEY set → Real Claude AI analysis

const USE_MOCK_MODE = !process.env.ANTHROPIC_API_KEY
```

**Demo mode provides:**
- Category-specific mock results (footwear, electronics, bags, wearables)
- Real CBP ruling references
- Realistic savings calculations
- Same beautiful UI

**AI mode provides:**
- Claude 3.5 Sonnet analysis
- Custom analysis for any product description
- Reasoning based on 15+ curated real CBP rulings
- Confidence scoring based on precedent strength

## How It Works

### 1. Product Input
User describes their product in natural language. We provide example categories (Footwear, Electronics, Bags, Wearables) to get started.

### 2. Claude Analysis
The API sends:
- Product description
- Database of 15+ curated real CBP rulings
- Structured prompt asking Claude to identify classification and opportunities

Claude analyzes the product against ruling precedents and identifies:
- Current likely HTS classification
- Specific modifications supported by rulings
- Confidence levels based on precedent strength
- Estimated savings

### 3. Results Display
Beautiful, minimal UI shows:
- Current duty rate (red = bad news)
- Engineering opportunities (green = savings)
- Supporting CBP ruling links
- Savings calculator
- Legal disclaimers

## Data Source

The `lib/data/rulings.ts` file contains 15 real CBP rulings covering:
- Footwear material engineering (felt, leather)
- Electronics component separation
- Wearable device classification
- Bag material/design strategies
- Audio equipment classifications

Each ruling includes:
- Official ruling ID and URL
- HTS codes and rates
- Summary and key factors
- Engineering insights

**For production:** This would scale to 10,000+ rulings with vector embeddings for semantic search. The architecture is built to support it—we're just proving the concept with curated data.

## Design Philosophy

### Aesthetic: Jony Ive Minimalism
- SF Pro Display typography
- 80px+ margins (breathing room IS the design)
- One accent color (Apple blue #06c)
- Pill buttons (980px border radius = infinite)
- No gradients, no shadows >4%, no noise

### Reference Points
- Linear.app (interaction design)
- Calm.com (breathing room)
- Apple.com circa 2019 (typography)
- Stripe docs (clarity)

## Legal Disclaimers

**This tool provides information based on public CBP rulings. It is NOT legal advice.**

- Classifications are estimates based on AI analysis
- Rulings are binding only on the specific products they address
- Always consult a licensed customs broker before making classification decisions
- The authors assume no liability for classification decisions made using this tool

## Roadmap

### Phase 1: Newsletter Demo ✅
- Static design + curated rulings
- Working Claude analysis
- Real results with confidence scores

### Phase 2: Working Prototype
- Vector embeddings for semantic search
- Ingest 10,000 rulings from CROSS database
- User accounts and saved analyses

### Phase 3: Full Product
- PDF report generation
- Batch analysis for multiple SKUs
- Stripe integration for paid tier

### Phase 4: Pro Features
- Client workspaces for consultants
- API access
- Custom ruling alerts
- Integration with customs software

## Contributing

This started as a Rat Links newsletter project. If you're interested in contributing or have access to customs data/expertise, please reach out.

## License

MIT

---

**Built with Claude Code.** From master prompt to working prototype in one session.

*"The question isn't whether we CAN build a comprehensive tariff engineering platform. The question is whether we SHOULD—and we'll only know that by shipping something and watching what happens."*
