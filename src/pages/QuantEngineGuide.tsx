import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ExternalLink, ArrowLeft, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

const guideData = [
  {
    id: "getting-started",
    category: "Getting Started",
    icon: "🚀",
    description: "What the Quant Engine is, how to access it, and what you need to begin",
    questions: [
      {
        id: "what-is-quant",
        question: "What is the Quant Engine?",
        answer: "The Quant Engine is a quantitative trading toolkit built into the platform. It lets you design rule-based trading strategies, backtest them against historical data with realistic transaction costs and slippage, run paper trading simulations, and monitor risk — all without writing code. The engine handles two proven strategy types: Trend Following (moving-average crossovers with a volatility filter) and Mean Reversion (z-score based entries on large-cap stocks).",
        relatedLinks: [
          { text: "Open Quant Engine", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "prerequisites",
        question: "What do I need before I start?",
        answer: "You need a platform account and at least one ticker symbol in mind. No watchlist is strictly required — you can type tickers directly into the Strategy Builder's universe field. However, having a watchlist already set up makes universe selection faster. No external broker connection is needed; the Quant Engine operates entirely in paper-trading mode.",
        relatedLinks: [
          { text: "Screener", url: "/screener" },
          { text: "Market Analysis", url: "/tools/analysis" }
        ]
      },
      {
        id: "quick-start",
        question: "How do I run my first backtest in 60 seconds?",
        answer: "1) Navigate to Quant Engine → Strategy Builder tab. 2) Enter a name like 'My First Strategy'. 3) Choose 'Trend Follow' as the strategy type. 4) Leave the default parameters (they're already set to sensible values). 5) Type a ticker symbol (e.g. AAPL) in the universe field and press Enter. 6) Click 'Save Strategy', then click 'Run Backtest'. 7) Switch to the Backtest Results tab to view your equity curve, drawdown chart, and performance metrics.",
        relatedLinks: [
          { text: "Strategy Builder", url: "/tools/quant-engine" }
        ]
      }
    ]
  },
  {
    id: "strategy-builder",
    category: "Strategy Builder",
    icon: "⚙️",
    description: "Creating strategies, choosing types, tuning parameters, and managing your ticker universe",
    questions: [
      {
        id: "create-strategy",
        question: "How do I create a new strategy?",
        answer: "Open the Strategy Builder tab and fill in: a strategy name, a strategy type (Trend Follow or Mean Reversion), parameters using the sliders, risk controls, and your ticker universe. Click 'Save Strategy' to store it. You can create multiple strategies and switch between them from the saved strategies list on the left side of the panel.",
        relatedLinks: [
          { text: "Strategy Builder", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "strategy-types",
        question: "What is the difference between Trend Follow and Mean Reversion?",
        answer: "Trend Follow buys when a fast moving average crosses above a slow moving average, and sells on the reverse cross. It profits in directional markets and uses a volatility filter to avoid trading during extreme conditions. Mean Reversion buys when a stock's recent returns are statistically oversold (z-score below −2) and sells when overbought (z-score above +2). It profits when prices snap back to their average, but only trades in non-trending environments (low ADX). The two strategies are complementary — Trend Follow works in trending markets, Mean Reversion works in range-bound markets.",
        relatedLinks: [
          { text: "Strategy Reference", url: "/tools/quant-engine/guide#strategy-reference" }
        ]
      },
      {
        id: "parameters-trend",
        question: "What do the Trend Follow parameters mean?",
        answer: "• Fast MA Period (default 20): The short-term moving average length in trading days. A smaller number makes the strategy more responsive but generates more false signals. • Slow MA Period (default 100): The long-term moving average. The crossover of fast above slow triggers a buy. • Volatility Cap (default 2.0): The ATR multiplier filter. If the current ATR exceeds this multiple of its 50-day average, new trades are skipped. A lower value makes the filter stricter. • Lookback Period (default 252): How many trading days of history to use for backtesting. 252 ≈ 1 year.",
        relatedLinks: []
      },
      {
        id: "parameters-mr",
        question: "What do the Mean Reversion parameters mean?",
        answer: "• Z-Score Threshold (default 2.0): How many standard deviations from the mean a stock's returns must be before a signal triggers. Higher values mean fewer but more extreme signals. • Lookback Period (default 20): The rolling window for calculating the mean and standard deviation of returns. • Volatility Cap (default 2.0): Same ATR-based filter as Trend Follow — skips trades in highly volatile conditions.",
        relatedLinks: []
      },
      {
        id: "universe-mgmt",
        question: "How do I add or remove tickers from the universe?",
        answer: "In the Strategy Builder, there is a text input for adding tickers. Type a symbol (e.g. MSFT) and press Enter or click the add button. Each ticker appears as a removable badge. Click the × on any badge to remove it. You can add as many tickers as you like, but more tickers mean longer backtest times. Start with 3–5 tickers for fast iteration.",
        relatedLinks: [
          { text: "Screener", url: "/screener" }
        ]
      },
      {
        id: "save-load",
        question: "How do I save and load strategies?",
        answer: "Click 'Save Strategy' to persist your configuration to the database. Saved strategies appear in the strategy list on the left panel. Click any saved strategy to load its parameters into the builder. You can then modify and re-save, or use it to run a new backtest. Each strategy is independent — changes to one don't affect others.",
        relatedLinks: []
      }
    ]
  },
  {
    id: "risk-controls",
    category: "Understanding Risk Controls",
    icon: "🛡️",
    description: "Position limits, loss caps, drawdown rules, and the kill switch",
    questions: [
      {
        id: "max-position",
        question: "What is Max Position Size?",
        answer: "Max Position Size is the maximum percentage of your paper portfolio that can be allocated to a single ticker. For example, at 10%, a $100,000 account can hold at most $10,000 in any one stock. This prevents concentration risk — if one stock crashes, your total loss is capped. Beginners should use 5–10%, experienced traders may go up to 15–20%.",
        relatedLinks: []
      },
      {
        id: "max-daily-loss",
        question: "What is Max Daily Loss?",
        answer: "Max Daily Loss is the percentage of your account you're willing to lose in a single day before all trading stops. At 3%, a $100,000 account stops trading after losing $3,000 in one day. This is a hard circuit breaker — once triggered, no new orders are placed until the next trading day. It prevents emotional revenge trading after a bad day.",
        relatedLinks: []
      },
      {
        id: "max-drawdown",
        question: "What is Max Drawdown?",
        answer: "Max Drawdown is the maximum peak-to-trough decline allowed before the kill switch activates. At 15%, if your account drops from $100,000 to $85,000 at any point, all positions are closed and trading halts. This is the ultimate safety net. Unlike daily loss (which resets each day), drawdown is measured from your all-time equity high.",
        relatedLinks: []
      },
      {
        id: "kill-switch",
        question: "What is the Kill Switch?",
        answer: "The Kill Switch is an emergency stop that immediately halts all paper trading activity. It can be triggered automatically (when max drawdown is breached) or manually (by clicking the Kill Switch button on the Paper Trading tab). When activated, all open positions are flagged, no new signals are generated, and no new orders are placed. To resume trading, you must manually restart paper trading and acknowledge the reset.",
        relatedLinks: [
          { text: "Paper Trading", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "recommended-defaults",
        question: "What risk settings should I use?",
        answer: "For beginners: Max Position 5%, Max Daily Loss 2%, Max Drawdown 10%, Kill Switch ON. For intermediate traders: Max Position 10%, Max Daily Loss 3%, Max Drawdown 15%, Kill Switch ON. For experienced traders: Max Position 15%, Max Daily Loss 5%, Max Drawdown 20%, Kill Switch ON. We strongly recommend always keeping the Kill Switch enabled — there is no downside to having it as a safety net.",
        relatedLinks: []
      }
    ]
  },
  {
    id: "backtesting",
    category: "Running Backtests",
    icon: "📊",
    description: "How to backtest, interpret results, and understand performance metrics",
    questions: [
      {
        id: "run-backtest",
        question: "How do I run a backtest?",
        answer: "Select or create a strategy in the Strategy Builder, then click 'Run Backtest'. The engine fetches historical OHLCV data for every ticker in your universe, calculates technical indicators (SMAs, ATR, z-scores), generates signals, and simulates trades with configurable slippage and transaction costs. Results appear in the Backtest Results tab once the run completes.",
        relatedLinks: [
          { text: "Backtest Results", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "slippage-costs",
        question: "What are slippage and transaction costs?",
        answer: "Slippage is the difference between the expected fill price and the actual fill price. In real markets, your order moves the price slightly. The default slippage model assumes 0.05% per trade. Transaction costs include broker commissions and exchange fees, defaulting to 0.1% per trade. These are deducted from each simulated trade to produce realistic results. Without these deductions, backtests would be misleadingly profitable.",
        relatedLinks: []
      },
      {
        id: "metrics-explained",
        question: "How do I read the performance metrics?",
        answer: "• CAGR (Compound Annual Growth Rate): Your annualized return. 15% means your portfolio grew 15% per year on average. • Sharpe Ratio: Return per unit of risk. Above 1.0 is good, above 2.0 is excellent. • Sortino Ratio: Like Sharpe but only penalizes downside volatility. Often higher than Sharpe. • Max Drawdown: The worst peak-to-trough decline during the backtest. Lower is better. • Win Rate: Percentage of profitable trades. 50–60% is typical for trend strategies. • Profit Factor: Gross profits ÷ gross losses. Above 1.5 is solid.",
        relatedLinks: []
      },
      {
        id: "equity-curve",
        question: "How do I read the equity curve and drawdown charts?",
        answer: "The equity curve shows your portfolio value over time. An upward-sloping curve indicates profitability. Steeper slopes mean faster gains. The drawdown chart shows how far below the peak your portfolio was at each point. Deeper and longer drawdowns indicate higher risk. Ideally, drawdowns should be shallow and brief. If the drawdown chart shows extended periods at −15% or worse, the strategy may need tighter risk controls.",
        relatedLinks: []
      },
      {
        id: "trades-table",
        question: "What does the trades table show?",
        answer: "The trades table lists every simulated trade: ticker symbol, entry date and price, exit date and price, quantity, side (buy/sell), profit or loss, and holding period. Use it to spot patterns — are losses clustered around specific events? Are winning trades held longer than losers? This table is essential for strategy refinement.",
        relatedLinks: []
      }
    ]
  },
  {
    id: "paper-trading",
    category: "Paper Trading",
    icon: "📝",
    description: "Simulating live trades, managing positions, and monitoring P&L",
    questions: [
      {
        id: "start-stop",
        question: "How do I start and stop paper trading?",
        answer: "Go to the Paper Trading tab, select a saved strategy, and click 'Start Paper Trading'. This creates a paper account with $100,000 starting capital and begins generating signals based on your strategy. To stop, click 'Stop Paper Trading'. Your positions and history are preserved for review. You can restart at any time.",
        relatedLinks: [
          { text: "Paper Trading", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "account-summary",
        question: "What does the account summary show?",
        answer: "The account summary displays: Starting Capital (always $100,000), Current Equity (capital + unrealized P&L), Cash Balance (unallocated funds), Total P&L (realized + unrealized gains/losses), Daily P&L (today's change), and Max Drawdown % (worst peak-to-trough decline so far). Green numbers are gains, red are losses.",
        relatedLinks: []
      },
      {
        id: "positions-pnl",
        question: "How do I read positions and P&L?",
        answer: "The positions table shows each open position: symbol, quantity, average entry price, current price, unrealized P&L (profit/loss if you closed now), and status. Unrealized P&L updates when you click 'Update Prices'. Realized P&L appears in the orders table after positions are closed by the strategy.",
        relatedLinks: []
      },
      {
        id: "signals-explained",
        question: "How do signals work in paper trading?",
        answer: "When paper trading is active, the engine generates buy/sell/hold signals based on your strategy's rules applied to current market data. Signals with sufficient confidence are automatically converted to paper orders. Each signal shows: symbol, direction (buy/sell), confidence score (0–1), entry price target, and reasoning. You can review signals before they execute if you prefer manual confirmation.",
        relatedLinks: []
      },
      {
        id: "update-prices",
        question: "How do I update current prices?",
        answer: "Click the 'Update Prices' button on the Paper Trading tab. This fetches the latest market quotes for all symbols in your active positions and recalculates unrealized P&L. Prices don't update automatically — you need to click the button or wait for the scheduled cron job (every 30 minutes during market hours).",
        relatedLinks: []
      }
    ]
  },
  {
    id: "monitor-risk",
    category: "Monitor & Risk Dashboard",
    icon: "🔍",
    description: "Real-time risk indicators, drawdown tracking, and signal summaries",
    questions: [
      {
        id: "risk-checks",
        question: "What do the risk check indicators mean?",
        answer: "The Monitor tab shows colored indicators for each risk rule: 🟢 Green = well within limits (under 50% of threshold). 🟡 Yellow = approaching limits (50–80% of threshold). 🔴 Red = at or beyond limits (80%+ of threshold, or triggered). For example, if your max daily loss is 3% and you've lost 2%, the indicator turns yellow. At 2.5%+ it turns red.",
        relatedLinks: [
          { text: "Risk Monitor", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "drawdown-gauge",
        question: "How does the drawdown usage gauge work?",
        answer: "The drawdown gauge shows your current drawdown as a percentage of your maximum allowed drawdown. If your max drawdown setting is 15% and your current drawdown is 6%, the gauge shows 40% usage. The gauge changes color from green through yellow to red as usage increases. At 100%, the kill switch triggers automatically.",
        relatedLinks: []
      },
      {
        id: "signal-summary",
        question: "What is the signal summary?",
        answer: "The signal summary panel aggregates all recent signals across your strategy's universe. It shows total buy signals, sell signals, and hold signals, along with the average confidence score. This gives you a quick read on market direction — if most signals are buy with high confidence, the strategy is bullish. If signals are mixed with low confidence, conditions are uncertain.",
        relatedLinks: []
      },
      {
        id: "position-exposure",
        question: "What do the position exposure bars show?",
        answer: "Position exposure bars display how much of your portfolio is allocated to each symbol, as a percentage of total equity. Longer bars mean more concentrated positions. The bars are color-coded: green for positions within your max position limit, red for positions that exceed it. This helps you quickly spot over-concentration before it becomes a problem.",
        relatedLinks: []
      }
    ]
  },
  {
    id: "strategy-reference",
    category: "Strategy Reference",
    icon: "📐",
    description: "Detailed explanations of built-in strategies, when to use each, and parameter recommendations",
    questions: [
      {
        id: "strategy-a-detail",
        question: "Strategy A: Trend + Volatility Filter — Full Details",
        answer: "This strategy uses two Simple Moving Averages (SMAs). When the fast SMA (default 20-day) crosses above the slow SMA (default 100-day), it generates a BUY signal. When the fast crosses below the slow, it generates a SELL signal. A volatility filter prevents trading when the 14-day ATR exceeds 2× its own 50-day average — this avoids choppy, whipsaw-prone environments. Position sizing uses volatility targeting: allocate more capital when volatility is low, less when it's high. Default risk controls: max 10% per position, 3% daily loss cap, 15% drawdown kill switch.",
        relatedLinks: [
          { text: "Strategy Builder", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "strategy-b-detail",
        question: "Strategy B: Mean Reversion — Full Details",
        answer: "This strategy calculates the z-score of 5-day returns relative to a 20-day rolling mean and standard deviation. When the z-score drops below −2.0, the stock is statistically oversold → BUY. When it rises above +2.0, the stock is overbought → SELL. A regime filter (ADX < 25) ensures the strategy only trades in range-bound markets — mean reversion in strong trends leads to large losses. Position sizing is equal-weight with a max of 5% per position. Stop losses are set at 1.5× ATR from entry. Max daily loss is 2%.",
        relatedLinks: [
          { text: "Strategy Builder", url: "/tools/quant-engine" }
        ]
      },
      {
        id: "when-to-use",
        question: "When should I use each strategy?",
        answer: "Use Trend Follow when markets are directional — strong uptrends or downtrends, sector rotations, momentum-driven environments. It underperforms in sideways, choppy markets. Use Mean Reversion when markets are range-bound — stocks oscillating around a mean, low-trend environments, markets consolidating after large moves. It underperforms (and can blow up) in strongly trending markets. Ideally, run both strategies simultaneously on different ticker universes to diversify across regimes.",
        relatedLinks: []
      },
      {
        id: "param-recommendations",
        question: "What parameter settings are recommended?",
        answer: "For Trend Follow on daily stocks: Fast MA 20, Slow MA 100, Vol Cap 2.0, Lookback 252. For shorter-term trend: Fast MA 10, Slow MA 50. For smoother but slower signals: Fast MA 50, Slow MA 200. For Mean Reversion: Z-Score 2.0, Lookback 20 are the standard settings. Tighten to Z-Score 1.5 for more signals (but lower quality). Widen to Z-Score 2.5 for fewer but higher-conviction signals. Always backtest before changing parameters — a small tweak can dramatically alter performance.",
        relatedLinks: []
      }
    ]
  },
  {
    id: "glossary",
    category: "Glossary",
    icon: "📖",
    description: "Key terms and definitions used throughout the Quant Engine",
    questions: [
      {
        id: "sma-def",
        question: "SMA (Simple Moving Average)",
        answer: "The arithmetic mean of a security's closing price over a specified number of periods. A 20-day SMA sums the last 20 closing prices and divides by 20. Used in trend-following strategies to smooth out price noise and identify direction. When the short-term SMA crosses above the long-term SMA, it's a bullish signal (Golden Cross). The reverse is bearish (Death Cross).",
        relatedLinks: []
      },
      {
        id: "atr-def",
        question: "ATR (Average True Range)",
        answer: "A measure of market volatility. True Range is the greatest of: current high minus current low, absolute value of current high minus previous close, or absolute value of current low minus previous close. ATR is the average of True Range over N periods (typically 14). Higher ATR means more volatility. Used for position sizing, stop-loss placement, and as a volatility filter.",
        relatedLinks: []
      },
      {
        id: "zscore-def",
        question: "Z-Score",
        answer: "A statistical measure indicating how many standard deviations a data point is from the mean. Z-Score = (Value − Mean) / Standard Deviation. In mean reversion strategies, a z-score of −2.0 means the price is 2 standard deviations below average — statistically oversold. A z-score of +2.0 means 2 standard deviations above — overbought.",
        relatedLinks: []
      },
      {
        id: "sharpe-def",
        question: "Sharpe Ratio",
        answer: "A measure of risk-adjusted return. Sharpe = (Portfolio Return − Risk-Free Rate) / Portfolio Standard Deviation. A Sharpe of 1.0 means you earned 1 unit of return for each unit of risk. Above 1.0 is good, above 2.0 is excellent, above 3.0 is exceptional. Most real-world strategies have Sharpes between 0.5 and 2.0.",
        relatedLinks: []
      },
      {
        id: "sortino-def",
        question: "Sortino Ratio",
        answer: "Similar to the Sharpe Ratio but only penalizes downside volatility. Sortino = (Portfolio Return − Risk-Free Rate) / Downside Deviation. This is often considered a better measure because it doesn't penalize upside volatility (which investors actually want). A Sortino higher than the Sharpe indicates the strategy's volatility is predominantly on the upside.",
        relatedLinks: []
      },
      {
        id: "cagr-def",
        question: "CAGR (Compound Annual Growth Rate)",
        answer: "The annualized rate of return that smooths out yearly fluctuations. CAGR = (Ending Value / Beginning Value)^(1/Years) − 1. A CAGR of 15% means your portfolio grew at 15% per year on average, compounded. This is the single most important return metric for comparing strategies across different time periods.",
        relatedLinks: []
      },
      {
        id: "drawdown-def",
        question: "Drawdown",
        answer: "The peak-to-trough decline in portfolio value, expressed as a percentage. If your portfolio rises to $120,000 then falls to $96,000, the drawdown is ($120,000 − $96,000) / $120,000 = 20%. Max drawdown is the largest such decline over the entire period. It measures the worst-case pain an investor would have experienced.",
        relatedLinks: []
      },
      {
        id: "killswitch-def",
        question: "Kill Switch",
        answer: "An automatic circuit breaker that halts all trading activity when risk limits are exceeded. In the Quant Engine, the kill switch triggers when max drawdown is breached, closing all positions and preventing new orders. It can also be activated manually as an emergency stop. It exists to prevent catastrophic losses.",
        relatedLinks: [
          { text: "Risk Controls", url: "/tools/quant-engine/guide#risk-controls" }
        ]
      },
      {
        id: "profitfactor-def",
        question: "Profit Factor",
        answer: "The ratio of gross profits to gross losses. Profit Factor = Total Winning Trades $ / Total Losing Trades $. A profit factor of 1.5 means you made $1.50 for every $1.00 lost. Above 1.0 is profitable, above 1.5 is good, above 2.0 is excellent. Below 1.0 means the strategy is losing money overall.",
        relatedLinks: []
      },
      {
        id: "adx-def",
        question: "ADX (Average Directional Index)",
        answer: "A trend strength indicator ranging from 0 to 100. ADX below 20 indicates a weak trend or range-bound market. ADX above 25 indicates a strong trend. ADX above 50 indicates a very strong trend. In the Mean Reversion strategy, trades are only taken when ADX is below 25 to avoid trending markets where mean reversion fails.",
        relatedLinks: []
      }
    ]
  }
];

export default function QuantEngineGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredGuide = guideData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link to="/tools/quant-engine">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quant Engine
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Cpu className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quant Engine User Guide</h1>
              <p className="text-muted-foreground">
                Complete manual covering strategy building, backtesting, paper trading, and risk management.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search the Guide</CardTitle>
          <CardDescription>Find specific topics, terms, or features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics, terms, and features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredGuide.map((category) => (
          <Card key={category.id} id={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.category}
                <Badge variant="secondary">{category.questions.length}</Badge>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.questions.map((item) => (
                <Collapsible
                  key={item.id}
                  open={openSections.includes(item.id)}
                  onOpenChange={() => toggleSection(item.id)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 rounded-lg border">
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes(item.id) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{item.answer}</p>
                      {item.relatedLinks && item.relatedLinks.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Related:</h5>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedLinks.map((link, index) => (
                              <Link
                                key={index}
                                to={link.url}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                {link.text}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuide.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
