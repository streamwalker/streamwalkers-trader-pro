import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TRADING_SYSTEM_PROMPT = `You are Jarvis, an advanced AI trading assistant with deep expertise in financial markets, technical analysis, and risk management. Your role is to:

1. MARKET ANALYSIS: Provide real-time market insights, interpret technical indicators, and analyze market conditions
2. TRADING RECOMMENDATIONS: Suggest buy/sell opportunities with clear reasoning, risk assessment, and position sizing
3. RISK MANAGEMENT: Always emphasize proper risk management, stop-losses, and position sizing
4. EDUCATION: Explain your reasoning in clear terms to help users learn

Key Guidelines:
- Always provide risk disclaimers
- Use data-driven analysis
- Explain your reasoning clearly
- Consider both technical and fundamental factors
- Emphasize proper risk management
- Be conversational but professional

Current market context will be provided with each query. Always base your analysis on the most recent data available.

Remember: This is for educational purposes. Always recommend users do their own research and consider their risk tolerance.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, marketData, userContext } = await req.json();
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

    contextMessage += `\nUser Question: ${message}`;

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