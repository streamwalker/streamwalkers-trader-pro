

# Quant Engine User's Guide and Manual

## Overview

Create a comprehensive in-app user guide for the Quant Engine, accessible from the Quant Engine page itself. The guide will be a new page at `/tools/quant-engine/guide` using the same collapsible section pattern as the existing FAQ page.

## What Gets Built

A full-page interactive manual covering every feature of the Quant Engine, organized into these sections:

### Guide Content Sections

1. **Getting Started** -- What the Quant Engine is, how to access it, prerequisites (account, watchlist)
2. **Strategy Builder** -- How to create strategies, strategy types explained (Trend Follow vs Mean Reversion), parameter tuning (MA periods, volatility cap, z-score threshold, lookback), adding/removing tickers to the universe, saving and loading strategies
3. **Understanding Risk Controls** -- Max position size, max daily loss, max drawdown, kill switch explained, recommended defaults for beginners vs experienced traders
4. **Running Backtests** -- How to run a backtest, what slippage and transaction costs mean, interpreting results (CAGR, Sharpe, Sortino, max drawdown, win rate, profit factor), reading the equity curve and drawdown charts, understanding the trades table
5. **Paper Trading** -- Starting/stopping paper trading, account summary explained, reading positions and P&L, how signals work, the kill switch emergency stop, updating prices
6. **Monitor and Risk Dashboard** -- Risk check indicators (green/yellow/red), drawdown usage gauge, signal summary, position exposure bars
7. **Strategy Reference** -- Detailed explanation of Strategy A (Trend + Vol Filter) and Strategy B (Mean Reversion), when to use each, parameter recommendations
8. **Glossary** -- Key terms: SMA, ATR, Z-Score, Sharpe Ratio, Sortino Ratio, CAGR, Drawdown, Kill Switch, Profit Factor, etc.

### UI Design

- Matches the existing FAQ page style: searchable, collapsible sections with category grouping
- Each section has multiple Q&A-style entries
- Related links pointing back to the relevant Quant Engine tabs
- "Back to Quant Engine" navigation button at the top
- A "User Guide" help button added to the Quant Engine page header

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/pages/QuantEngineGuide.tsx` | Full guide page with searchable collapsible sections |

### Files to Modify
| File | Change |
|------|--------|
| `src/App.tsx` | Add route `/tools/quant-engine/guide` |
| `src/pages/QuantEngine.tsx` | Add a "User Guide" button in the header linking to the guide page |

### Implementation Approach
- Reuse existing UI components: `Card`, `Collapsible`, `Badge`, `Button`, `Input` (search)
- Follow the exact pattern from `src/pages/FAQ.tsx` for the collapsible Q&A structure
- Guide data stored as a static array of sections/questions (no database needed)
- Include a search bar to filter across all sections
- Each answer includes related links back to the Quant Engine tabs and other platform pages
