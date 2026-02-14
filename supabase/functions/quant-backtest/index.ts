import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Technical Indicators ──────────────────────────────────────────────
function sma(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j];
    result.push(sum / period);
  }
  return result;
}

function atr(highs: number[], lows: number[], closes: number[], period: number): (number | null)[] {
  const trs: number[] = [];
  for (let i = 0; i < highs.length; i++) {
    if (i === 0) { trs.push(highs[i] - lows[i]); continue; }
    const tr = Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1]));
    trs.push(tr);
  }
  return sma(trs, period);
}

function zScore(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const std = Math.sqrt(variance);
    result.push(std === 0 ? 0 : (data[i] - mean) / std);
  }
  return result;
}

function returns(closes: number[]): number[] {
  const r: number[] = [0];
  for (let i = 1; i < closes.length; i++) {
    r.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }
  return r;
}

// ── Fetch OHLCV from Alpha Vantage ───────────────────────────────────
async function fetchOHLCV(symbol: string, apiKey: string): Promise<{ dates: string[], opens: number[], highs: number[], lows: number[], closes: number[], volumes: number[] }> {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();

  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    console.error('Alpha Vantage response:', JSON.stringify(data).slice(0, 500));
    throw new Error(`No data for ${symbol}`);
  }

  const entries = Object.entries(timeSeries).sort(([a], [b]) => a.localeCompare(b));
  const dates: string[] = [], opens: number[] = [], highs: number[] = [], lows: number[] = [], closes: number[] = [], volumes: number[] = [];

  for (const [date, vals] of entries) {
    const v = vals as any;
    dates.push(date);
    opens.push(parseFloat(v['1. open']));
    highs.push(parseFloat(v['2. high']));
    lows.push(parseFloat(v['3. low']));
    closes.push(parseFloat(v['4. close']));
    volumes.push(parseFloat(v['5. volume']));
  }

  return { dates, opens, highs, lows, closes, volumes };
}

// ── Strategy Signal Generators ───────────────────────────────────────
function trendFollowSignals(closes: number[], highs: number[], lows: number[], params: any) {
  const fastPeriod = params.fast_ma || 20;
  const slowPeriod = params.slow_ma || 100;
  const atrPeriod = 14;
  const atrAvgPeriod = 50;

  const fastMA = sma(closes, fastPeriod);
  const slowMA = sma(closes, slowPeriod);
  const atrValues = atr(highs, lows, closes, atrPeriod);
  const atrAvg = sma(atrValues.map(v => v ?? 0), atrAvgPeriod);

  const signals: ('buy' | 'sell' | 'hold')[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (!fastMA[i] || !slowMA[i] || !atrValues[i] || !atrAvg[i]) { signals.push('hold'); continue; }
    // Vol filter: skip if ATR > 2x average
    if (atrValues[i]! > 2 * atrAvg[i]!) { signals.push('hold'); continue; }
    
    const prevFast = fastMA[i - 1];
    const prevSlow = slowMA[i - 1];
    if (!prevFast || !prevSlow) { signals.push('hold'); continue; }

    if (prevFast <= prevSlow && fastMA[i]! > slowMA[i]!) signals.push('buy');
    else if (prevFast >= prevSlow && fastMA[i]! < slowMA[i]!) signals.push('sell');
    else signals.push('hold');
  }
  return signals;
}

function meanReversionSignals(closes: number[], params: any) {
  const lookback = params.lookback || 20;
  const zThreshold = params.z_threshold || 2.0;
  const retPeriod = params.return_period || 5;

  // Calculate rolling returns
  const rets: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < retPeriod) { rets.push(0); continue; }
    rets.push((closes[i] - closes[i - retPeriod]) / closes[i - retPeriod]);
  }

  const zScores = zScore(rets, lookback);
  const signals: ('buy' | 'sell' | 'hold')[] = [];

  for (let i = 0; i < closes.length; i++) {
    const z = zScores[i];
    if (z === null) { signals.push('hold'); continue; }
    if (z < -zThreshold) signals.push('buy');
    else if (z > zThreshold) signals.push('sell');
    else signals.push('hold');
  }
  return signals;
}

// ── Backtest Simulation ──────────────────────────────────────────────
function runBacktest(
  dates: string[], closes: number[], signals: ('buy' | 'sell' | 'hold')[],
  config: { slippage: number, transaction_cost: number, starting_capital: number, max_position_pct: number }
) {
  const { slippage, transaction_cost, starting_capital, max_position_pct } = config;
  let cash = starting_capital;
  let position = 0;
  let entryPrice = 0;
  const trades: any[] = [];
  const equityCurve: { date: string, value: number }[] = [];
  let peakEquity = starting_capital;
  const drawdownCurve: { date: string, value: number }[] = [];

  for (let i = 0; i < closes.length; i++) {
    const equity = cash + position * closes[i];
    equityCurve.push({ date: dates[i], value: Math.round(equity * 100) / 100 });
    peakEquity = Math.max(peakEquity, equity);
    const dd = peakEquity > 0 ? ((peakEquity - equity) / peakEquity) * 100 : 0;
    drawdownCurve.push({ date: dates[i], value: Math.round(dd * 100) / 100 });

    const signal = signals[i];
    if (signal === 'buy' && position === 0) {
      const fillPrice = closes[i] * (1 + slippage);
      const maxShares = Math.floor((cash * max_position_pct / 100) / fillPrice);
      if (maxShares > 0) {
        const cost = maxShares * fillPrice * (1 + transaction_cost);
        cash -= cost;
        position = maxShares;
        entryPrice = fillPrice;
      }
    } else if (signal === 'sell' && position > 0) {
      const fillPrice = closes[i] * (1 - slippage);
      const proceeds = position * fillPrice * (1 - transaction_cost);
      const pnl = proceeds - position * entryPrice;
      trades.push({
        symbol: 'N/A',
        entry_date: dates[trades.length > 0 ? i - 1 : 0],
        exit_date: dates[i],
        entry_price: Math.round(entryPrice * 100) / 100,
        exit_price: Math.round(fillPrice * 100) / 100,
        quantity: position,
        pnl: Math.round(pnl * 100) / 100,
        return_pct: Math.round((pnl / (position * entryPrice)) * 10000) / 100,
      });
      cash += proceeds;
      position = 0;
    }
  }

  // Calculate metrics
  const finalEquity = cash + position * (closes[closes.length - 1] || 0);
  const totalReturn = (finalEquity - starting_capital) / starting_capital;
  const tradingDays = closes.length;
  const years = tradingDays / 252;
  const cagr = years > 0 ? (Math.pow(finalEquity / starting_capital, 1 / years) - 1) * 100 : 0;

  const dailyReturns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    dailyReturns.push((equityCurve[i].value - equityCurve[i - 1].value) / equityCurve[i - 1].value);
  }

  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length || 0;
  const stdReturn = Math.sqrt(dailyReturns.reduce((a, b) => a + (b - avgReturn) ** 2, 0) / dailyReturns.length) || 1;
  const sharpe = (avgReturn / stdReturn) * Math.sqrt(252);

  const negReturns = dailyReturns.filter(r => r < 0);
  const downDev = Math.sqrt(negReturns.reduce((a, b) => a + b ** 2, 0) / (negReturns.length || 1));
  const sortino = downDev > 0 ? (avgReturn / downDev) * Math.sqrt(252) : 0;

  const maxDrawdown = Math.max(...drawdownCurve.map(d => d.value));
  const winTrades = trades.filter(t => t.pnl > 0);
  const loseTrades = trades.filter(t => t.pnl <= 0);
  const winRate = trades.length > 0 ? (winTrades.length / trades.length) * 100 : 0;
  const grossProfit = winTrades.reduce((a, t) => a + t.pnl, 0);
  const grossLoss = Math.abs(loseTrades.reduce((a, t) => a + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  return {
    metrics: {
      cagr: Math.round(cagr * 100) / 100,
      sharpe: Math.round(sharpe * 100) / 100,
      sortino: Math.round(sortino * 100) / 100,
      max_drawdown: Math.round(maxDrawdown * 100) / 100,
      win_rate: Math.round(winRate * 100) / 100,
      profit_factor: Math.round(profitFactor * 100) / 100,
      total_trades: trades.length,
      total_return: Math.round(totalReturn * 10000) / 100,
      final_equity: Math.round(finalEquity * 100) / 100,
    },
    equity_curve: equityCurve.filter((_, i) => i % 5 === 0 || i === equityCurve.length - 1), // sample every 5 days
    drawdown_curve: drawdownCurve.filter((_, i) => i % 5 === 0 || i === drawdownCurve.length - 1),
    trades: trades.slice(-100), // last 100 trades
  };
}

// ── Main Handler ─────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const { strategy_id } = body;

    // Fetch strategy
    const { data: strategy, error: stratErr } = await supabase
      .from('quant_strategies').select('*').eq('id', strategy_id).single();
    if (stratErr || !strategy) return new Response(JSON.stringify({ error: 'Strategy not found' }), { status: 404, headers: corsHeaders });

    // Create backtest record
    const runConfig = {
      slippage: body.slippage || 0.0005,
      transaction_cost: body.transaction_cost || 0.001,
      starting_capital: body.starting_capital || 100000,
      date_range: body.date_range || 'full',
    };

    const { data: backtest, error: btErr } = await supabase
      .from('quant_backtests')
      .insert({ strategy_id, user_id: userId, run_config: runConfig, status: 'running', started_at: new Date().toISOString() })
      .select().single();
    if (btErr) throw btErr;

    const alphaKey = Deno.env.get('ALPHA_VANTAGE_API_KEY') || 'demo';
    const universe = strategy.universe as string[];
    const symbol = universe[0] || 'AAPL'; // MVP: single symbol

    // Fetch data
    const ohlcv = await fetchOHLCV(symbol, alphaKey);

    // Generate signals based on strategy type
    let signals: ('buy' | 'sell' | 'hold')[];
    if (strategy.strategy_type === 'mean_reversion') {
      signals = meanReversionSignals(ohlcv.closes, strategy.parameters);
    } else {
      signals = trendFollowSignals(ohlcv.closes, ohlcv.highs, ohlcv.lows, strategy.parameters);
    }

    // Run backtest
    const riskControls = strategy.risk_controls as any;
    const result = runBacktest(ohlcv.dates, ohlcv.closes, signals, {
      slippage: runConfig.slippage,
      transaction_cost: runConfig.transaction_cost,
      starting_capital: runConfig.starting_capital,
      max_position_pct: riskControls?.max_position_pct || 10,
    });

    // Update trades with actual symbol
    result.trades = result.trades.map(t => ({ ...t, symbol }));

    // Update backtest record
    await supabase.from('quant_backtests').update({
      status: 'completed',
      metrics: result.metrics,
      equity_curve: result.equity_curve,
      drawdown_curve: result.drawdown_curve,
      trades: result.trades,
      completed_at: new Date().toISOString(),
    }).eq('id', backtest.id);

    return new Response(JSON.stringify({ backtest_id: backtest.id, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Backtest error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
