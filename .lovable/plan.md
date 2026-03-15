

# Activate All Landing Page Links

## Dead Links Inventory

### Navigation (`Navigation.tsx`)
- `#about` → no matching section exists

### Footer (`Footer.tsx`) — 15 dead `href="#"` links
**Trading column:** Evaluation Process, Trading Rules, Funded Accounts, Profit Splits, Withdrawals
**Tools & Education column:** Trading Tools, NinjaTrader Setup, Tradovate Integration, Video Tutorials, Trading Community
**Support column:** Help Center, Contact Support, Live Chat, FAQ, Status Page
**Bottom row:** Privacy Policy, Terms of Service, Risk Disclosure

## Solution

### Link to Existing Pages (no new pages needed)
| Link | Target |
|------|--------|
| FAQ | `/faq` |
| Help Center / Contact Support | `/support` |
| Video Tutorials / Trading Community | `/resources` |
| Trading Tools | `/screener` (or scroll `#features`) |

### New Pages to Create (4 pages)

1. **`/about`** — Company story, mission, team overview, regulatory info. Adds `id="about"` section or standalone page.

2. **`/trading-rules`** — Comprehensive rules page covering: Evaluation Process, Trading Rules, Funded Accounts, Profit Splits, Withdrawals. Uses anchor sections so each footer link scrolls to the right section. Covers daily loss limits, trailing drawdown, profit targets, scaling rules, payout process, allowed instruments.

3. **`/privacy-policy`** — Standard privacy policy page with sections: data collection, usage, cookies, third parties, user rights, contact.

4. **`/terms-of-service`** — Terms of service page covering: account terms, evaluation disclaimer, refund policy, liability, governing law.

### Navigation Fix
- `#about` in nav → link to `/about` page

### Footer Rewiring
```
Trading column:
  Evaluation Process → /trading-rules#evaluation
  Trading Rules      → /trading-rules#rules
  Funded Accounts    → /trading-rules#funded-accounts
  Profit Splits      → /trading-rules#profit-splits
  Withdrawals        → /trading-rules#withdrawals

Tools & Education column:
  Trading Tools         → /screener
  NinjaTrader Setup     → /resources
  Tradovate Integration → /resources
  Video Tutorials       → /resources
  Trading Community     → /support

Support column:
  Help Center      → /support
  Contact Support  → /support
  Live Chat        → /support
  FAQ              → /faq
  Status Page      → /support

Bottom:
  Privacy Policy   → /privacy-policy
  Terms of Service → /terms-of-service
  Risk Disclosure  → /#risk-disclosure (scroll to existing section on Index)
```

### Routes to Add in `App.tsx`
- `/about` → `About`
- `/trading-rules` → `TradingRules`
- `/privacy-policy` → `PrivacyPolicy`
- `/terms-of-service` → `TermsOfService`

## Files Modified
- `src/pages/About.tsx` — new
- `src/pages/TradingRules.tsx` — new
- `src/pages/PrivacyPolicy.tsx` — new
- `src/pages/TermsOfService.tsx` — new
- `src/components/Footer.tsx` — rewire all links
- `src/components/Navigation.tsx` — fix About link
- `src/App.tsx` — add 4 routes

