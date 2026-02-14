

# Quant Engine Implementation Plan

## What We're Building

A quantitative trading engine integrated directly into your Equiforge platform. It provides strategy backtesting, paper trading simulation, portfolio optimization, and risk controls -- all running through Supabase edge functions and rendered in your existing React UI.

## Architecture Overview

The Quant Engine has three layers:

1. **Computation Layer** -- Supabase edge functions that run backtests, generate signals, and simulate paper trades
2. **Storage Layer** -- New database tables for strategies, backtests, signals, orders, and positions
3. **Presentation Layer** -- A new `/tools/quant-engine` page with tabs for Strategy Builder, Backtest Results, Paper Trading, and Monitoring

---

## Phase 1: Database Schema

Create these tables via migration:

**`quant_strategies`** -- Strategy templates and user configurations
- id, user_id, name, strategy_type (trend_follow, mean_reversion, custom), parameters (jsonb -- MA lengths, vol cap, rebalance freq, etc.), risk_controls (jsonb -- max position %, max daily loss, max drawdown, kill switch), universe (text[] -- ticker list), is_active, created_at, updated_at

**`quant_backtests`** -- Backtest run results
- id, strategy_id, run_config (jsonb -- date range, slippage, costs), status (pending, running, completed, failed), metrics (jsonb -- CAGR, Sharpe, Sortino, max drawdown, win rate, profit factor, turnover, exposure), equity_curve (jsonb -- array of {date, value}), drawdown_curve (jsonb), trades (jsonb -- array of trade objects), started_at, completed_at, created_at

**`quant_signals`** -- Generated trading signals
- id, strategy_id, symbol, signal_type (buy, sell, hold), confidence, entry_price, target_price, stop_loss, risk_reward, reasoning, generated_at, expires_at, status (active, executed, expired, cancelled)

**`quant_paper_orders`** -- Paper trading orders
- id, strategy_id, symbol, side (buy, sell), order_type (market, limit, stop), quantity, price, filled_price, slippage, commission_cents, status (pending, filled, cancelled, rejected), created_at, filled_at

**`quant_paper_positions`** -- Current paper positions
- id, strategy_id, symbol, quantity, avg_entry_price, current_price, unrealized_pnl, realized_pnl, opened_at, closed_at, status (open, closed)

**`quant_paper_account`** -- Paper trading account state
- id, strategy_id, starting_capital, current_equity, cash_balance, total_pnl, max_drawdown_pct, daily_pnl, is_active, kill_switch_triggered, last_updated

RLS policies: all tables scoped to user_id via auth.uid().

---

## Phase 2: Core Edge Functions

### 2.1 `quant-backtest` Edge Function

Receives strategy config + universe + date range. Performs:

1. **Data pull** -- Fetch historical OHLCV from FinnHub/Alpha Vantage (already have keys)
2. **Feature calculation** -- SMAs (20/50/100/200), ATR, realized volatility, z-scores, RSI
3. **Signal generation** -- Based on strategy type:
   - **Strategy A (Trend + Vol Filter):** 20/100 MA crossover, skip when ATR > 2x normal, volatility-target position sizing
   - **Strategy B (Mean Reversion):** Z-score of returns vs 20-day rolling mean, regime filter (skip in strong trends), tight stop losses
4. **Trade simulation** -- Walk through signals with realistic fill assumptions:
   - Transaction costs baked in (configurable, default 0.1%)
   - Slippage model (configurable, default 0.05%)
   - Position sizing per risk controls
5. **Metrics calculation** -- CAGR, Sharpe, Sortino, max drawdown, win rate, profit factor, turnover, tail risk
6. **Store results** in quant_backtests table

### 2.2 `quant-paper-trade` Edge Function

Runs on schedule (or on-demand) to simulate live trading:

1. Fetch latest prices for strategy universe
2. Generate signals from active strategy
3. Apply risk checks (max position %, max daily loss, max drawdown kill switch)
4. Create paper orders with simulated fills (price + slippage)
5. Update positions and account state
6. Log everything

### 2.3 `quant-signals` Edge Function

On-demand signal generation for any strategy + universe:

1. Pull latest market data
2. Calculate features (SMAs, ATR, z-scores)
3. Generate buy/sell/hold signals with confidence scores
4. Store in quant_signals table
5. Return results

---

## Phase 3: Frontend -- Quant Engine Page

New page at `/tools/quant-engine` with 4 tabs:

### Tab 1: Strategy Builder
- Dropdown to select strategy template (Trend Follow, Mean Reversion, Custom)
- Parameter sliders: MA lengths (fast/slow), volatility cap, rebalance frequency
- Risk controls panel: max position %, max daily loss %, max drawdown %, kill switch toggle
- Universe selector: pick from watchlist or enter custom tickers
- "Save Strategy" and "Run Backtest" buttons

### Tab 2: Backtest Results
- Equity curve chart (using recharts, already installed)
- Drawdown curve chart
- Metrics panel: CAGR, Sharpe, Sortino, max drawdown, win rate, profit factor, turnover, exposure
- Trades table with entry/exit, P&L, holding period
- Stress test toggles: 2x slippage, 2x costs, delayed fills
- Compare multiple backtest runs side-by-side

### Tab 3: Paper Trading
- Account summary: equity, cash, P&L, drawdown
- Active positions table with live P&L
- Order history table
- Signal feed (latest signals with confidence)
- Start/Stop paper trading controls
- Kill switch button (emergency stop)

### Tab 4: Monitor & Risk
- Real-time risk dashboard: current exposure, sector concentration, daily P&L limit usage
- Strategy health metrics
- Signal accuracy tracking over time
- Alert rules for risk breaches

### New Components:
- `src/components/QuantStrategyBuilder.tsx`
- `src/components/QuantBacktestResults.tsx`
- `src/components/QuantPaperTrading.tsx`
- `src/components/QuantRiskMonitor.tsx`
- `src/hooks/useQuantEngine.ts`
- `src/pages/QuantEngine.tsx`

### Navigation:
- Add "Quant Engine" to sidebar under Trading Tools with "Quant" badge

---

## Phase 4: Strategy Implementations

### Strategy A: Trend + Volatility Filter
```
Signal: 20-period SMA crosses above 100-period SMA = BUY
        20-period SMA crosses below 100-period SMA = SELL
Filter: Skip trade if ATR(14) > 2x its 50-day average
Sizing: Volatility targeting -- allocate inversely to realized vol
Risk:   Max 10% per position, max 3% daily loss, 15% drawdown kill switch
```

### Strategy B: Mean Reversion on Large Caps
```
Signal: Z-score of 5-day returns vs 20-day rolling mean
        Z < -2.0 = BUY (oversold)
        Z > +2.0 = SELL (overbought)
Filter: Only trade when ADX < 25 (avoid trending markets)
Sizing: Equal weight, max 5% per position
Risk:   Tight stops at 1.5x ATR, max 2% daily loss
```

---

## Phase 5: Paper Trading Automation

Set up a cron job to run the paper trading engine:
- **Every 30 minutes during market hours** (9:30 AM - 4:00 PM ET, Mon-Fri)
- Generates signals, places paper orders, updates positions
- Logs all activity for review

Gate for live trading (future): require 30 trading days of paper trading with max drawdown under user-defined threshold before enabling live.

---

## Technical Details

### Files to Create:
| File | Purpose |
|------|---------|
| `supabase/migrations/[timestamp]_quant_engine.sql` | All 6 tables + indexes + RLS |
| `supabase/functions/quant-backtest/index.ts` | Backtest engine |
| `supabase/functions/quant-paper-trade/index.ts` | Paper trading engine |
| `supabase/functions/quant-signals/index.ts` | Signal generation |
| `src/pages/QuantEngine.tsx` | Main page with tabs |
| `src/components/QuantStrategyBuilder.tsx` | Strategy config UI |
| `src/components/QuantBacktestResults.tsx` | Backtest visualization |
| `src/components/QuantPaperTrading.tsx` | Paper trading dashboard |
| `src/components/QuantRiskMonitor.tsx` | Risk monitoring |
| `src/hooks/useQuantEngine.ts` | React Query hooks |

### Files to Modify:
| File | Change |
|------|--------|
| `src/App.tsx` | Add `/tools/quant-engine` route |
| `src/components/AppSidebar.tsx` | Add Quant Engine nav item |
| `supabase/config.toml` | Add function configs with verify_jwt = false |

### Existing Infrastructure Reused:
- `LiveMarketDataService` / `FinnhubProvider` for real-time data
- `MarketDataService` for quotes and historical data
- FinnHub + Alpha Vantage API keys (already configured as secrets)
- recharts for equity/drawdown charts
- Existing UI component library (cards, tabs, tables, badges, sliders)

### No External Dependencies Needed:
- SMA, ATR, RSI, z-score calculations done in TypeScript within edge functions
- No Python/FastAPI required -- everything runs in Deno edge functions
- No broker adapter yet (paper trading only for MVP)

