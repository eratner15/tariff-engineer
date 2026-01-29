# TARIFF ENGINEER — Improvement Prompt for Claude Code

## Current State

Live at: https://tariffengineer.vercel.app/

The site has a landing page with:
- Hero section with headline and product input
- Example category pills (Footwear, Electronics, Bags, Wearables)
- Stats section (37.5% → 7.5%, 10,000+ rulings, 2 minutes)
- "How it works" 3-step explanation
- Legal disclaimers

## What Needs Improvement

### Priority 1: Design Refinement (Make it feel premium)

**Current problem:** The site looks functional but not memorable. It needs to feel like a tool built by someone with taste, not a hackathon project.

**Specific fixes:**

1. **Typography upgrade**
   - Use SF Pro Display for headlines (or fallback to -apple-system, BlinkMacSystemFont)
   - Tighter letter-spacing on large headlines (-0.03em)
   - Larger hero headline (56-72px, not smaller)
   - More contrast between headline and body text weights

2. **Whitespace expansion**
   - Hero section needs more vertical padding (80px+ top/bottom)
   - Sections need breathing room between them (64px+ gaps)
   - Content max-width should be ~680px for readability, not wider

3. **Color discipline**
   - Background: #fafafa (off-white, not pure white)
   - Text: #1d1d1f (Apple's near-black)
   - Muted text: #86868b
   - Accent (interactive): #06c (Apple blue)
   - Positive/savings: #34c759 (Apple green)
   - Negative/current rates: #ff3b30 (Apple red)
   - Remove any other colors. Three accent colors max.

4. **Button styling**
   - Primary buttons: #1d1d1f background, white text, border-radius: 980px (pill shape)
   - Secondary/outline: white background, #1d1d1f text, 1px #d2d2d7 border, border-radius: 980px
   - Hover states: subtle darkening (#333336 for primary)
   - No shadows on buttons

5. **Card styling**
   - border-radius: 20px
   - box-shadow: 0 2px 12px rgba(0,0,0,0.04) — barely visible
   - No borders OR very subtle (#f0f0f0)
   - Generous internal padding (32px)

6. **Input styling**
   - border-radius: 18px
   - border: 1px solid #d2d2d7
   - Focus state: border-color #0071e3, box-shadow: 0 0 0 4px rgba(0,113,227,0.1)
   - No heavy shadows or glows

7. **Remove visual clutter**
   - No decorative gradients
   - No background patterns
   - No icons unless absolutely necessary for comprehension
   - No emoji in UI elements (okay in content)

### Priority 2: Interaction Polish

1. **Loading states**
   - When analyzing, show a dedicated loading screen (not inline spinner)
   - Center of viewport: thin spinning circle (2px border, 48px diameter)
   - Below it: "Analyzing classifications..." in muted text
   - This should feel like the system is doing real work

2. **Results presentation**
   - Results should be a distinct "page" or view, not appended below
   - Smooth transition: fade out input → fade in results (300ms)
   - "← New analysis" link at top left to return

3. **Modification switching**
   - If showing multiple engineering opportunities as tabs/pills
   - Switching should have a subtle fade transition (150ms out, 150ms in)
   - Active tab clearly distinguished (filled vs outline)

4. **Copy functionality**
   - "Copy summary" button in results view
   - Copies formatted text with all key data
   - Shows checkmark + "Copied" confirmation for 2 seconds
   - Returns to "Copy summary" after

5. **External links**
   - Ruling IDs should link to actual CBP rulings
   - Format: https://rulings.cbp.gov/ruling/{ruling_id}
   - Open in new tab
   - Small external link icon (↗) next to link

### Priority 3: Content & Messaging

1. **Hero refinement**
   - Eyebrow text above headline: "Rat Links · The Build" (subtle, muted)
   - Headline: "Tariff Engineer" (large, bold)
   - Subhead: Keep current copy, it's good

2. **Stats section**
   - Consider removing or simplifying
   - If keeping: make numbers much larger, labels smaller
   - Horizontal layout with subtle dividers, not cards

3. **How it works**
   - Simplify to single line descriptions
   - Remove step numbers or make them very subtle
   - This section should not compete with the main interaction

4. **CTA for full product**
   - After results: "Want the full tool with live CROSS database?"
   - "Reply to this newsletter for early access."
   - Subtle Rat Links branding: "🐀 Rat Links"

5. **Footer**
   - Minimal: "Data from CBP CROSS rulings · Not legal advice"
   - Link to rulings.cbp.gov
   - No heavy footer with multiple columns

### Priority 4: Responsive Design

1. **Mobile (< 640px)**
   - Hero headline: 36-40px
   - Full-width inputs and buttons
   - Example pills: 2x2 grid or horizontal scroll
   - Generous touch targets (44px minimum)
   - Results modification tabs: horizontal scroll if needed

2. **Tablet (640-1024px)**
   - Intermediate sizing
   - Keep single-column layout

3. **Desktop (> 1024px)**
   - Max content width: 680px, centered
   - Comfortable reading line length

### Priority 5: Performance & Polish

1. **Font loading**
   - Use system font stack as fallback
   - font-display: swap to prevent FOIT

2. **Transitions**
   - All color/background transitions: 0.2s ease
   - Layout transitions: 0.3s ease
   - No janky reflows

3. **Focus states**
   - All interactive elements need visible focus states
   - Use the blue ring: box-shadow: 0 0 0 4px rgba(0,113,227,0.2)

4. **Meta tags**
   - Title: "Tariff Engineer — Find Duty Reduction Opportunities"
   - Description: "The difference between 60% duty and 6% often comes down to product design. Search 10,000+ CBP rulings for legal tariff engineering strategies."
   - OG image: Simple branded card with headline

---

## Code Style Guidelines

### CSS/Styling Approach
- Prefer Tailwind utilities for spacing/layout
- Use CSS custom properties for colors:
  ```css
  :root {
    --color-bg: #fafafa;
    --color-text: #1d1d1f;
    --color-muted: #86868b;
    --color-border: #d2d2d7;
    --color-accent: #06c;
    --color-positive: #34c759;
    --color-negative: #ff3b30;
  }
  ```
- Avoid inline styles where possible (use Tailwind or CSS modules)

### Component Structure
- Separate pages/views into distinct components
- Keep state management simple (React useState/useReducer)
- Extract reusable UI elements (Button, Card, Input)

### Animation
- Use CSS transitions for simple state changes
- Use CSS @keyframes for loading spinners
- Avoid heavy animation libraries unless necessary

---

## Example: Ideal Results View Structure

```jsx
<div className="results-view">
  {/* Header */}
  <div className="flex justify-between items-center mb-12">
    <button className="text-accent">← New analysis</button>
    <button className="btn-secondary">Copy summary</button>
  </div>

  {/* Current Classification */}
  <section className="mb-14">
    <p className="section-label">Current Classification</p>
    <div className="grid grid-cols-2 gap-8">
      <div>
        <span className="stat-label">HTS Code</span>
        <span className="stat-value font-mono">6402.91.50</span>
      </div>
      <div>
        <span className="stat-label">Duty Rate</span>
        <span className="stat-value text-negative">37.5%</span>
      </div>
    </div>
  </section>

  {/* Engineering Opportunities */}
  <section className="mb-14">
    <p className="section-label">Engineering Opportunities</p>
    
    {/* Tab selector */}
    <div className="flex gap-3 mb-6">
      {mods.map((mod, i) => (
        <button 
          key={i}
          className={`tab ${active === i ? 'tab-active' : ''}`}
        >
          {mod.title}
        </button>
      ))}
    </div>

    {/* Active mod detail */}
    <div className="card">
      <h3>{activeMod.title}</h3>
      <p className="text-muted">{activeMod.subtitle}</p>
      
      <div className="grid grid-cols-3 gap-6 my-6 p-6 bg-gray-50 rounded-xl">
        <div>
          <span className="stat-label">New HTS</span>
          <span className="font-mono">{activeMod.newCode}</span>
        </div>
        <div>
          <span className="stat-label">New Rate</span>
          <span className="text-positive font-semibold">{activeMod.newRate}</span>
        </div>
        <div>
          <span className="stat-label">Reduction</span>
          <span className="text-positive font-semibold">{activeMod.delta}</span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted">Confidence</span>
          <span className="text-sm font-semibold">{activeMod.confidence}%</span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-positive rounded-full transition-all"
            style={{ width: `${activeMod.confidence}%` }}
          />
        </div>
      </div>

      {/* Ruling link */}
      <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
        <span>
          <strong>CBP Ruling:</strong> {activeMod.ruling}
        </span>
        <a href={rulingUrl} target="_blank" className="text-accent">
          View ruling ↗
        </a>
      </div>
    </div>
  </section>

  {/* Savings summary */}
  <section className="mb-14">
    <p className="section-label">Potential Savings</p>
    <div className="card bg-gradient-to-br from-gray-50 to-white">
      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="stat-label">Per Unit</p>
          <p className="text-3xl font-semibold">$5.25</p>
        </div>
        <div className="border-x border-gray-200 px-6">
          <p className="stat-label">At Scale</p>
          <p className="text-3xl font-semibold text-positive">$262,500</p>
        </div>
        <div>
          <p className="stat-label">Volume</p>
          <p className="text-3xl font-semibold text-muted">50K units</p>
        </div>
      </div>
    </div>
  </section>

  {/* CTA */}
  <section className="text-center py-10">
    <p className="text-muted mb-3">Want the full tool with live CROSS database?</p>
    <p className="text-xl font-medium mb-5">Reply to this newsletter for early access.</p>
    <span className="text-muted">🐀 Rat Links</span>
  </section>
</div>
```

---

## Summary: The Goal

Make this feel like a tool Apple would ship for customs brokers. Every pixel intentional. Every interaction smooth. Zero visual noise. The kind of thing where people screenshot it and say "why can't all B2B tools look like this?"

We're not adding features. We're removing everything that doesn't need to be there and polishing what remains until it shines.

---

---

## Autonomous Build Features

These features should be built incrementally by the loop. Each iteration should pick ONE feature from this list that hasn't been completed yet. Check if the feature exists before building it.

### Feature 1: Real CROSS Database (Priority: CRITICAL)

Build a real ruling search system using CBP's public CROSS database.

**Implementation:**
1. Create `/scripts/scrape-rulings.js` that fetches rulings from `https://rulings.cbp.gov/ruling/{id}`
2. Start with a subset: rulings N300000 through N310000 (10,000 rulings)
3. Parse HTML to extract: ruling ID, date, HTS codes mentioned, product description, decision text
4. Store in SQLite database at `/data/rulings.db`
5. Create embeddings using OpenAI's `text-embedding-3-small` (or fallback to local embeddings)
6. Store embeddings in SQLite with `sqlite-vss` extension OR as JSON file for simple cosine similarity search
7. Create API endpoint `/api/search-rulings` that accepts product description and returns top 10 relevant rulings
8. Wire up the frontend to use real search results instead of hardcoded examples

**Verification:** When user searches for "rubber sole athletic shoe", API returns real CBP rulings about footwear classification.

**Fallback if API/embedding costs are a concern:** Pre-compute embeddings for the 10K rulings and store as static JSON. Use client-side cosine similarity.

### Feature 2: PDF Report Generation (Priority: HIGH)

Generate professional PDF reports that users can download.

**Implementation:**
1. Install `@react-pdf/renderer` or `puppeteer` 
2. Create `/components/TariffReport.jsx` — a React component styled for PDF output
3. Report structure:
   - Header with "Tariff Engineering Analysis" title and date
   - Executive Summary: product analyzed, total savings opportunity
   - Current Classification: HTS code, duty rate, description
   - Engineering Opportunities (for each):
     - Modification title and description
     - New HTS code and duty rate
     - Savings percentage
     - Supporting CBP ruling ID (as clickable link in PDF)
     - Confidence score with visual bar
   - Savings Projection table: per unit, at 10K units, at 100K units
   - Disclaimer text
   - Footer: "Generated by Tariff Engineer — tariffengineer.vercel.app"
4. Create API endpoint `/api/generate-report` that accepts analysis results and returns PDF
5. Add "Download Report" button to results page

**Verification:** Clicking "Download Report" downloads a professional-looking PDF.

### Feature 3: Email Capture Modal (Priority: HIGH)

Capture emails before showing results to build a lead list.

**Implementation:**
1. Create `/components/EmailCaptureModal.jsx`
2. Modal appears after user clicks "Find opportunities" but before results load
3. Modal content:
   - Headline: "Get your full analysis"
   - Subhead: "We'll email you a PDF report with all recommendations"
   - Email input field
   - Primary button: "Send my report"
   - Secondary link: "Skip for now" (smaller, below button)
4. Store emails in:
   - Vercel KV (if available)
   - OR localStorage (for demo purposes) + log to console
   - OR POST to a webhook (Zapier, Make, etc.)
5. If email provided: proceed to results + trigger PDF email (or simulate)
6. If skipped: proceed to results without PDF option

**Verification:** Email modal appears, can be submitted or skipped, emails are stored somewhere retrievable.

### Feature 4: Usage Analytics Dashboard (Priority: MEDIUM)

Track what users are searching and display stats.

**Implementation:**
1. Create simple analytics tracking:
   - Log each search: timestamp, product description (hashed for privacy), category matched
   - Store in Vercel KV, SQLite, or JSON file
2. Create `/admin` page (no auth needed for demo) showing:
   - Total searches all-time
   - Searches today/this week
   - Most common product categories
   - Conversion rate: searches → email captures
3. Display live counter on landing page: "X products analyzed"

**Verification:** `/admin` page shows real usage stats. Landing page shows total count.

### Feature 5: HTS Code Lookup Tool (Priority: MEDIUM)

Free tool that helps users find their current HTS code — drives SEO traffic.

**Implementation:**
1. Create `/tools/hts-lookup` page
2. Simple interface: search box + results
3. Data source: Scrape or use USITC HTS data (https://hts.usitc.gov)
4. Display: HTS code, description, duty rate, related codes
5. CTA at bottom: "Want to reduce this duty rate? Try Tariff Engineer"

**Verification:** User can search "athletic footwear" and see relevant HTS codes with duty rates.

### Feature 6: Ruling Detail Pages (Priority: MEDIUM)

Individual pages for each ruling — massive SEO potential.

**Implementation:**
1. Create `/rulings/[id]` dynamic route
2. Pull ruling data from database (built in Feature 1)
3. Page displays:
   - Ruling ID and date
   - Products involved
   - HTS codes discussed
   - Key decision text (summarized)
   - Link to official CBP ruling
   - CTA: "Have a similar product? Analyze it now"
4. Generate static pages for top 1,000 rulings (or use ISR)

**Verification:** `/rulings/N305891` shows a real ruling page with useful content.

### Feature 7: Product Category Deep Dives (Priority: LOW)

Pre-built analysis pages for common product categories.

**Implementation:**
1. Create pages for each category:
   - `/products/footwear`
   - `/products/electronics`
   - `/products/bags-luggage`
   - `/products/wearables`
2. Each page includes:
   - Overview of common HTS codes in category
   - Typical duty rates
   - Top 3 engineering strategies with real ruling citations
   - Interactive "Analyze your [category] product" CTA
3. SEO-optimized titles and meta descriptions

**Verification:** `/products/footwear` shows a comprehensive guide with real data.

### Feature 8: Savings Calculator (Priority: LOW)

Interactive calculator showing potential savings based on import volume.

**Implementation:**
1. Add to results page OR create standalone `/tools/savings-calculator`
2. Inputs:
   - Current duty rate (pre-filled from analysis)
   - Potential new duty rate (pre-filled from top recommendation)
   - Unit value ($)
   - Annual import volume (units)
3. Outputs:
   - Annual duty currently paid
   - Annual duty with engineering
   - Annual savings
   - 5-year savings projection
4. Animated number transitions for visual impact

**Verification:** Calculator shows real dollar amounts based on user inputs.

### Feature 9: Competitive Comparison Table (Priority: LOW)

Show how Tariff Engineer compares to alternatives.

**Implementation:**
1. Add section to landing page or create `/compare` page
2. Table comparing:
   - Tariff Engineer vs. CustomsIQ vs. Hiring a Consultant
   - Rows: Price, Speed, Ease of Use, Depth of Analysis, PDF Reports
3. Style: clean, minimal, obviously favors Tariff Engineer but factually accurate

**Verification:** Comparison table renders and looks professional.

### Feature 10: Dark Mode (Priority: LOW)

Because it's 2025 and people expect it.

**Implementation:**
1. Add CSS custom properties for dark theme colors
2. Add toggle in header (sun/moon icon)
3. Persist preference in localStorage
4. Dark theme colors:
   - Background: #0a0a0a
   - Text: #fafafa
   - Muted: #737373
   - Cards: #171717
   - Borders: #262626

**Verification:** Toggle switches between light and dark themes smoothly.

---

## Build Order for Overnight Loop

The loop should attempt features in this order:

1. **Design polish** (from checklist above) — get the basics right first
2. **Feature 1: Real CROSS Database** — this is the foundation
3. **Feature 2: PDF Report Generation** — monetization enabler
4. **Feature 3: Email Capture Modal** — lead generation
5. **Feature 4: Usage Analytics** — prove traction
6. **Feature 6: Ruling Detail Pages** — SEO play
7. **Feature 5: HTS Lookup Tool** — traffic driver
8. **Feature 8: Savings Calculator** — conversion optimization
9. **Feature 7: Category Deep Dives** — content marketing
10. **Feature 9: Comparison Table** — sales enablement
11. **Feature 10: Dark Mode** — polish

**Decision logic for each iteration:**
```
1. Check if design checklist is complete → if not, fix next item
2. Check if Feature 1 exists and works → if not, build/fix it
3. Check if Feature 2 exists and works → if not, build/fix it
4. Continue through features in order
5. If all features complete, run tests and fix any bugs
6. If everything works, stop the loop
```

---

## Claude Code Showcase Features

These features exist specifically to demonstrate what Claude Code can do when left to build autonomously. They should be impressive, technically interesting, and visible.

### Showcase 1: Live Ruling Search with Streaming

When searching rulings, show results streaming in one-by-one with a typewriter effect. Demonstrates real-time data processing.

### Showcase 2: Auto-Generated Mermaid Diagrams

For each engineering opportunity, generate a Mermaid flowchart showing:
- Current state → Modification → New state
- Decision tree for implementation

Render inline in the results.

### Showcase 3: Confidence Score Explanation

When showing confidence scores, add an expandable "Why this score?" section that explains:
- Number of supporting rulings found
- How recent the rulings are
- Whether the ruling was contested/appealed
- Similarity score to user's product

### Showcase 4: Build Log / Changelog

Create `/changelog` page that shows:
- Every feature built by the autonomous loop
- Timestamp of when it was added
- Brief description of what was built
- Git commit hash

This is meta-documentation of Claude Code building itself.

### Showcase 5: "How This Was Built" Section

Add footer or dedicated page showing:
- "This entire application was built by Claude Code in [X] hours"
- Link to the prompt that drove the build
- Stats: lines of code, number of components, API endpoints

---

## Agent Spawning Instructions

For complex features, the main loop can spawn sub-agents to work on isolated tasks. Use this pattern:

```bash
# Main loop detects Feature 1 (CROSS Database) needs building
# Instead of doing it all in one iteration, spawn focused agents:

# Agent 1: Scraper
echo "Build a Node.js script that scrapes CBP rulings N300000-N310000 and saves to /data/rulings.json" | claude

# Agent 2: Embeddings
echo "Create embeddings for rulings in /data/rulings.json using OpenAI API and save to /data/embeddings.json" | claude

# Agent 3: Search API
echo "Build a Next.js API route /api/search-rulings that loads embeddings and returns top 10 similar rulings for a query" | claude

# Agent 4: Frontend Integration
echo "Update the TariffEngineer component to call /api/search-rulings and display real results" | claude
```

**When to spawn agents:**
- Feature requires multiple distinct systems (scraper + database + API + frontend)
- Feature is complex enough that one iteration can't complete it
- Parallelization would speed up development

**Agent coordination:**
- Each agent writes to a specific file/directory
- Main loop checks if agent output exists before proceeding
- If agent output is missing or broken, re-run that agent

---

## Autonomous Decision Making

The loop should make intelligent decisions, not just follow a checklist blindly.

### Decision: Skip vs. Build vs. Fix

For each feature, evaluate:
- **Skip:** Feature exists and works correctly
- **Build:** Feature doesn't exist, build from scratch
- **Fix:** Feature exists but has bugs or is incomplete

### Decision: Scope Reduction

If a feature is too complex for one iteration:
- Build a minimal version first
- Add TODO comments for enhancements
- Move on, come back later if time permits

Example: For PDF generation, start with basic text-only PDF. Add styling in a later iteration.

### Decision: Error Recovery

If an iteration fails (build errors, runtime errors):
1. Read the error message
2. Identify the root cause
3. Fix the specific issue
4. Don't rewrite everything — surgical fixes only
5. If stuck after 3 attempts on same error, skip feature and move on

### Decision: When to Stop

Stop the loop when ANY of these are true:
- All features on the list are complete
- 50 iterations have passed (prevent infinite loops)
- Critical error that can't be auto-resolved
- It's been running for 8+ hours

When stopping, create `/LOOP_SUMMARY.md` documenting:
- Features completed
- Features attempted but failed
- Total iterations
- Total time elapsed
- Recommended next steps for human review

---

## Environment Setup

Before the loop starts, ensure:

```bash
# Check Node.js
node --version  # Should be 18+

# Check npm packages
npm install  # Install all dependencies

# Check environment variables
# OPENAI_API_KEY - for embeddings (optional, can use local)
# VERCEL_KV_* - for storage (optional, can use SQLite)

# Create data directories
mkdir -p data scripts

# Start dev server in background
npm run dev &

# Verify app is running
curl http://localhost:3000
```

---

## Quality Gates

Before marking any feature "complete", verify:

1. **No console errors** — Check browser dev tools
2. **No build errors** — `npm run build` succeeds
3. **No TypeScript errors** — If using TS, `tsc --noEmit` passes
4. **Responsive** — Check mobile viewport (375px width)
5. **Accessible** — Can tab through all interactive elements
6. **Fast** — Page loads in <3 seconds

If any gate fails, fix before moving to next feature.

---

## Self-Improvement Loop Instructions

This prompt is designed to be run in a continuous improvement loop:

```bash
while :; do cat PROMPT.md | claude-code ; done
```

### Before Each Iteration

1. **Assess current state**
   - Run the dev server and visually inspect the site
   - Check the browser console for errors
   - Note what's already been fixed vs. what remains

2. **Check the changelog**
   - Look at recent git commits to see what was just changed
   - Don't redo work that's already done
   - Build on previous iterations, don't revert them

3. **Prioritize ruthlessly**
   - Pick ONE thing to improve per iteration
   - Small, focused changes > big sweeping rewrites
   - If something is 80% there, move on to the next thing

### Iteration Checklist

Run through this checklist each iteration. Fix the first unchecked item you find:

**Design Fundamentals**
- [ ] Background is #fafafa (not white)
- [ ] Text color is #1d1d1f (not black)
- [ ] Muted text is #86868b
- [ ] Only three accent colors: #06c, #34c759, #ff3b30
- [ ] No other colors anywhere in the UI
- [ ] Hero headline is 56px+ with -0.03em letter-spacing
- [ ] Content max-width is ~680px
- [ ] Section spacing is 64px+
- [ ] Hero padding is 80px+ top

**Buttons & Inputs**
- [ ] Primary buttons: #1d1d1f bg, white text, border-radius: 980px
- [ ] Secondary buttons: white bg, 1px #d2d2d7 border, border-radius: 980px
- [ ] Input fields: border-radius 18px, 1px #d2d2d7 border
- [ ] Focus states use blue ring: 0 0 0 4px rgba(0,113,227,0.1)
- [ ] No shadows on buttons

**Cards & Containers**
- [ ] Cards have border-radius: 20px
- [ ] Card shadows are barely visible: 0 2px 12px rgba(0,0,0,0.04)
- [ ] Card padding is 32px
- [ ] No decorative gradients or patterns

**Interactions**
- [ ] Loading state is a dedicated centered view (not inline spinner)
- [ ] Results view is distinct from input view (not appended below)
- [ ] Transition between views is smooth (300ms fade)
- [ ] Modification tabs have transition when switching (150ms)
- [ ] Copy button shows checkmark + "Copied" confirmation

**Functionality**
- [ ] Ruling IDs link to rulings.cbp.gov/ruling/{id}
- [ ] Links open in new tab with ↗ icon
- [ ] Copy summary formats all key data as text
- [ ] "New analysis" button returns to input state

**Content**
- [ ] Eyebrow text: "Rat Links · The Build"
- [ ] CTA: "Want the full tool? Reply to this newsletter."
- [ ] Footer is minimal: one line + link
- [ ] No emoji in UI chrome (okay in content)

**Responsive**
- [ ] Mobile headline is 36-40px
- [ ] Touch targets are 44px minimum
- [ ] Content doesn't overflow on mobile
- [ ] Example pills work on small screens

**Polish**
- [ ] No console errors
- [ ] No layout shift on load
- [ ] Fonts load without FOIT
- [ ] All interactive elements have focus states
- [ ] Meta title and description are set

### After Each Iteration

1. **Commit the change**
   ```bash
   git add -A && git commit -m "improvement: [what you fixed]"
   ```

2. **Verify the fix**
   - Refresh the browser
   - Confirm the change looks correct
   - Check nothing else broke

3. **Update the checklist**
   - If you fixed something, mentally check it off
   - Move to the next unchecked item

4. **Know when to stop**
   - If all checklist items are done, stop the loop
   - If you've made 3 iterations with no meaningful improvement, stop
   - If you're about to undo something you just did, stop

### Anti-Patterns to Avoid

- **Thrashing:** Don't change something back and forth between iterations
- **Scope creep:** Don't add new features, just polish existing ones
- **Perfectionism:** 90% is good enough, move on
- **Breaking changes:** Don't refactor working code for style points
- **Ignoring errors:** Fix console errors before visual polish

### The Goal

Each iteration should make the site measurably better. When you can't find anything on the checklist to fix, and the site looks like something Apple would ship, you're done.

The mantra: **Small steps. Steady progress. Ship quality.**

---

*"I'm helping!" — Ralph Wiggum*

*Feed this to Claude Code and let it cook.*
