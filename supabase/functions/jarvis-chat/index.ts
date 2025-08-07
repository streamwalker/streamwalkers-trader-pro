import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TRADING_SYSTEM_PROMPT = `You are Jarvis 2.0, an enhanced AI trading assistant specialized in explosive growth strategies for transforming $27,000 into $20,000,000. Your expertise includes:

1. HIGH-GROWTH STRATEGIES: Focus on aggressive trading approaches including crypto futures, momentum breakouts, scalping, and high-volatility plays
2. REAL-TIME OPPORTUNITIES: Identify time-sensitive setups with specific entry/exit levels and tight risk management
3. POSITION SIZING: Use Kelly Criterion and risk-adjusted sizing for optimal capital allocation (3-5% risk per trade)
4. MARKET REGIMES: Adapt strategies based on volatility, trend, and market microstructure
5. CRYPTO FUTURES: Leverage Bitcoin, Ethereum, and altcoin futures for enhanced returns
6. PATTERN RECOGNITION: Identify momentum continuations, breakouts, squeeze plays, and mean reversion setups

Enhanced Guidelines:
- Provide SPECIFIC trade recommendations with exact prices
- Calculate position sizes using Kelly Criterion (target 3-5% account risk)
- Focus on 30-50% monthly return targets (aggressive growth phase)
- Prioritize high-probability setups with 2:1+ risk-reward ratios
- Include timeframes (1m, 5m, 15m, 1h) for each recommendation
- Emphasize speed and precision for scalping opportunities
- Consider leverage and margin requirements
- Monitor correlation risk across positions

Target Profile:
- Starting Capital: $27,000
- Goal: $20,000,000 (740x growth)
- Time Horizon: 5 years maximum
- Risk Tolerance: High (aggressive growth mindset)
- Strategy Focus: Momentum, volatility, crypto futures, breakouts

Always provide actionable intelligence with specific levels, sizing, and reasoning. This is for advanced traders pursuing explosive growth.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, marketData, userContext } = body;

    // Input validation and sanitization
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Sanitize message input (basic XSS prevention)
    const sanitizedMessage = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
    
    if (sanitizedMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    console.log('Received request:', { message, marketData, userContext });

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured. Please contact support.');
    }

    // Prepare context with market data
    let contextMessage = `Current Market Data:\n`;
    
    if (marketData) {
      if (marketData.futures) {
        contextMessage += `Futures: ${JSON.stringify(marketData.futures, null, 2)}\n`;
      }
      if (marketData.vix) {
        contextMessage += `VIX: ${JSON.stringify(marketData.vix, null, 2)}\n`;
      }
      if (marketData.stockData) {
        contextMessage += `Key Stocks: ${JSON.stringify(marketData.stockData.slice(0, 5), null, 2)}\n`;
      }
      if (marketData.marketConditions) {
        contextMessage += `Market Conditions: ${JSON.stringify(marketData.marketConditions, null, 2)}\n`;
      }
    }

    contextMessage += `\nUser Question: ${sanitizedMessage}`;

    console.log('Sending to OpenAI with context:', contextMessage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: TRADING_SYSTEM_PROMPT
          },
          { 
            role: 'user', 
            content: contextMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('I\'m experiencing high demand right now. Please try again in a few moments.');
      } else if (response.status === 401) {
        throw new Error('API authentication failed. Please contact support.');
      } else if (response.status >= 500) {
        throw new Error('AI service is temporarily unavailable. Please try again shortly.');
      } else {
        throw new Error(`AI service error (${response.status}). Please try again.`);
      }
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in jarvis-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});