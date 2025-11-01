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
    const { newsArticles, economicData } = await req.json();
    
    console.log('Parsing and classifying events...');
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Prepare content for AI classification
    const content = formatContentForAI(newsArticles, economicData);
    
    // Use Lovable AI to parse and classify events
    const classification = await classifyEvents(content, lovableApiKey);
    
    console.log('Classification result:', classification);
    
    // Store significant events in database
    const storedEvents = [];
    for (const event of classification.events) {
      if (event.significance_score >= 5) { // Only store significant events
        const { data, error } = await supabase
          .from('economic_events')
          .insert({
            event_type: event.event_type,
            severity: event.severity,
            start_date: event.detected_date,
            description: event.description,
            affected_sectors: event.affected_sectors,
            impact_timeline: {},
            confidence_score: event.confidence_score
          })
          .select()
          .single();
        
        if (!error && data) {
          storedEvents.push(data);
        }
      }
    }
    
    return new Response(
      JSON.stringify({
        classified_events: classification.events,
        stored_events: storedEvents,
        market_regime: classification.market_regime,
        risk_level: classification.risk_level
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error parsing events:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

function formatContentForAI(newsArticles: any[], economicData: any) {
  let content = 'Recent News Articles:\n';
  
  if (newsArticles && newsArticles.length > 0) {
    newsArticles.slice(0, 20).forEach((article, idx) => {
      content += `${idx + 1}. ${article.title}\n`;
      if (article.description) {
        content += `   ${article.description}\n`;
      }
      content += `   Source: ${article.source || 'Unknown'}\n\n`;
    });
  }
  
  if (economicData) {
    content += '\nEconomic Indicators:\n';
    content += JSON.stringify(economicData, null, 2);
  }
  
  return content;
}

async function classifyEvents(content: string, apiKey: string) {
  const systemPrompt = `You are an expert economic event classifier and market analyst. Your task is to:

1. Identify significant economic, political, and geopolitical events from news and data
2. Classify each event into one of these categories:
   - government_action (shutdowns, policy changes, regulations)
   - monetary_policy (interest rates, QE/QT, central bank actions)
   - geopolitical (conflicts, trade disputes, sanctions, elections)
   - economic_data (GDP, employment, inflation reports)
   - corporate (major earnings, bankruptcies, mergers)
   - financial_crisis (bank failures, market crashes, liquidity events)
   - natural_disaster (pandemics, weather events, supply disruptions)
   - technological (AI breakthroughs, cyber attacks, disruptions)
   - other

3. For each significant event, provide:
   - event_type: Category from above
   - description: Clear 1-2 sentence summary
   - severity: 1-10 scale (10 = market-moving crisis)
   - significance_score: 1-10 (how important for traders)
   - affected_sectors: Array of sector names
   - confidence_score: 0-1 (how confident you are)
   - detected_date: Current timestamp
   - key_factors: Array of specific impacts

4. Assess overall market regime and risk level

Return JSON in this exact format:
{
  "events": [
    {
      "event_type": "government_action",
      "description": "Event summary",
      "severity": 7,
      "significance_score": 8,
      "affected_sectors": ["Airlines", "Travel", "Hospitality"],
      "confidence_score": 0.85,
      "detected_date": "2025-11-01T08:30:00Z",
      "key_factors": ["TSA shortages", "ATC delays", "Business travel disruption"]
    }
  ],
  "market_regime": "late_cycle_expansion",
  "risk_level": "elevated"
}

IMPORTANT: Only return events with significance_score >= 5. Focus on actionable, market-moving events.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
      ],
      max_completion_tokens: 4000,
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
  const content_text = data.choices[0].message.content;
  
  return JSON.parse(content_text);
}
