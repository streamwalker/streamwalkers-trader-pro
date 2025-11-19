import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  symbols?: string[];
  forceRefresh?: boolean;
  automated?: boolean;
}

interface PriceData {
  date: string;
  close: number;
  volume: number;
  high: number;
  low: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { symbols, forceRefresh, automated } = await req.json() as AnalysisRequest;
    
    // Default to portfolio stocks if not specified
    const symbolsToAnalyze = symbols || ['PLTR', 'QTUM', 'QBTS', 'MNTN', 'RGTI', 'QUBT', 'NFLX'];
    
    const results = [];
    
    for (const symbol of symbolsToAnalyze) {
      try {
        console.log(`Analyzing ${symbol}...`);
        const analysis = await analyzeDipQuality(symbol, supabaseClient);
        results.push(analysis);
        
        // Store result in database
        const { error: insertError } = await supabaseClient
          .from('dip_analysis_results')
          .upsert(analysis, { onConflict: 'symbol,analysis_date' });
        
        if (insertError) {
          console.error(`Error storing analysis for ${symbol}:`, insertError);
        }
        
        // Store in history
        await supabaseClient.from('dip_analysis_history').insert({
          symbol: analysis.symbol,
          analysis_date: analysis.analysis_date,
          dip_quality_score: analysis.dip_quality_score,
          recommendation: analysis.recommendation,
          price: analysis.current_price
        });
        
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
        results.push({
          symbol,
          error: error.message,
          dip_quality_score: 0,
          recommendation: 'wait'
        });
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        analyzed_count: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-dip-quality:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function analyzeDipQuality(symbol: string, supabaseClient: any) {
  const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
  const finnhubKey = Deno.env.get('FINNHUB_API_KEY');
  
  // Fetch historical price data (200 days for SMA calculations)
  const priceHistory = await fetchPriceHistory(symbol, alphaVantageKey);
  
  // Fetch current quote
  const currentQuote = await fetchCurrentQuote(symbol, finnhubKey);
  
  // Fetch recent news for sentiment
  const newsData = await fetchNews(symbol, supabaseClient);
  
  // Fetch insider sentiment
  const insiderData = await fetchInsiderSentiment(symbol, finnhubKey);
  
  // Calculate 7-point analysis
  const trendAnalysis = analyzeTrend(priceHistory, currentQuote);
  const volumeAnalysis = analyzeVolume(priceHistory);
  const catalystAnalysis = analyzeCatalyst(newsData);
  const rsiAnalysis = analyzeRSI(priceHistory, trendAnalysis.direction);
  const supportAnalysis = analyzeSupport(priceHistory, currentQuote.price);
  const insiderAnalysis = analyzeInsider(insiderData);
  const optionsAnalysis = analyzeOptions(currentQuote); // Simplified without premium data
  
  // Calculate total score
  const totalScore = 
    trendAnalysis.score +
    volumeAnalysis.score +
    catalystAnalysis.score +
    rsiAnalysis.score +
    supportAnalysis.score +
    insiderAnalysis.score +
    optionsAnalysis.score;
  
  // Apply special rules
  let adjustedScore = totalScore;
  if (catalystAnalysis.score === 0.0) adjustedScore = Math.min(adjustedScore, 4.0);
  if (trendAnalysis.score < 0.5) adjustedScore = Math.min(adjustedScore, 3.0);
  if (volumeAnalysis.score === 0.0) adjustedScore = Math.min(adjustedScore, 3.0);
  if (insiderAnalysis.score === 0.0) adjustedScore -= 1.5;
  
  adjustedScore = Math.max(0, Math.min(10, adjustedScore));
  
  // Generate recommendation
  const { recommendation, dipType, confidence } = generateRecommendation(
    adjustedScore,
    {
      trend: trendAnalysis.score,
      volume: volumeAnalysis.score,
      catalyst: catalystAnalysis.score,
      rsi: rsiAnalysis.score,
      support: supportAnalysis.score,
      insider: insiderAnalysis.score,
      options: optionsAnalysis.score
    }
  );
  
  // Generate summary
  const summary = generateSummary(adjustedScore, recommendation, {
    trendAnalysis,
    volumeAnalysis,
    catalystAnalysis,
    supportAnalysis
  });
  
  return {
    symbol,
    analysis_date: new Date().toISOString().split('T')[0],
    dip_quality_score: Number(adjustedScore.toFixed(1)),
    dip_type: dipType,
    recommendation,
    confidence_level: confidence,
    
    trend_score: Number(trendAnalysis.score.toFixed(1)),
    volume_score: Number(volumeAnalysis.score.toFixed(1)),
    catalyst_score: Number(catalystAnalysis.score.toFixed(1)),
    rsi_score: Number(rsiAnalysis.score.toFixed(1)),
    support_score: Number(supportAnalysis.score.toFixed(1)),
    insider_score: Number(insiderAnalysis.score.toFixed(1)),
    options_flow_score: Number(optionsAnalysis.score.toFixed(1)),
    
    trend_data: trendAnalysis.data,
    volume_data: volumeAnalysis.data,
    catalyst_data: catalystAnalysis.data,
    technical_data: { rsi: rsiAnalysis.data },
    insider_data: insiderData,
    options_data: optionsAnalysis.data,
    
    current_price: currentQuote.price,
    price_change_percent: currentQuote.changePercent,
    volume: currentQuote.volume,
    market_cap: currentQuote.marketCap,
    sector: currentQuote.sector || 'Technology',
    
    analysis_summary: summary,
    key_risks: identifyRisks({ trendAnalysis, volumeAnalysis, catalystAnalysis }),
    key_opportunities: identifyOpportunities({ trendAnalysis, supportAnalysis, insiderAnalysis }),
  };
}

async function fetchPriceHistory(symbol: string, apiKey: string): Promise<PriceData[]> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`
    );
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      return Object.entries(timeSeries)
        .slice(0, 200)
        .map(([date, values]: [string, any]) => ({
          date,
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
        }))
        .reverse();
    }
    
    throw new Error('No price data available');
  } catch (error) {
    console.error(`Error fetching price history for ${symbol}:`, error);
    return [];
  }
}

async function fetchCurrentQuote(symbol: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const data = await response.json();
    
    return {
      price: data.c,
      changePercent: data.dp,
      volume: data.v,
      marketCap: 0,
      sector: null
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return { price: 0, changePercent: 0, volume: 0, marketCap: 0, sector: null };
  }
}

async function fetchNews(symbol: string, supabaseClient: any) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabaseClient
    .from('economic_news')
    .select('*')
    .contains('symbols', [symbol])
    .gte('published_at', sevenDaysAgo)
    .order('published_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }
  
  return data || [];
}

async function fetchInsiderSentiment(symbol: string, apiKey: string) {
  try {
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=${fromDate}&token=${apiKey}`
    );
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const recent = data.data[0];
      return {
        mspr: recent.mspr || 0,
        change: recent.change || 0,
        net_buys: (recent.change || 0) > 0 ? 1 : 0,
        net_sells: (recent.change || 0) < 0 ? 1 : 0
      };
    }
    
    return { mspr: 0, change: 0, net_buys: 0, net_sells: 0 };
  } catch (error) {
    console.error(`Error fetching insider sentiment for ${symbol}:`, error);
    return { mspr: 0, change: 0, net_buys: 0, net_sells: 0 };
  }
}

function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const slice = prices.slice(-period);
  return slice.reduce((sum, p) => sum + p, 0) / period;
}

function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function analyzeTrend(priceHistory: PriceData[], currentQuote: any) {
  if (priceHistory.length < 200) {
    return { score: 0.5, direction: 'neutral', data: {} };
  }
  
  const closes = priceHistory.map(d => d.close);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma100 = calculateSMA(closes, 100);
  const sma200 = calculateSMA(closes, 200);
  
  const currentPrice = currentQuote.price;
  
  // Check bullish stacking
  const bullishStack = sma20 > sma50 && sma50 > sma100 && sma100 > sma200;
  
  // Check if bouncing at support
  const nearSMA20 = Math.abs(currentPrice - sma20) / sma20 < 0.03;
  const nearSMA50 = Math.abs(currentPrice - sma50) / sma50 < 0.03;
  
  // Check for higher highs and lows (last 20 days)
  const recentPrices = closes.slice(-20);
  const maxRecent = Math.max(...recentPrices);
  const minRecent = Math.min(...recentPrices);
  const prevMaxRecent = Math.max(...closes.slice(-40, -20));
  const prevMinRecent = Math.min(...closes.slice(-40, -20));
  const higherHighs = maxRecent > prevMaxRecent;
  const higherLows = minRecent > prevMinRecent;
  
  let score = 0;
  let direction = 'neutral';
  
  if (bullishStack && (nearSMA20 || nearSMA50) && higherHighs && higherLows) {
    score = 2.0;
    direction = 'bull';
  } else if (bullishStack && higherHighs) {
    score = 1.5;
    direction = 'bull';
  } else if (currentPrice > sma50 && currentPrice > sma100) {
    score = 1.0;
    direction = 'neutral';
  } else if (currentPrice < sma50 && currentPrice < sma100) {
    score = 0.5;
    direction = 'bear';
  } else if (currentPrice < sma200) {
    score = 0.0;
    direction = 'bear';
  }
  
  return {
    score,
    direction,
    data: {
      sma20: Number(sma20.toFixed(2)),
      sma50: Number(sma50.toFixed(2)),
      sma100: Number(sma100.toFixed(2)),
      sma200: Number(sma200.toFixed(2)),
      bullish_stack: bullishStack,
      higher_highs: higherHighs,
      higher_lows: higherLows,
      near_support: nearSMA20 || nearSMA50
    }
  };
}

function analyzeVolume(priceHistory: PriceData[]) {
  if (priceHistory.length < 20) {
    return { score: 0.5, data: {} };
  }
  
  const recentDays = priceHistory.slice(-10);
  const avgVolume = priceHistory.slice(-30).reduce((sum, d) => sum + d.volume, 0) / 30;
  
  // Check volume on red days
  const redDays = recentDays.filter((d, i) => {
    if (i === 0) return false;
    return d.close < recentDays[i - 1].close;
  });
  
  if (redDays.length === 0) {
    return { score: 1.5, data: { avg_volume: avgVolume, red_day_ratio: 1.0 } };
  }
  
  const avgRedDayVolume = redDays.reduce((sum, d) => sum + d.volume, 0) / redDays.length;
  const redDayRatio = avgRedDayVolume / avgVolume;
  
  let score = 0;
  if (redDayRatio < 0.5) score = 2.0;
  else if (redDayRatio < 0.8) score = 1.5;
  else if (redDayRatio < 1.2) score = 1.0;
  else if (redDayRatio < 2.0) score = 0.5;
  else score = 0.0;
  
  return {
    score,
    data: {
      avg_volume: Math.round(avgVolume),
      red_day_volume: Math.round(avgRedDayVolume),
      red_day_ratio: Number(redDayRatio.toFixed(2)),
      panic_level: redDayRatio > 2.0 ? 'high' : redDayRatio > 1.2 ? 'moderate' : 'low'
    }
  };
}

function analyzeCatalyst(newsData: any[]) {
  const negativeKeywords = [
    'guidance cut', 'revenue miss', 'lawsuit', 'sec inquiry', 'sec investigation',
    'accounting irregularities', 'accounting scandal', 'debt refinancing', 'debt crisis',
    'bankruptcy', 'executive departure', 'customer loss', 'investigation',
    'downgrade', 'warning', 'miss earnings', 'disappointing'
  ];
  
  let negativeCount = 0;
  const negativeArticles: string[] = [];
  
  for (const article of newsData) {
    const text = `${article.title} ${article.summary || ''}`.toLowerCase();
    for (const keyword of negativeKeywords) {
      if (text.includes(keyword)) {
        negativeCount++;
        negativeArticles.push(article.title);
        break;
      }
    }
  }
  
  let score = 0;
  if (negativeCount === 0) score = 2.0;
  else if (negativeCount === 1) score = 1.5;
  else if (negativeCount === 2) score = 1.0;
  else if (negativeCount <= 4) score = 0.5;
  else score = 0.0;
  
  return {
    score,
    data: {
      negative_news_count: negativeCount,
      total_articles: newsData.length,
      negative_articles: negativeArticles.slice(0, 3),
      has_major_issue: negativeCount >= 3
    }
  };
}

function analyzeRSI(priceHistory: PriceData[], trendDirection: string) {
  if (priceHistory.length < 30) {
    return { score: 0.5, data: { rsi: 50 } };
  }
  
  const closes = priceHistory.map(d => d.close);
  const rsi = calculateRSI(closes);
  
  let score = 0;
  if (trendDirection === 'bull' && rsi < 30) score = 1.0;
  else if (trendDirection === 'bull' && rsi < 40) score = 0.7;
  else if (rsi >= 40 && rsi <= 60) score = 0.5;
  else if (trendDirection === 'bear' && rsi < 40) score = 0.3;
  else if (trendDirection === 'bear' && rsi < 30) score = 0.0;
  else score = 0.5;
  
  return {
    score,
    data: { rsi: Number(rsi.toFixed(2)) }
  };
}

function analyzeSupport(priceHistory: PriceData[], currentPrice: number) {
  if (priceHistory.length < 50) {
    return { score: 0.5, data: {} };
  }
  
  const closes = priceHistory.map(d => d.close);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  
  const distToSMA20 = Math.abs(currentPrice - sma20) / sma20;
  const distToSMA50 = Math.abs(currentPrice - sma50) / sma50;
  
  let score = 0;
  if (distToSMA20 < 0.02 || distToSMA50 < 0.03) score = 1.0;
  else if (distToSMA20 < 0.05 || distToSMA50 < 0.05) score = 0.7;
  else if (currentPrice > sma20 && currentPrice > sma50) score = 0.5;
  else if (currentPrice < sma50) score = 0.3;
  else score = 0.0;
  
  return {
    score,
    data: {
      sma20_distance: Number((distToSMA20 * 100).toFixed(2)),
      sma50_distance: Number((distToSMA50 * 100).toFixed(2)),
      near_support: distToSMA20 < 0.03 || distToSMA50 < 0.03
    }
  };
}

function analyzeInsider(insiderData: any) {
  const { change, mspr, net_buys, net_sells } = insiderData;
  
  let score = 0.5;
  if (net_buys > 0 && change > 500) score = 1.0;
  else if (net_buys > 0 || change > 0) score = 0.7;
  else if (change === 0) score = 0.5;
  else if (net_sells > 0 && change < -500) score = 0.0;
  else if (net_sells > 0) score = 0.3;
  
  return {
    score,
    data: insiderData
  };
}

function analyzeOptions(currentQuote: any) {
  // Simplified without premium options data
  // Use price momentum as proxy
  const changePercent = currentQuote.changePercent || 0;
  
  let score = 0.5;
  if (changePercent < -5) score = 0.7; // Large dip might attract call buyers
  else if (changePercent < -2) score = 0.6;
  else score = 0.5;
  
  return {
    score,
    data: {
      note: 'Limited options data - using price momentum as proxy',
      change_percent: changePercent
    }
  };
}

function generateRecommendation(score: number, breakdown: any) {
  let recommendation = 'wait';
  let dipType = 'neutral';
  let confidence = 50;
  
  if (score >= 8.0) {
    recommendation = 'buy_dip';
    dipType = 'type_a_buyable';
    confidence = 90;
  } else if (score >= 6.0) {
    recommendation = 'buy_dip';
    dipType = 'type_a_buyable';
    confidence = 75;
  } else if (score >= 4.0) {
    recommendation = 'wait';
    dipType = 'neutral';
    confidence = 60;
  } else {
    recommendation = 'sell_avoid';
    dipType = 'type_b_trouble';
    confidence = 80;
  }
  
  return { recommendation, dipType, confidence };
}

function generateSummary(score: number, recommendation: string, analyses: any) {
  const { trendAnalysis, volumeAnalysis, catalystAnalysis, supportAnalysis } = analyses;
  
  if (score >= 8.0) {
    return `Excellent buying opportunity. Strong ${trendAnalysis.direction} trend with ${volumeAnalysis.data.panic_level} panic selling. ${catalystAnalysis.data.negative_news_count === 0 ? 'No negative catalysts.' : ''} Price bouncing at key support levels.`;
  } else if (score >= 6.0) {
    return `Good dip to consider. ${trendAnalysis.direction} trend intact with manageable volume. Some caution warranted but overall healthy pullback.`;
  } else if (score >= 4.0) {
    return `Mixed signals. Wait for clearer trend confirmation before entering. Monitor volume and news closely.`;
  } else {
    return `Avoid this dip. Significant technical damage with ${volumeAnalysis.data.panic_level} panic selling. ${catalystAnalysis.data.has_major_issue ? 'Major negative catalysts present.' : ''} Wait for stabilization.`;
  }
}

function identifyRisks(analyses: any): string[] {
  const risks: string[] = [];
  const { trendAnalysis, volumeAnalysis, catalystAnalysis } = analyses;
  
  if (trendAnalysis.score < 1.0) risks.push('Broken support levels indicate weakening trend');
  if (volumeAnalysis.data.panic_level === 'high') risks.push('Panic selling detected with elevated volume');
  if (catalystAnalysis.data.has_major_issue) risks.push('Multiple negative news catalysts present');
  if (trendAnalysis.direction === 'bear') risks.push('Overall bearish trend structure');
  
  return risks;
}

function identifyOpportunities(analyses: any): string[] {
  const opportunities: string[] = [];
  const { trendAnalysis, supportAnalysis, insiderAnalysis } = analyses;
  
  if (trendAnalysis.score >= 1.5) opportunities.push('Strong bull trend with higher highs and lows');
  if (supportAnalysis.data.near_support) opportunities.push('Price bouncing at key support level');
  if (trendAnalysis.data.bullish_stack) opportunities.push('Bullish moving average alignment');
  if (insiderAnalysis.score >= 0.7) opportunities.push('Insider buying activity detected');
  
  return opportunities;
}
