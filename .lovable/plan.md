

# Platform Diagnostic Report & Fix Plan

## LINK AUDIT — All Navigation, Footer & Landing Page Links

### Navigation Links (Navigation.tsx)
| Link | Target | Status |
|------|--------|--------|
| How It Works | `#how-it-works` | OK — anchor exists in HowItWorks.tsx |
| Challenges | `#pricing` | OK — anchor exists in PricingSection.tsx |
| Instant Funding | `#instant-funding` | OK — anchor exists in InstantFundingSection.tsx |
| Business Plan | `/business-plan` | OK — route registered |
| About | `/about` | OK — route registered |
| Login button | `/auth` | **BROKEN** — no `/auth` route in App.tsx |
| Get Funded button | `/auth` | **BROKEN** — same missing route |

### Footer Links (Footer.tsx)
| Link | Target | Status |
|------|--------|--------|
| Evaluation Process | `/trading-rules#evaluation` | OK |
| Trading Rules | `/trading-rules#rules` | OK |
| Funded Accounts | `/trading-rules#funded-accounts` | OK |
| Profit Splits | `/trading-rules#profit-splits` | OK |
| Withdrawals | `/trading-rules#withdrawals` | OK |
| Trading Tools | `/screener` | OK |
| NinjaTrader Setup | `/resources` | OK |
| Tradovate Integration | `/resources` | OK |
| Video Tutorials | `/resources` | OK |
| Trading Community | `/support` | OK |
| Help Center | `/support` | OK |
| Contact Support | `/support` | OK |
| Live Chat | `/support` | OK |
| FAQ | `/faq` | OK |
| Status Page | `/support` | OK |
| Privacy Policy | `/privacy-policy` | OK |
| Terms of Service | `/terms-of-service` | OK |
| Risk Disclosure | `/#risk-disclosure` | **ISSUE** — section is placed AFTER Footer in Index.tsx, so the footer link works but the UX is odd (risk section is below footer) |

### Layout Header (Layout.tsx)
| Link | Target | Status |
|------|--------|--------|
| Login button | No onClick handler | **BROKEN** — button does nothing |
| Get Funded button | No onClick handler | **BROKEN** — button does nothing |

### Sidebar Links (AppSidebar.tsx)
All sidebar routes map to registered App.tsx routes — OK.

---

## CRITICAL BUGS FOUND

### 1. Missing `/auth` Route (HIGH)
`AuthPage` component exists at `src/components/AuthPage.tsx` but is never imported or routed in `App.tsx`. Navigation and ProtectedRoute both redirect to `/auth`, which hits the 404 catch-all.

**Fix:** Import AuthPage in App.tsx, add `<Route path="/auth" element={<AuthPage />} />`.

### 2. Layout Header Buttons Non-Functional (MEDIUM)
The Login and Get Funded buttons in `Layout.tsx` (lines 36-41) have no `onClick` handlers — they're dead buttons.

**Fix:** Wire them to navigate to `/auth` using `useNavigate`.

### 3. Risk Disclosure Below Footer (LOW)
In `Index.tsx`, the risk-disclosure section (line 27) is rendered AFTER `<Footer />` (line 24). This means content appears below the footer, which is unconventional.

**Fix:** Move the risk-disclosure section above `<Footer />`.

### 4. Finnhub WebSocket Infinite Reconnect Loop (MEDIUM)
Console shows continuous connect/disconnect/error every 5 seconds. The `onclose` handler unconditionally reconnects with `setTimeout(() => this.connectWebSocket(), 5000)` — with no max retry limit or backoff. Using a `demo` API key means the connection will always fail, creating an infinite error loop.

**Fix:** Add max retry count (e.g., 5 attempts) with exponential backoff, and stop reconnecting after limit is reached.

---

## Implementation Plan

### Files to modify:
1. **`src/App.tsx`** — Import AuthPage, add `/auth` route
2. **`src/components/Layout.tsx`** — Add `useNavigate`, wire Login/Get Funded buttons to `/auth`
3. **`src/pages/Index.tsx`** — Move risk-disclosure section above Footer
4. **`src/services/FinnhubProvider.ts`** — Add max retry count and exponential backoff to WebSocket reconnection

### Estimated scope: 4 small edits across 4 files

