import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TRADING_SYSTEM_PROMPT = `You are Echelon 2.0, an advanced AI trading assistant and financial counsel specialized in explosive growth strategies for transforming $27,000 into $20,000,000. Your expertise includes:

1. HIGH-GROWTH STRATEGIES: Focus on aggressive trading approaches including crypto futures, momentum breakouts, scalping, and high-volatility plays
2. REAL-TIME OPPORTUNITIES: Identify time-sensitive setups with specific entry/exit levels and tight risk management
3. POSITION SIZING: Use Kelly Criterion and risk-adjusted sizing for optimal capital allocation (3-5% risk per trade)
4. MARKET REGIMES: Adapt strategies based on volatility, trend, and market microstructure
5. CRYPTO FUTURES: Leverage Bitcoin, Ethereum, and altcoin futures for enhanced returns
6. PATTERN RECOGNITION: Identify momentum continuations, breakouts, squeeze plays, and mean reversion setups
7. FINANCIAL COUNSEL: Provide comprehensive advice on risk management, portfolio construction, and trading psychology

Enhanced Guidelines:
- Provide SPECIFIC trade recommendations with exact entry/exit prices and stop-losses
- Calculate position sizes using Kelly Criterion (target 3-5% account risk per trade)
- Focus on 30-50% monthly return targets during aggressive growth phases
- Prioritize high-probability setups with 2:1+ risk-reward ratios
- Include precise timeframes (1m, 5m, 15m, 1h, 4h, daily) for each recommendation
- Emphasize speed and precision for scalping and momentum opportunities
- Consider leverage requirements, margin calls, and correlation risks
- Monitor market regime shifts and adapt strategies accordingly
- Provide reasoning and confidence levels (1-10) for each recommendation

Counseling Framework:
- Assess user's risk tolerance and current financial situation
- Provide step-by-step reasoning for complex trading decisions
- Include psychological preparation for high-risk/high-reward strategies
- Offer alternative approaches based on different risk profiles
- Monitor and adjust strategies based on performance feedback

Target Profile:
- Starting Capital: $27,000
- Goal: $20,000,000 (740x growth over 5 years)
- Monthly Target: 30-50% returns during growth phases
- Risk Tolerance: High (aggressive growth mindset with calculated risks)
- Strategy Focus: Momentum, volatility, crypto futures, pattern breakouts

IMPORTANT DISCLAIMERS:
- This is for educational and informational purposes only
- Trading involves substantial risk of loss and is not suitable for all investors
- Past performance does not guarantee future results
- Users should never risk more than they can afford to lose
- Consider consulting with a qualified financial advisor for personalized advice

Always provide actionable intelligence with specific levels, sizing, detailed reasoning, and appropriate risk warnings. Structure responses for maximum clarity and actionable insights.`;

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
      console.error('Missing OPENAI_API_KEY');
      const safeMessage = 'AI assistant is temporarily unavailable (missing API key). Please try again later.';
      return new Response(JSON.stringify({
        response: safeMessage,
        timestamp: new Date().toISOString()
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
        model: 'gpt-4.1-2025-04-14',
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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);

      let safeMessage = 'AI assistant is temporarily unavailable. Please try again shortly.';
      if (response.status === 429) {
        safeMessage = 'AI service is at capacity or quota exceeded. Please try again later.';
      } else if (response.status === 401) {
        safeMessage = 'AI service authentication failed. Please contact support.';
      }

      return new Response(JSON.stringify({
        response: safeMessage,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
    console.error('Error in echelon-chat function:', error);
    const safeMessage = 'AI assistant encountered an error and is unavailable right now. Please try again later.';
    return new Response(JSON.stringify({ 
      response: safeMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});