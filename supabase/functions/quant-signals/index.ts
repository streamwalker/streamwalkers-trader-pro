import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

async function fetchQuote(symbol: string, apiKey: string) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();
  const quote = data['Global Quote'];
  if (!quote) return null;
  return {
    price: parseFloat(quote['05. price']),
    change_pct: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
    volume: parseInt(quote['06. volume'] || '0'),
  };
}

async function fetchRecentOHLCV(symbol: string, apiKey: string) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();
  const ts = data['Time Series (Daily)'];
  if (!ts) return null;

  const entries = Object.entries(ts).sort(([a], [b]) => a.localeCompare(b));
  const closes: number[] = [], highs: number[] = [], lows: number[] = [];
  for (const [, vals] of entries) {
    const v = vals as any;
    closes.push(parseFloat(v['4. close']));
    highs.push(parseFloat(v['2. high']));
    lows.push(parseFloat(v['3. low']));
  }
  return { closes, highs, lows };
}

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

    const { data: strategy, error: stratErr } = await supabase
      .from('quant_strategies').select('*').eq('id', strategy_id).single();
    if (stratErr || !strategy) return new Response(JSON.stringify({ error: 'Strategy not found' }), { status: 404, headers: corsHeaders });

    const alphaKey = Deno.env.get('ALPHA_VANTAGE_API_KEY') || 'demo';
    const universe = strategy.universe as string[];
    const signals: any[] = [];

    for (const symbol of universe.slice(0, 5)) { // limit to 5 for API rate limits
      try {
        const [quote, ohlcv] = await Promise.all([
          fetchQuote(symbol, alphaKey),
          fetchRecentOHLCV(symbol, alphaKey),
        ]);

        if (!quote || !ohlcv || ohlcv.closes.length < 20) continue;

        const closes = ohlcv.closes;
        const price = quote.price;
        const params = strategy.parameters as any;

        let signalType: 'buy' | 'sell' | 'hold' = 'hold';
        let confidence = 0;
        let reasoning = '';
        let targetPrice = price;
        let stopLoss = price;

        if (strategy.strategy_type === 'trend_follow') {
          const fastMA = sma(closes, params.fast_ma || 20);
          const slowMA = sma(closes, params.slow_ma || 100);
          const atrValues = atr(ohlcv.highs, ohlcv.lows, closes, 14);
          const lastFast = fastMA[fastMA.length - 1];
          const lastSlow = slowMA[slowMA.length - 1];
          const prevFast = fastMA[fastMA.length - 2];
          const prevSlow = slowMA[slowMA.length - 2];
          const lastATR = atrValues[atrValues.length - 1] || 0;

          if (lastFast && lastSlow && prevFast && prevSlow) {
            if (prevFast <= prevSlow && lastFast > lastSlow) {
              signalType = 'buy';
              confidence = Math.min(90, 50 + Math.abs(lastFast - lastSlow) / price * 1000);
              reasoning = `SMA ${params.fast_ma || 20} crossed above SMA ${params.slow_ma || 100}. Bullish trend signal.`;
              targetPrice = price * 1.05;
              stopLoss = price - 2 * lastATR;
            } else if (prevFast >= prevSlow && lastFast < lastSlow) {
              signalType = 'sell';
              confidence = Math.min(90, 50 + Math.abs(lastFast - lastSlow) / price * 1000);
              reasoning = `SMA ${params.fast_ma || 20} crossed below SMA ${params.slow_ma || 100}. Bearish trend signal.`;
              targetPrice = price * 0.95;
              stopLoss = price + 2 * lastATR;
            }
          }
        } else if (strategy.strategy_type === 'mean_reversion') {
          const retPeriod = params.return_period || 5;
          const lookback = params.lookback || 20;
          const zThreshold = params.z_threshold || 2.0;

          if (closes.length >= retPeriod + lookback) {
            const rets: number[] = [];
            for (let i = retPeriod; i < closes.length; i++) {
              rets.push((closes[i] - closes[i - retPeriod]) / closes[i - retPeriod]);
            }
            const slice = rets.slice(-lookback);
            const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
            const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length);
            const z = std > 0 ? (rets[rets.length - 1] - mean) / std : 0;

            if (z < -zThreshold) {
              signalType = 'buy';
              confidence = Math.min(95, 50 + Math.abs(z) * 15);
              reasoning = `Z-score ${z.toFixed(2)} below -${zThreshold}. Oversold mean reversion opportunity.`;
              targetPrice = price * (1 + Math.abs(mean));
              stopLoss = price * 0.97;
            } else if (z > zThreshold) {
              signalType = 'sell';
              confidence = Math.min(95, 50 + Math.abs(z) * 15);
              reasoning = `Z-score ${z.toFixed(2)} above +${zThreshold}. Overbought mean reversion signal.`;
              targetPrice = price * (1 - Math.abs(mean));
              stopLoss = price * 1.03;
            }
          }
        }

        const riskReward = stopLoss !== price && targetPrice !== price
          ? Math.abs(targetPrice - price) / Math.abs(price - stopLoss)
          : 0;

        const signalRecord = {
          strategy_id,
          user_id: userId,
          symbol,
          signal_type: signalType,
          confidence: Math.round(confidence * 100) / 100,
          entry_price: Math.round(price * 100) / 100,
          target_price: Math.round(targetPrice * 100) / 100,
          stop_loss: Math.round(stopLoss * 100) / 100,
          risk_reward: Math.round(riskReward * 100) / 100,
          reasoning,
          status: 'active',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        const { error: insertErr } = await supabase.from('quant_signals').insert(signalRecord);
        if (insertErr) console.error(`Signal insert error for ${symbol}:`, insertErr);
        signals.push(signalRecord);

        // Rate limit: wait 1s between symbols (Alpha Vantage free tier)
        await new Promise(r => setTimeout(r, 1200));
      } catch (err) {
        console.error(`Error processing ${symbol}:`, err);
      }
    }

    return new Response(JSON.stringify({ signals, count: signals.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Signal generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
