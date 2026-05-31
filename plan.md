# GoAustralia.co.nz — Full Rebuild Plan
_Rebuilt from scratch. Modelled on StartAU's approach. Kiwi-specific throughout._

---

## What StartAU Does (and What We're Copying)

StartAU (startau.app) is a React SPA with Supabase auth and Stripe. Their core product:

| Feature | StartAU detail |
|---------|---------------|
| Pricing | $19.99 USD one-time · + $9 per family member |
| Auth | Google Sign-In + email/password via Supabase |
| Checklist | Interactive, per-step status (Not Started / In Progress / Completed / Not Applicable) |
| Personalisation | Select state (all 8 AU states) + visa type on onboarding |
| Per-step detail | Why it matters · How to complete · Official link · YouTube video |
| Family accounts | Up to 9 members · each gets their own checklist |
| Guides | Free Welcome to Australia PDF + Vehicle Purchase guide |
| Languages | English, Portuguese, Vietnamese, French |
| Tracking | Supabase-backed progress sync (not localStorage) |
| Tech | React + Tailwind + Supabase + Stripe |
| Colours | Very dark bg (#1A1A1A) · white text · blue accent (#1B2F5B) |

**What we do differently:** StartAU targets ALL new arrivals to Australia. We target ONLY New Zealanders. This is our moat — Kiwis have a completely unique situation (SCV, KiwiSaver transfer, IRD obligations, trans-Tasman Medicare, NZ qualification recognition) that generic guides miss entirely.

---

## Our Tech Stack (Rebuild)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Astro v6 | Already in place, fast static output |
| Interactivity | React islands (via `@astrojs/react`) | Checklist, dashboard, auth forms |
| Auth | Supabase | Google sign-in + email, same as StartAU |
| Payments | Stripe | One-time payment + Stripe Customer Portal |
| Database | Supabase Postgres | Checklist progress, user profiles, family |
| Deploy | Cloudflare Pages | Already set up |
| CSS | Custom properties (keep existing system) | No Tailwind rewrite needed |
| Email | Resend | Transactional emails |

---

## Design System (StartAU-Inspired, Kiwi Identity)

StartAU uses near-black dark theme. We adapt it:

```
Backgrounds:
  --bg-base:     #0D1117   (very dark, almost black — primary app bg)
  --bg-card:     #161B22   (card surfaces)
  --bg-raised:   #1C2128   (elevated elements, modals)
  --bg-border:   #30363D   (subtle borders)

Accent (Kiwi identity — keep amber but darker/more premium):
  --accent:      #F59E0B   (amber — not orange, more gold)
  --accent-dk:   #D97706
  --accent-lt:   #FEF3C7   (for light badges)

Text:
  --txt-base:    #E6EDF3   (primary text on dark)
  --txt-muted:   #8B949E   (secondary/muted)
  --txt-faint:   #484F58   (placeholder, disabled)

Status colours:
  --green:       #3FB950   (completed steps)
  --blue:        #58A6FF   (in progress)
  --yellow:      #F0B429   (pending)
  --red:         #F85149   (error)

Fonts:
  Heading:  Inter 700/800 (StartAU uses Inter only — clean, modern)
  Body:     Inter 400/500
  Mono:     system-mono (for codes/costs)

Drop Playfair Display — it reads too editorial for a product app.
```

---

## Pages to Build (Full Rebuild)

### Marketing / Public

| Page | URL | Priority |
|------|-----|----------|
| Homepage | `/` | P0 — full redesign |
| Pricing | `/pricing` | P0 — update to match new model |
| How it works | `/how-it-works` | P1 — StartAU has this |
| About | `/about` | P2 |
| Blog index | `/blog` | P1 |
| Blog post | `/blog/[slug]` | P1 |
| Privacy + Terms | `/privacy` `/terms` | P2 |

### Free Tools (no auth required)

| Tool | URL | What it does |
|------|-----|-------------|
| Visa Checker | `/tools/visa-checker` | Determine SCV eligibility, visa subclass |
| Move Cost Calculator | `/tools/cost-calculator` | NZD estimates for moving costs |
| Checklist Preview | `/tools/checklist` | First 10 steps free, paywall at 11 |
| Suburb Finder | `/tools/suburb-finder` | Compare suburbs by rent, commute, vibe |
| SCV Eligibility | `/tools/scv-check` | Quick NZ passport → SCV flow NEW |
| Tax Estimator | `/tools/tax-estimator` | NZ vs AU tax comparison NEW |

### Auth

| Page | URL | Notes |
|------|-----|-------|
| Sign Up | `/signup` | Google + email |
| Log In | `/login` | Google + email |
| Reset Password | `/reset-password` | Supabase magic link |

### App (auth required)

| Page | URL | Notes |
|------|-----|-------|
| Onboarding | `/onboarding` | Select state + visa + family size |
| Dashboard | `/dashboard` | Progress overview |
| Checklist | `/app/checklist` | Full 70-step interactive checklist |
| Guides | `/app/guides` | PDF guide library |
| Family | `/app/family` | Family member management |
| Account | `/app/account` | Plan, billing, profile |

---

## The Checklist — Full Data (Kiwi-Specific)

_StartAU has ~60 steps. We build 70 Kiwi-specific steps. The unique Kiwi steps (marked ✦) are our USP._

### Category 1 — Before You Leave NZ (Steps 1–8)
1. Confirm your SCV eligibility (NZ passport, no criminal history) ✦
2. Research which Australian state suits your job + lifestyle
3. Research cost of living by city (rent, childcare, transport)
4. Give notice to your NZ employer (standard 4 weeks)
5. Notify IRD of your departure and tax residency change ✦
6. Initiate KiwiSaver transfer to Australian super ✦
7. Organise NZ student loan obligations before leaving ✦
8. Arrange international pet transport if applicable

### Category 2 — Before You Arrive / 3+ Months Out (Steps 9–20)
9. Book flights and one-way or return (visa-free for NZ citizens)
10. Research rental market — suburbs, lease terms, AU renting norms
11. Budget for AU bond (4–6 weeks rent upfront)
12. Research Australian health system vs NZ (no free GP visits) ✦
13. Get NZ medical and dental records (harder to get after leaving) ✦
14. Organise international shipping or storage for belongings
15. Sell or store NZ vehicle (different rules apply AU-side)
16. Research AU childcare system + Child Care Subsidy if applicable ✦
17. Research NZ school leaving certificate recognition in AU ✦
18. Check your NZ professional licence — does it transfer? ✦
19. Research Australian superannuation system basics ✦
20. Open an Australian bank account from NZ (CommBank, ANZ, NAB all allow this)

### Category 3 — 1–3 Months Before Move (Steps 21–35)
21. Apply for Australian bank account (CommBank, ANZ, Westpac)
22. Arrange travel insurance for transit period
23. Sort NZ phone plan — port number or suspend
24. Research AU mobile plans (Telstra, Optus, Vodafone)
25. Research AU internet plans for your rental
26. Arrange removal company or container ship quotes
27. Sort NZ utilities (electricity, gas, internet — give notice)
28. Forward NZ mail to new address or PO Box
29. Notify NZ bank, insurers, subscriptions of address change
30. Gather identity documents (NZ passport, birth certificate, NZQA)
31. Research Australian health insurance options ✦
32. Research AU car buying (right-hand drive, rego process per state) ✦
33. Research AU rental market — required documents, references
34. Research your industry's AU salary benchmarks
35. Draft your AU-format CV (different expectations to NZ) ✦

### Category 4 — 2–4 Weeks Before Move (Steps 36–46)
36. Finalise AU accommodation (rental, short-term, friend/family)
37. Book AU short-term accommodation as backup
38. Transfer funds to AU bank account (use Wise to save on exchange)
39. Sort NZ IRD final tax return timing ✦
40. Confirm NZ KiwiSaver transfer paperwork is lodged ✦
41. Obtain NZ driver licence translation/international permit if needed
42. Cancel NZ direct debits and subscriptions
43. Cancel or transfer NZ insurance policies
44. Collect NZ medical prescriptions for 3+ months if possible
45. Back up all digital documents to cloud storage
46. Say your goodbyes — seriously, it matters

### Category 5 — Moving Week (Steps 47–54)
47. Do final walkthrough of NZ property — return keys, get bond back
48. Ship belongings / oversee removalist
49. Fly to Australia (no visa needed, NZ passport = automatic SCV entry) ✦
50. Clear Australian customs and biosecurity
51. Collect any pre-arranged AU SIM or buy at airport
52. Get to accommodation
53. Locate nearest supermarket, chemist, medical centre
54. Rest — moving is genuinely hard

### Category 6 — First Week in Australia (Steps 55–64)
55. Apply for Tax File Number (TFN) online via ATO ✦
56. Enrol in Medicare (NZ citizens eligible immediately) ✦
57. Set up AU bank account fully (deposit salary, set up cards)
58. Get an Australian SIM card (Telstra/Optus/Vodafone)
59. Enrol kids in school (contact state education department) ✦
60. Register NZ driver licence → AU equivalent (state-specific) ✦
61. Obtain Proof of Address document (utility bill or bank letter)
62. Find a GP and register (Medicare card needed) ✦
63. Set up MyGov account and link Medicare, ATO, Centrelink ✦
64. Notify ATO of your Australian address

### Category 7 — First Month (Steps 65–70)
65. Set up Australian superannuation fund and give to employer ✦
66. Check if your NZ super/KiwiSaver transfer has landed ✦
67. Register your vehicle in your state (import rules apply) ✦
68. Set up utilities: electricity, gas, internet at new address
69. Lodge first AU tax return or confirm lodgement deadline ✦
70. Join a Kiwi community in your city (Kiwi Facebook groups, NZSA) ✦

---

## Pricing Model (Matching StartAU)

| Plan | Price | What's included |
|------|-------|----------------|
| Free | $0 | First 10 checklist steps, visa checker, cost calculator |
| Individual | $24.99 NZD one-time | Full 70 steps, all guides, suburb finder, lifetime access |
| Family | $34.99 NZD one-time | Individual + up to 4 family members (each own checklist) |
| Extra members | + $9 NZD each | Add members any time |

_One-time payment, no subscription, lifetime access. Matches StartAU's model exactly._

---

## Per-Step Detail (Matching StartAU's depth)

Every step in the paid tier shows:
- **Why this matters** — e.g. "Without a TFN your employer withholds 47% tax"
- **How to complete it** — step-by-step instructions
- **Documents needed** — specific list
- **Estimated cost** — NZD and AUD where relevant
- **Estimated time** — to apply + processing time
- **Official government link** — direct to ATO, MSD, etc.
- **YouTube tutorial** — embedded or linked
- **State-specific notes** — where applicable (e.g. driver licence varies by state)
- **Kiwi-specific callout** — what's different for NZ citizens vs other migrants ✦

---

## Guides Library (Premium, PDF Downloads)

| Guide | NZD Price | Topic |
|-------|-----------|-------|
| Kiwi Masterguide | Included in Full Access | The complete A–Z for NZ → AU movers |
| Tax & Finance for Kiwis | Included | IRD departure, AU tax, KiwiSaver transfer, double tax |
| Kiwis Working in Australia | Included | CV, AU job market, industries, salary |
| NZ Qualifications in AU | $17 | What transfers, what needs revalidation |
| Buying a Car in Australia | $14 | State rego, roadworthy, insurance, ute tax |
| Renting in Australia | $14 | Bond, lease, agent expectations, state rules |
| Starting a Business in AU | $19 | ABN, GST, business structure, compliance |
| Family Relocation Guide | $19 | Schools, childcare, Medicare for kids, CCSS |

---

## Homepage Design (StartAU-Inspired, Kiwi-Specific)

**Above the fold:**
- Dark bg (#0D1117)
- Headline: `Your step-by-step guide to moving from New Zealand to Australia`
- Sub: `70 Kiwi-specific steps. TFN, Medicare, KiwiSaver transfer, AU super — in the right order.`
- Two CTAs: `Start Free →` and `View the Checklist`
- Right side: animated checklist mockup showing 5 steps with tick/progress states
- Trust line: `Trusted by X,XXX Kiwis · All 6 states · Special Category Visa`

**How it works strip:**
1. Select your state + situation
2. Follow your personalised checklist
3. Track progress for your whole family

**Checklist preview section:**
- Show 3–4 real steps (TFN, Medicare, KiwiSaver) with the detail card open
- CTA to unlock all 70

**Kiwi USP section:**
- "What makes us different" — list the Kiwi-specific steps nobody else covers
- KiwiSaver transfer, IRD departure, SCV eligibility, NZ licence recognition

**Guides teaser:**
- 3 guide cards with descriptions

**Social proof:**
- Real-looking testimonials from Kiwis in specific cities

**Pricing strip:**
- Individual $24.99 / Family $34.99 — simple, no monthly option

---

## Onboarding Flow (New — Match StartAU)

After sign-up, user completes 3-step onboarding:

**Step 1 — State**
> Which Australian state are you moving to?
> NSW · VIC · QLD · WA · SA · ACT · TAS · NT

**Step 2 — Situation**
> Which of these applies to you?
> NZ citizen · NZ permanent resident · Partner of NZ citizen · Working Holiday (NZ) · Student

**Step 3 — Family**
> Who else is moving with you?
> Just me · Partner · Partner + kids · Kids only
> → If family selected, create family member profiles

Then generate their personalised checklist and go to dashboard.

---

## Dashboard Design

Left sidebar:
- Logo
- My Checklist
- Guides
- Family
- Account
- Log out

Main area:
- Progress ring (X of 70 completed)
- Quick-access: next 3 incomplete steps
- Guides grid
- Family progress cards (if family plan)

Checklist page:
- Sticky category nav (Before NZ, Before Arrive, etc.)
- Step cards with status toggle (Not Started → In Progress → Done → N/A)
- Filter by: All / Incomplete / Completed
- State badge on state-specific steps

---

## Family Feature (Match StartAU)

- Individual plan covers 1 person
- Family plan covers purchaser + family members
- Each family member gets own checklist (own state/situation)
- Dashboard shows combined family progress
- Add member: enter name + state + situation → new checklist generated
- Up to 9 members (StartAU's limit)

---

## Phase Roadmap

### Phase 1 — Complete Redesign (Now → 4 weeks)
- [ ] Rebuild homepage with dark StartAU-style design + Inter font
- [ ] Add `/how-it-works` page
- [ ] Rebuild checklist page as interactive product (matching per-step detail)
- [ ] Redesign pricing page
- [ ] Remove Playfair Display throughout, switch to Inter 700/800 for headings
- [ ] Update global.css with new dark design tokens
- [ ] Mobile nav (hamburger menu)
- [ ] Add SCV Eligibility Tool (`/tools/scv-check`)
- [ ] Add Tax Estimator (`/tools/tax-estimator`)

### Phase 2 — Auth + Payments (Weeks 5–8)
- [ ] Supabase auth: Google Sign-In + email/password
- [ ] Stripe one-time payment ($24.99 individual / $34.99 family)
- [ ] Onboarding flow (state + situation + family)
- [ ] Dashboard (real, not static)
- [ ] Checklist synced to Supabase (not localStorage)
- [ ] Step detail cards (full depth per step)
- [ ] PDF guide delivery on purchase

### Phase 3 — Family + Content (Weeks 9–12)
- [ ] Family accounts (add members, per-member checklist)
- [ ] All 70 steps fully written with detail cards
- [ ] YouTube video links per step
- [ ] State-specific step variants (driver licence, rego, etc.)
- [ ] 30+ blog posts (SEO-targeted)
- [ ] Email flows: welcome, receipt, weekly tips (Resend)

### Phase 4 — Growth (Weeks 13+)
- [ ] Sitemap + robots.txt + structured data
- [ ] Google Analytics / Plausible
- [ ] Affiliate links: Wise, CommBank, Westpac, real estate
- [ ] Newsletter
- [ ] NZ-specific SEO push

---

## What Else We Can Do With goaustralia.co.nz

The domain is genuinely valuable — "Go Australia" is exactly what Kiwis search. Here are the best options ranked by upside:

### 1. SELL THE DOMAIN (Highest single payout, lowest effort)
- goaustralia.co.nz is a premium .co.nz exact-match domain
- A government agency, airline, travel company, or bank would pay $5,000–$30,000 NZD for it
- Tourism Australia, Air New Zealand, Qantas, Westpac NZ, ANZ are obvious buyers
- List on Sedo, Afternic, or approach those companies directly
- **Best if:** you want a quick cash exit and don't want to build it out

### 2. BUILD IT FULLY (This plan — highest long-term upside)
- Recurring income from paid checklist + guides
- Affiliate income: Wise ($30–50 per conversion), CommBank account, Westpac, Harcourts
- Display ads once traffic grows
- Newsletter monetisation (sponsorships from AU employers, removalists, financial advisors)
- **Best if:** you want to build a real media/product business

### 3. JOB BOARD FOR KIWIS IN AUSTRALIA
- Dedicated NZ → AU job board: "Jobs in Australia for New Zealanders"
- Employers pay $99–$299/listing to reach Kiwi talent
- Partner with NZ recruitment agencies with AU desks (Hays, Robert Half)
- Could sit at `jobs.goaustralia.co.nz` as a sub-product
- **Relatively simple to build** — just a job listing CMS + Stripe

### 4. KIWI COMMUNITY DIRECTORY
- Directory of NZ-owned businesses, Kiwi communities, expat groups in each AU city
- "Kiwi community in Melbourne" is searched — no good answer exists
- Businesses pay to list / be featured
- Facebook groups, rugby clubs, NZ food shops, etc.
- Low effort — could be a simple searchable directory

### 5. COMPARISON / AFFILIATE SITE
- No-checklist version: pure comparison content + affiliate links
- "Best bank account for Kiwis in Australia" → CommBank affiliate link
- "Best money transfer NZD to AUD" → Wise affiliate ($30/referral)
- "Best health insurance for NZ expats in AU" → health fund affiliate
- Potential: $500–$3,000/month passive at scale with good SEO
- **Best if:** you don't want to manage a SaaS product

### 6. NEWSLETTER BUSINESS
- Weekly email: "The Kiwi in Aus" — NZ → AU news, visa updates, tax changes
- Build to 5,000+ subscribers (very achievable in this niche)
- Monetise: sponsorships ($300–$800 per issue from AU employers, Wise, real estate)
- Simple to start: Resend or Beehiiv, weekly 500-word email
- SEO blog feeds subscribers
- **Easiest add-on to the existing plan**

### 7. YOUTUBE CHANNEL + BRAND
- goaustralia.co.nz as the home base for a YouTube channel
- "How to move from NZ to Australia" — very searchable, low competition
- Documentary-style: "Moving to Melbourne — Week 1, Week 4, Month 6"
- YouTube AdSense + affiliate links in descriptions
- Hard work, but highest audience-building potential

---

## Recommended Path

**Do this in order:**

1. **Now:** Rebuild the site properly (this plan — Phase 1)
2. **Month 2:** Wire up Stripe + Supabase (Phase 2) — start charging
3. **Month 3+:** Add newsletter (free, captures emails immediately)
4. **Ongoing:** Affiliate links (Wise is day-1 money, apply immediately)
5. **Later:** Decide — keep building or sell the domain once it has traffic + revenue

The affiliate angle is underrated — Wise pays ~$30 per person who signs up and sends money. If 100 Kiwis/month use your site and click through, that's $3,000/month before anyone pays for the checklist.

---

## Current State of Built Pages

| Page | URL | Status | Needs |
|------|-----|--------|-------|
| Homepage | `/` | Built — light theme | Rebuild dark |
| Pricing | `/pricing` | Updated to $24.99 | Minor updates |
| Guides index | `/guides` | Built | Keep |
| Guide detail | `/guides/[slug]` | 3 guides built | Keep |
| Blog index | `/blog` | Built | Keep |
| Blog posts | `/blog/[slug]` | 9 posts | Keep |
| Checklist | `/tools/checklist` | Built — 70 steps, paywall at 10 | Wire up properly in Phase 2 |
| Visa Checker | `/tools/visa-checker` | Built — JS only | Keep, improve |
| Cost Calculator | `/tools/cost-calculator` | Built | Keep |
| Suburb Finder | `/tools/suburb-finder` | Built | Keep |
| Dashboard | `/dashboard` | Static only | Rebuild in Phase 2 |
| Login | `/login` | Static | Wire in Phase 2 |
| Signup | `/signup` | Static | Wire in Phase 2 |
| About | `/about` | Built | Keep |
| Password gate | All pages | Active — `Mandeep2026` | Remove when live |
