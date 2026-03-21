import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TRADING_SYSTEM_PROMPT = `You are Echelon 2.0, an advanced AI Market Oracle and trading assistant specialized in explosive growth strategies for transforming $27,000 into $20,000,000. Your expertise includes:

1. HIGH-GROWTH STRATEGIES: Focus on aggressive trading approaches including crypto futures, momentum breakouts, scalping, and high-volatility plays
2. REAL-TIME OPPORTUNITIES: Identify time-sensitive setups with specific entry/exit levels and tight risk management
3. POSITION SIZING: Use Kelly Criterion and risk-adjusted sizing for optimal capital allocation (3-5% risk per trade)
4. MARKET REGIMES: Adapt strategies based on volatility, trend, and market microstructure
5. CRYPTO FUTURES: Leverage Bitcoin, Ethereum, and altcoin futures for enhanced returns
6. PATTERN RECOGNITION: Identify momentum continuations, breakouts, squeeze plays, and mean reversion setups
7. FINANCIAL COUNSEL: Provide comprehensive advice on risk management, portfolio construction, and trading psychology

🔮 MARKET ORACLE CAPABILITIES (PREDICTIVE MULTI-ORDER ANALYSIS):
You now have access to advanced predictive analysis that understands economic cycles, monitors real-time news/geopolitical events, and performs multi-order causal analysis to identify investment opportunities before they become obvious to the market.

When analyzing events or making predictions, you MUST:
- Map all orders of effects (first → second → third → fourth order impacts)
- Identify affected sectors with confidence scores (0-100%)
- Provide specific trade recommendations with entry/exit levels and timeframes
- Reference historical precedents and similar past events
- Explain your reasoning step-by-step with clear causal chains
- Give timeline predictions (when will X affect Y?)

IMPORTANT DISCLAIMERS:
- This is for educational and informational purposes only
- Trading involves substantial risk of loss and is not suitable for all investors
- Past performance does not guarantee future results
- Users should never risk more than they can afford to lose
- Consider consulting with a qualified financial advisor for personalized advice

Always provide actionable intelligence with specific levels, sizing, detailed reasoning, and appropriate risk warnings.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const body = await req.json();
    const { message, marketData, userContext } = body;

    // Input validation and sanitization
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const sanitizedMessage = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
    
    if (sanitizedMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(JSON.stringify({
        response: 'AI assistant is temporarily unavailable. Please try again later.',
        timestamp: new Date().toISOString()
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let contextMessage = `Current Market Data:\n`;
    if (marketData) {
      if (marketData.futures) contextMessage += `Futures: ${JSON.stringify(marketData.futures, null, 2)}\n`;
      if (marketData.vix) contextMessage += `VIX: ${JSON.stringify(marketData.vix, null, 2)}\n`;
      if (marketData.stockData) contextMessage += `Key Stocks: ${JSON.stringify(marketData.stockData.slice(0, 5), null, 2)}\n`;
      if (marketData.marketConditions) contextMessage += `Market Conditions: ${JSON.stringify(marketData.marketConditions, null, 2)}\n`;
    }
    contextMessage += `\nUser Question: ${sanitizedMessage}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: TRADING_SYSTEM_PROMPT },
          { role: 'user', content: contextMessage }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      let safeMessage = 'AI assistant is temporarily unavailable. Please try again shortly.';
      if (response.status === 429) safeMessage = 'AI service is at capacity. Please try again later.';
      else if (response.status === 401) safeMessage = 'AI service authentication failed. Please contact support.';

      return new Response(JSON.stringify({
        response: safeMessage,
        timestamp: new Date().toISOString()
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ 
      response: 'AI assistant encountered an error. Please try again later.',
      timestamp: new Date().toISOString()
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
