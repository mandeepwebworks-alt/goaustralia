# GoAustralia.co.nz — Project Plan

## What We're Building
A subscription content site for New Zealanders moving to Australia. Sells PDF guides ($1.99/month or individually at $19–$27) plus free immigration tools.

## Tech Stack
- **Framework**: Astro v6 (static site generation)
- **Styling**: CSS custom properties + Tailwind (minimal)
- **Fonts**: Playfair Display (headings) + Inter (body)
- **Payments**: Stripe (not yet wired — Phase 2)
- **Auth**: Supabase (not yet wired — Phase 2)
- **Deploy**: Cloudflare Pages

---

## Pages Built ✅

| Page | URL | Status |
|------|-----|--------|
| Homepage | `/` | Done |
| Pricing | `/pricing` | Done |
| Guides index | `/guides` | Done |
| Guide detail | `/guides/[masterguide\|tax-finance\|jobs]` | Done |
| Blog index | `/blog` | Done |
| Blog post | `/blog/[slug]` — 9 posts | Done |
| Dashboard | `/dashboard` | Done (static, no auth yet) |
| Login | `/login` | Done (static) |
| Signup | `/signup` | Done (static) |
| About | `/about` | Done |

## Tools Built ✅

| Tool | URL | Notes |
|------|-----|-------|
| Visa Pathway Checker | `/tools/visa-checker` | Vanilla JS, no backend |
| Move Cost Calculator | `/tools/cost-calculator` | NZD estimates |
| Moving Checklist | `/tools/checklist` | 70 steps, localStorage |
| Suburb Finder | `/tools/suburb-finder` | 20 suburbs, filterable |

---

## Phase 1 — Design & Content (Current) ✅
- [x] Global design system (Playfair Display + Inter, amber/dark tokens)
- [x] All pages built
- [x] All tools built (static/JS only)
- [x] Homepage redesign (editorial, no emojis, product-focused)
- [x] Blog + Guide content (static data, no CMS)

## Phase 2 — Payments & Auth
- [ ] Stripe subscription ($1.99/month) + one-time guide purchases
- [ ] Supabase auth (signup, login, session)
- [ ] Dashboard — real user data (guides downloaded, checklist sync)
- [ ] Protected routes (guides only for subscribers)
- [ ] Email (welcome, receipt, newsletter) via Resend or Postmark

## Phase 3 — Growth & SEO
- [ ] Sitemap.xml + robots.txt
- [ ] Structured data (Article, FAQPage schema)
- [ ] Blog content expansion (target 30+ posts)
- [ ] Google Analytics / Plausible
- [ ] Newsletter infrastructure (Resend or Mailchimp)
- [ ] Affiliate links (Wise, CommBank, real estate portals)

---

## Design System

```
Colors:
  --dark:    #0F172A   (hero, footer, CTA backgrounds)
  --amber:   #C2570A   (primary accent — links, CTAs, eyebrows)
  --ink:     #111827   (body text)
  --surface: #F9FAFB   (light section backgrounds)

Fonts:
  Headings:  Playfair Display 600–800
  Body:      Inter 400–700

Spacing: 88px section padding, 28px shell horizontal
```

## Revenue Model
- $1.99/month — all 3 guides + tools + newsletter
- $19 one-time — Masterguide
- $22 one-time — Tax & Finance guide  
- $27 one-time — Jobs guide

## Target Keywords
- "moving from New Zealand to Australia"
- "kiwi moving to australia guide"
- "special category visa guide 2025"
- "australian tax for new zealanders"
- "how to rent in australia kiwi"
