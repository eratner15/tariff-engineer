# Demo Script for VCs / Newsletter

## The 2-Minute Pitch

### Opening (15 seconds)

"I want to show you something that could save importers millions of dollars—and they don't even know it exists."

### The Hook (30 seconds)

"A sneaker with a rubber sole pays 37.5% duty. Add felt to that sole? 7.5%. Same shoe. Different spec. Thirty points of margin."

[Pull up the site]

"Nike and Apple have entire teams dedicated to tariff engineering. Small importers have never heard of it. The precedents are public—buried in 10,000 pages of government rulings. We built the interface that makes them usable."

### The Demo (60 seconds)

[Click "Footwear" example]

"Here's how it works. You describe your product in natural language—"

[Read the example: "Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker"]

"—and in 10 seconds, you get legal tariff engineering opportunities."

[Results load]

"Current classification: 37.5% duty. But look—"

[Point to first opportunity]

"**Opportunity 1:** Add felt to the sole. Classification shifts from HTS 6404 to 6405. Duty drops to 7.5%. That's a 30% reduction. Saves $15 per unit, $150,000 per year at reasonable volume."

[Click the ruling link]

"And here's the actual CBP ruling that proves it works: NY N293844. Real precedent. Legally defensible."

[Back to results, point to second opportunity]

"**Opportunity 2:** Import the fitness tracker separately as a measuring instrument—0% duty. The footwear itself stays at 37.5%, but you're unbundling the high-value component. Another 12% weighted savings."

[Scroll to bottom]

"Total potential savings: $355,000 per year. For one product."

### The Close (15 seconds)

"I built this with Claude Code in one session. Concept to working prototype in hours. It's a demo—15 curated rulings right now—but the architecture scales to the full database."

"Question: Is this worth building into a real product?"

---

## Follow-Up Questions & Answers

### "How accurate is the AI?"

"Right now we're using Claude 3.5 Sonnet to analyze products against real CBP rulings. The analysis is good—but this is a tool FOR customs brokers, not a replacement. Think of it like GitHub Copilot for tariff classification. The broker makes the final call, but we give them the precedents and analysis in seconds instead of hours."

### "What's the business model?"

"Three tiers:
1. **Free tier:** Single product analysis, see what's possible
2. **Pro ($99-199/month):** Unlimited analyses, PDF reports, saved products
3. **Enterprise ($500+/month):** API access, batch analysis, client workspaces for consultants

Consultants currently charge $300/hour for this work. We can either undercut them or enable them to serve 10x more clients."

### "What's your moat?"

"Honest answer? The data is public. Someone can copy this. Our moat is:
1. **Speed** — We're first with a great UX
2. **Brand** — Rat Links has distribution to the right audience
3. **Execution** — Keep shipping features faster than competitors

Not a 10-year defensible moat. But a 2-3 year head start if we move fast."

### "How big is the market?"

"Every hardware company importing from Asia needs this:
- DTC brands (Allbirds, Away, etc)
- Consumer electronics (everyone)
- Fashion/footwear (massive)
- Manufacturing/industrial

U.S. imports were $3.8T in 2023. Even 0.1% of that market caring about this is huge. And that doesn't count the consulting market—there are thousands of customs brokers who could use this as a tool."

### "Why hasn't someone built this already?"

"Good question. I think three reasons:
1. **Domain knowledge** — You need to understand both customs law AND build good software. Rare combo.
2. **Data** — The CROSS database is public but messy. Scraping and structuring it is real work.
3. **Market perception** — This feels niche until you see the dollar amounts involved.

Plus, honestly, the AI piece is new. Claude is good enough to analyze complex precedents accurately. That wasn't true 2 years ago."

### "What do you need to make this real?"

"Three things:
1. **Data engineering** — Scrape and structure the full 65,000+ CROSS rulings
2. **Legal review** — Partnership with licensed brokers to validate accuracy
3. **Distribution** — Rat Links newsletter is the start, but we need sales to consultants

Budget-wise? $50K gets us 6 months to validate product-market fit. Runway to find out if this is a $10M business or a cool side project."

### "Can I try it?"

"Absolutely. Here's the URL: [your-vercel-url]

Try any product. If you import anything from Asia, put your actual product in and see what comes back. Then tell me if the opportunities are real."

---

## Newsletter Write-Up Template

Subject: **I built a tariff engineer in one afternoon**

---

The difference between 60% duty and 6% often comes down to product design.

A sneaker with a rubber sole pays 37.5%. Add felt to that sole? 7.5%. Same shoe. Different spec. Thirty points of margin.

Nike and Apple have teams for this. Small importers have never heard of it.

**The insight:** The precedents are public. They're buried in a government database called CROSS (Customs Rulings Online Search System). 65,000+ rulings. Nobody reads them.

**The opportunity:** What if you could describe your product in natural language and get back legal tariff engineering strategies in 10 seconds?

So I built it.

## Try it: [your-vercel-url]

**How it works:**
1. Describe your product (or click an example)
2. AI analyzes it against real CBP rulings
3. Get specific modifications that reduce duty rates
4. See supporting ruling IDs and links

Built with Claude Code. Concept to working prototype in one session.

**Current state:** This is a demo with 15 curated rulings covering footwear, electronics, bags, and wearables. It works—try the examples—but it's not production-ready.

**The question:** Is this worth building into a real product?

If you import stuff from Asia, try your actual products and let me know what you find. If you're a customs broker, tell me if I'm crazy or if this could actually help your workflow.

Reply with feedback. Or just play with it and tell me if the opportunities are real.

---

**Technical notes for the nerds:**
- Next.js + TypeScript
- Claude 3.5 Sonnet for analysis
- Real CBP rulings from CROSS database
- Jony Ive aesthetic (SF Pro Display, pill buttons, 80px margins)
- Built in one session with Claude Code
- [GitHub repo link if you want to open source it]

---

P.S. The "add felt to shoe sole" thing is real. HTS 6405.20.90 vs 6404.19.90. Look it up.

---

## Tweet Thread Template

1/ I built a tariff engineer this afternoon.

A tool that finds legal ways to reduce import duties by 30%+ through product design changes.

The precedents are public. I just made them usable.

Try it: [URL]

2/ The insight: A sneaker with a rubber sole pays 37.5% duty. Add felt to that sole? 7.5%.

Same shoe. Different classification. Thirty points of margin.

Nike has teams for this. Small importers don't know it exists.

3/ How it works:
- Describe your product in natural language
- AI analyzes against real CBP rulings
- Get specific modifications + supporting precedents
- See potential savings

Built with Claude Code in one session.

4/ Current state: Demo with 15 curated rulings. Try the examples—it actually works.

Question: Is this worth building into a real product?

If you import things, try your actual products and let me know what you find.

[URL]

5/ Technical stack for the nerds:
- Next.js + TypeScript
- Claude 3.5 Sonnet
- Real CBP rulings database
- Jony Ive aesthetic (pill buttons, SF Pro Display, radical whitespace)

From concept to deployed prototype in hours.

That's the magic of Claude Code.

---

*Adapt to your voice. Make it yours. Good luck!*
