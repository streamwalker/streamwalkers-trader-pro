

# Integrate Business School Finance & Economics into the Platform

## Overview

Enrich the Equiforge platform with calculators, analysis tools, and educational content drawn from the uploaded business school notes. This adds **6 new interactive calculators** and a **comprehensive financial reference guide** that strengthen the existing Performance, Analytics, and Education sections.

## What Gets Built

### 1. Financial Ratios Calculator (New Component)

A comprehensive interactive calculator for all the financial ratios from the notes:

- **Liquidity Ratios**: Current Ratio, Acid-Test (Quick) Ratio
- **Activity Ratios**: Accounts Receivable Turnover, Inventory Turnover, Average Collection Period, Average Sale Period, Operating Cycle, Total Asset Turnover
- **Profitability Ratios**: EPS, P/E Ratio, Return on Equity (DuPont decomposition: Margin x Turnover x Leverage), Return on Assets, Net Profit Margin
- **Investor Ratios**: Dividend Payout Ratio, Dividend Yield, Book Value Per Share
- **Leverage**: Debt-to-Equity, Times Interest Earned

Users input financial statement data and get all ratios computed with color-coded health indicators (green/yellow/red) and explanatory tooltips.

### 2. Break-Even & Contribution Margin Analyzer (New Component)

From the cost accounting notes:
- Input: Selling Price, Variable Cost per Unit, Fixed Expenses
- Computes: Contribution Margin per unit, CM Ratio, Break-Even Units, Break-Even Sales Dollars
- Target Income calculator: units needed to achieve a target profit
- Interactive chart showing cost/revenue intersection

### 3. Investment Valuation Calculator (New Component)

From the finance/interest notes -- extends the existing Compound Growth Calculator:
- **Simple Interest**: A = P + Prt
- **Compound Interest**: A = P(1 + r/m)^(mt)
- **Continuous Compounding**: A = Pe^(rt)
- **APY Calculator**: APY = (1 + r/m)^m - 1
- **Rule of 72**: Quick doubling time estimate
- **Future Value of Annuity**: FV = PMT x [(1+i)^n - 1] / i
- **Present Value of Annuity**: PV = PMT x [1 - (1+i)^(-n)] / i
- **NPV Calculator**: Given cash flows and discount rate
- **IRR Calculator**: Internal Rate of Return via bisection method
- **Payback Period**: Simple payback calculation

### 4. Supply & Demand Simulator (New Component)

Interactive economics visualization:
- Draggable supply/demand curves on a chart
- Determinant selectors (consumer expectations, resource prices, technology, taxes, number of suppliers/buyers)
- Shows equilibrium price and quantity shifts
- Surplus/shortage visualization
- Elasticity calculator using midpoint and averages formulas
- Cross-price elasticity and income elasticity computations

### 5. Probability & Expected Value Calculator (New Component)

Applied to trading scenarios:
- Define outcomes and probabilities (probability distribution table)
- Compute Expected Value: E(X) = Sum of x * p(x)
- Apply to trade setups: given win probability, win amount, loss amount -- compute EV
- Integrates with existing Kelly Criterion calculator as a feeder
- Random variable distributions visualization

### 6. ROI & Residual Income Dashboard (New Component)

From the management accounting notes:
- **ROI Calculator**: NOI / Average Operating Assets
- **DuPont Decomposition**: ROI = Margin (NOI/Sales) x Turnover (Sales/AOA)
- **Residual Income**: NOI - (AOA x Minimum Required Return)
- Compare multiple investment centers (A, B, C) side by side
- Manufacturing Cycle Efficiency: MCE = Process Time / Throughput Time
- Delivery Cycle Time breakdown visualization

### 7. Financial Concepts Reference Guide (New Page)

A searchable glossary and formula reference page at `/education/finance-reference` covering all concepts from the documents, organized by topic:
- Accounting & Financial Statements
- Economics (Supply/Demand, Elasticity, Market Structures)
- Finance (Time Value of Money, Interest, Valuation)
- Risk & Probability
- Management Accounting (Cost Analysis, Break-Even, ROI)

Each entry includes the formula, a plain-English explanation, and a "Try it" link to the relevant calculator.

## Integration Points

The new tools integrate into existing platform sections:

| Tool | Location |
|------|----------|
| Financial Ratios Calculator | Performance page, new "Fundamentals" tab |
| Break-Even Analyzer | Performance page, "Strategies" tab (alongside HighGrowthStrategies) |
| Investment Valuation Calculator | Performance page, new "Valuation" tab (extends existing Compound Growth) |
| Supply & Demand Simulator | Analytics page, new "Economics" tab |
| Probability & Expected Value | Analytics page, "Risk" tab (alongside AdvancedRiskManager) |
| ROI & Residual Income Dashboard | Analytics page, new "ROI Analysis" tab |
| Finance Reference Guide | Education section, new route |

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/FinancialRatiosCalculator.tsx` | All financial ratios with DuPont decomposition |
| `src/components/BreakEvenAnalyzer.tsx` | Break-even, CM, target income with chart |
| `src/components/InvestmentValuationCalc.tsx` | TVM calculators (simple/compound/annuity/NPV/IRR) |
| `src/components/SupplyDemandSimulator.tsx` | Interactive S&D curves with elasticity |
| `src/components/ProbabilityExpectedValue.tsx` | Probability distributions and EV for trades |
| `src/components/ROIResidualIncome.tsx` | ROI, DuPont, Residual Income, MCE |
| `src/pages/FinanceReference.tsx` | Searchable formula reference guide |

### Files to Modify

| File | Change |
|------|--------|
| `src/pages/Performance.tsx` | Add "Fundamentals" and "Valuation" tabs |
| `src/pages/Analytics.tsx` | Add "Economics" and "ROI Analysis" tabs |
| `src/App.tsx` | Add `/education/finance-reference` route |
| `src/components/AppSidebar.tsx` | Add Finance Reference link under Education |

### No New Dependencies

All calculators use existing libraries:
- recharts for charts (already installed)
- Existing UI components (Card, Tabs, Input, Slider, Badge)
- Math calculations in pure TypeScript

### Key Formulas Implemented

From the notes, these exact formulas will be coded:

**Ratios**: Current Ratio = Current Assets / Current Liabilities, ROE = (NI/Sales) x (Sales/Total Assets) x (Total Assets/Equity), P/E = Market Price / EPS

**Break-Even**: Units = Fixed Expenses / CM per Unit, Sales$ = Fixed Expenses / CM Ratio

**Time Value of Money**: A = P(1+r/m)^(mt), FV = PMT[(1+i)^n - 1]/i, PV = PMT[1-(1+i)^(-n)]/i, NPV = Sum of CF/(1+r)^t - Initial Investment

**Economics**: Elasticity (midpoint) = (%Change Q) / (%Change P), Consumer Surplus = Value to Buyers - Amount Paid

**Probability**: E(X) = Sum of xi * P(xi), applied to Kelly: f = (bp - q) / b

