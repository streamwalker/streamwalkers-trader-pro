

# Refine Landing Page: Opportunity-First, Not Technology-First

## What's Already Working
The hero headline, challenge tiers, instant funding, scale plan, leaderboard, and AI membership are all in place. The core structure is solid.

## What Needs to Change

### 1. Hero — Remove Tech Language, Add Psychology Triggers
The subheading still says "AI-powered prop trading platform" — this sells technology. Replace with pure opportunity language. Add key psychology triggers (fast payouts, global access, scaling) as icon badges below the stats.

**Changes to `Hero.tsx`:**
- Rewrite subheading: "Get funded in as little as 24 hours. Prove your skills, trade our capital, and withdraw your profits every 7 days."
- Add a row of 4 small icon badges below stats: "Payouts Every 7 Days" | "Scale to $1M" | "120+ Countries" | "No Monthly Fees"
- Change CTA from "Start Challenge — From $79" to "Get Funded — From $79"

### 2. Page Order — Move Pricing Higher
Traders immediately want to see account sizes, costs, and rules. Move `PricingSection` up to appear right after `HowItWorks`, before `InstantFundingSection`.

**Changes to `Index.tsx`:**
- Reorder: Hero → TrustSection → PricingSection → HowItWorks → InstantFundingSection → (rest)

### 3. Trust Section — Add More Proof Signals
Add two more stats: "Payouts Every 7 Days" and "120+ Countries". Add a row of mock payout proof thumbnails / testimonials.

**Changes to `TrustSection.tsx`:**
- Add "7 Days" (Average Payout Cycle) and "120+" (Countries) stats
- Add a "Recent Payouts" ticker or mini testimonial row beneath the stats grid showing 3-4 mock funded trader testimonials with amounts

### 4. Navigation — Opportunity Language
Change "Trading Tools" to "How It Works", add "Challenges" link to #pricing.

**Changes to `Navigation.tsx`:**
- Replace "Trading Tools" → "How It Works" (#how-it-works)
- Replace "Education" → "Challenges" (#pricing)
- Add id="how-it-works" to HowItWorks section

### 5. AI Section — Position as Core Engine, Not Add-On
Rename from "TraderPro AI Membership" to "Trader Intelligence Engine". Reframe the description to emphasize this is what makes EquiForge different — it identifies the top 1% and allocates real capital.

**Changes to `AIMembershipSection.tsx`:**
- Update heading to "Trader Intelligence Engine"
- Rewrite description: "Not just another trading platform. Our AI analyzes thousands of traders to find the top 1% — then allocates them real capital. This is Moneyball for trading."
- Keep the subscription CTA but frame it as accessing the intelligence layer

### 6. Leaderboard — Strengthen "Funded Career" Framing
Update the heading from "AI Trader Intelligence" to "Your Path to a Funded Career". The Trader Score card intro text should emphasize career progression, not just analytics.

**Changes to `TraderLeaderboard.tsx`:**
- Left column heading: "Your Funded Trading Career" with description emphasizing the career path
- Add "Top 1% traders receive larger capital and partnership opportunities" callout

### 7. PricingSection — Add Profit Split Column
Make profit split visible per tier. Add "90% Profit Split" badge prominently on each card.

**Changes to `PricingSection.tsx`:**
- Add a "90% Profit Split" badge to each card header
- Add "Payout: Every 7 Days" to the stats grid on each card

## Files Modified
- `src/components/Hero.tsx` — opportunity language, psychology triggers
- `src/pages/Index.tsx` — reorder sections
- `src/components/TrustSection.tsx` — more stats + testimonials
- `src/components/Navigation.tsx` — opportunity-focused nav links
- `src/components/AIMembershipSection.tsx` — "Intelligence Engine" positioning
- `src/components/TraderLeaderboard.tsx` — career framing
- `src/components/PricingSection.tsx` — profit split prominence
- `src/components/HowItWorks.tsx` — add section id

