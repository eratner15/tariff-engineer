# Deployment Guide

## ⚡ The app works immediately without an API key!

The app has two modes:
- **Demo Mode:** Works instantly with smart mock data (no API key needed)
- **AI Mode:** Add Anthropic API key for real Claude AI analysis

## Quick Deploy to Vercel (Recommended)

Vercel is the fastest way to get this live. Takes ~2 minutes.

### Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- **Optional:** Anthropic API key (only needed for AI mode)

### Steps

#### 1. Push to GitHub

```bash
# Already done! Your repo is at:
# https://github.com/eratner15/tariff-engineer

# To update after changes:
git add .
git commit -m "Your changes"
git push
```

#### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `tariff-engineer` repository
4. Click **Deploy** (yes, that's it!)

#### 3. (Optional) Add API Key for AI Mode

**The app works without this step!** Only add if you want real Claude AI analysis:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)
4. Redeploy (Deployments → three dots → Redeploy)

#### 4. Share the URL

You'll get a URL like: `https://tariff-engineer-abc123.vercel.app`

**This is your demo link for VCs.**

**Without API key:** Runs in demo mode with category-specific mock results
**With API key:** Full Claude AI analysis of any product

---

## Manual Deployment Options

### Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20
5. Add environment variable: `ANTHROPIC_API_KEY`
6. Deploy

### Self-Host (VPS/AWS/etc)

```bash
# On your server
git clone [your-repo]
cd tariff-engineer
npm install
npm run build

# Set environment variable
export ANTHROPIC_API_KEY=your_key_here

# Run
npm start
```

App runs on port 3000 by default.

---

## Troubleshooting

### Build fails with "Node.js version required"

**Solution:** Vercel uses Node 20 by default (good). If building locally, upgrade Node or use `.nvmrc`:

```bash
nvm use
npm run build
```

### "API key not found" error

**Solution:** Make sure you added `ANTHROPIC_API_KEY` in Vercel environment variables. After adding, redeploy:
- Go to Vercel dashboard → your project → Settings → Environment Variables
- Add the key
- Go to Deployments → click the three dots → "Redeploy"

### TypeScript errors

**Solution:** This shouldn't happen, but if it does:

```bash
npm run build
```

Check the error and fix. Common issues:
- Missing types → `npm install --save-dev @types/[package]`
- Syntax errors → check the indicated file

### API returns 500 error

**Solution:** Check Vercel function logs:
- Go to Vercel dashboard → your project → Functions
- Click on the `/api/analyze` function
- Check logs for errors

Common causes:
- API key not set correctly
- Claude API rate limit hit (free tier limit)
- Ruling data format issue

---

## Demo Tips for VCs

### Show the value prop immediately

1. **Start with the headline:** "The difference between 60% duty and 6% often comes down to product design."

2. **Click an example:** Use "Footwear" to show instant results (no typing needed)

3. **Point to the numbers:** 37.5% → 7.5% = 30 points of margin

4. **Show the rulings:** Click through to the actual CBP ruling (proves it's real)

5. **Talk about the moat:** "This data is public. Nike has teams for this. We're making it accessible."

### Key talking points

- **Speed:** "I built this with Claude Code in one session. Concept to prototype in hours."
- **Market:** "Every hardware company importing from Asia needs this. That's a $2T+ market."
- **Validation:** "These are real CBP rulings. Every strategy shown here is legally defensible."
- **Moat:** "The moat isn't the data—it's the interface, the analysis, and moving fast."
- **Revenue:** "Consultants charge $300/hour for this. We can undercut them or enable them."

### What to say about the tech

"We're using Claude to analyze product descriptions against a database of real customs rulings. Right now it's 15 curated rulings—proof of concept. The production version would have 10,000+ rulings with vector embeddings for semantic search. The architecture scales."

### What NOT to say

- Don't claim this replaces customs brokers (it doesn't—it's a tool FOR them)
- Don't guarantee classification accuracy (always add "consult a licensed broker")
- Don't oversell the current data coverage (be honest it's curated for demo)

---

## Production Readiness Checklist

Before taking this to customers (beyond demo):

- [ ] Expand ruling database to 1,000+ rulings
- [ ] Add vector embeddings for semantic search
- [ ] Implement user authentication
- [ ] Add rate limiting on API
- [ ] Get legal review on disclaimers
- [ ] Partner with licensed customs brokers for validation
- [ ] Add analytics (PostHog, Mixpanel, etc)
- [ ] Implement PDF export
- [ ] Add email capture for leads
- [ ] Set up monitoring (Sentry, LogRocket)

---

## Next Steps

1. Deploy to Vercel (3 minutes)
2. Test with real products
3. Share with newsletter readers
4. Collect feedback
5. Decide: build the full thing or move on?

**"The question isn't whether we CAN build this. It's whether we SHOULD—and we'll only know by shipping and watching what happens."**

---

*Need help? Check the [README.md](README.md) or open an issue.*
