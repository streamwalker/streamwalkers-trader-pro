import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json();
    
    console.log('Calculating causal chains for event:', eventId);
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the event details
    const { data: event, error: eventError } = await supabase
      .from('economic_events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError || !event) {
      throw new Error('Event not found');
    }
    
    // Get historical sector impacts for similar events
    const { data: historicalImpacts } = await supabase
      .from('sector_impacts')
      .select('*')
      .eq('event_type', event.event_type)
      .order('confidence', { ascending: false });
    
    // Calculate multi-order causal chains using AI
    const causalAnalysis = await analyzeCausalChains(
      event,
      historicalImpacts || [],
      lovableApiKey
    );
    
    console.log('Causal analysis result:', JSON.stringify(causalAnalysis, null, 2));
    
    // Update event with impact timeline
    const { error: updateError } = await supabase
      .from('economic_events')
      .update({
        impact_timeline: causalAnalysis.impact_timeline,
        affected_sectors: causalAnalysis.all_affected_sectors
      })
      .eq('id', eventId);
    
    if (updateError) {
      console.error('Error updating event:', updateError);
    }
    
    // Store or update sector impacts
    for (const impact of causalAnalysis.sector_impacts) {
      await supabase
        .from('sector_impacts')
        .upsert({
          event_type: event.event_type,
          sector: impact.sector,
          impact_order: impact.order,
          impact_direction: impact.direction,
          typical_delay_days: impact.delay_days,
          confidence: impact.confidence,
          historical_examples: impact.examples || []
        }, {
          onConflict: 'event_type,sector,impact_order'
        });
    }
    
    // Create prediction with trade recommendations
    const { data: prediction, error: predError } = await supabase
      .from('predictions')
      .insert({
        event_id: eventId,
        predicted_impact: causalAnalysis.predicted_impact,
        trade_recommendations: causalAnalysis.trade_recommendations
      })
      .select()
      .single();
    
    if (predError) {
      console.error('Error creating prediction:', predError);
    }
    
    return new Response(
      JSON.stringify({
        causal_chains: causalAnalysis,
        prediction,
        updated_event: event
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error calculating causal chains:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

async function analyzeCausalChains(
  event: any,
  historicalImpacts: any[],
  apiKey: string
) {
  const systemPrompt = `You are an expert in economic causal analysis and multi-order effect prediction. 

Your task is to analyze an economic event and map out ALL orders of causal effects:

**1st Order (Immediate - Day 0-3)**: Direct, immediate impacts
**2nd Order (Indirect - 1-2 weeks)**: Secondary effects from first-order impacts
**3rd Order (Ripple - 2-4 weeks)**: Cascading effects through interconnected systems
**4th Order (Systemic - 1-3 months)**: Long-term structural changes to the economy

For EACH order, identify:
- Specific effects (be concrete and measurable)
- Timeline (when will this manifest?)
- Affected sectors (which industries/companies?)
- Mechanism (HOW does order N cause order N+1?)
- Confidence (0-1 scale)

Also provide:
- Trade recommendations with specific symbols, entry/exit, confidence
- Overall predicted impact (short/medium/long term)
- Risk factors and uncertainties

Return JSON in this format:
{
  "impact_timeline": {
    "first_order": {
      "timeline": "immediate (0-3 days)",
      "effects": ["Specific effect 1", "Specific effect 2"],
      "sectors": ["Sector A", "Sector B"],
      "mechanism": "How this happens",
      "confidence": 0.9
    },
    "second_order": {
      "timeline": "1-2 weeks",
      "effects": ["Effect 1 from first order", "Effect 2"],
      "sectors": ["Sector C", "Sector D"],
      "mechanism": "First order causes this via...",
      "confidence": 0.75
    },
    "third_order": {...},
    "fourth_order": {...}
  },
  "sector_impacts": [
    {
      "sector": "Airlines",
      "order": 3,
      "direction": "negative",
      "delay_days": 21,
      "confidence": 0.82,
      "reasoning": "Why this sector at this order",
      "examples": ["Historical example 1"]
    }
  ],
  "all_affected_sectors": ["All sectors across all orders"],
  "trade_recommendations": [
    {
      "action": "SHORT",
      "symbols": ["DAL", "UAL", "AAL"],
      "sector": "Airlines",
      "reasoning": "Detailed reasoning with causal chain",
      "confidence": 0.82,
      "entry": "Current market price",
      "target": "-8% from entry",
      "stop_loss": "+3% from entry",
      "timeframe": "2-4 weeks",
      "position_size": "3-5% of portfolio"
    }
  ],
  "predicted_impact": {
    "short_term": "1-7 days forecast",
    "medium_term": "1-4 weeks forecast", 
    "long_term": "1-3 months forecast"
  },
  "risk_factors": ["Risk 1", "Risk 2"]
}

Use historical patterns to inform predictions, but adapt to current market conditions.`;

  const userPrompt = `Analyze this economic event and map complete causal chains:

Event Type: ${event.event_type}
Severity: ${event.severity}/10
Description: ${event.description}
Start Date: ${event.start_date}

Historical Impacts for ${event.event_type}:
${JSON.stringify(historicalImpacts.slice(0, 10), null, 2)}

Current Date: ${new Date().toISOString()}

Provide comprehensive multi-order causal analysis with specific trade recommendations.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: 6000,
      response_format: { type: "json_object" }
    }),
  });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limits exceeded, please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Payment required, please add funds to your Lovable AI workspace.');
      }
      const error = await response.text();
      console.error('Lovable AI API error:', error);
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return JSON.parse(content);
}
