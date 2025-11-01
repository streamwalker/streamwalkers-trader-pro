import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive sector taxonomy and relationships
const SECTOR_TAXONOMY = {
  'Technology': {
    subsectors: ['Software', 'Hardware', 'Semiconductors', 'Cloud Services', 'Cybersecurity'],
    related: ['Communications', 'Consumer Discretionary'],
    sensitivity: 'high_growth'
  },
  'Financials': {
    subsectors: ['Banks', 'Insurance', 'Asset Management', 'Fintech', 'Real Estate'],
    related: ['Real Estate', 'Consumer Discretionary'],
    sensitivity: 'interest_rate'
  },
  'Healthcare': {
    subsectors: ['Pharma', 'Biotech', 'Medical Devices', 'Health Services'],
    related: ['Consumer Staples'],
    sensitivity: 'defensive'
  },
  'Energy': {
    subsectors: ['Oil & Gas', 'Renewables', 'Utilities', 'Coal', 'Nuclear'],
    related: ['Materials', 'Industrials'],
    sensitivity: 'commodity'
  },
  'Consumer Discretionary': {
    subsectors: ['Retail', 'Automotive', 'Restaurants', 'Hotels', 'Entertainment'],
    related: ['Technology', 'Financials'],
    sensitivity: 'cyclical'
  },
  'Consumer Staples': {
    subsectors: ['Food & Beverage', 'Household Products', 'Tobacco', 'Personal Care'],
    related: ['Healthcare'],
    sensitivity: 'defensive'
  },
  'Industrials': {
    subsectors: ['Aerospace', 'Defense', 'Construction', 'Manufacturing', 'Transportation'],
    related: ['Materials', 'Energy'],
    sensitivity: 'cyclical'
  },
  'Materials': {
    subsectors: ['Chemicals', 'Metals & Mining', 'Paper', 'Construction Materials'],
    related: ['Industrials', 'Energy'],
    sensitivity: 'commodity'
  },
  'Communications': {
    subsectors: ['Telecom', 'Media', 'Entertainment', 'Social Media'],
    related: ['Technology', 'Consumer Discretionary'],
    sensitivity: 'growth'
  },
  'Real Estate': {
    subsectors: ['Commercial', 'Residential', 'REITs', 'Construction'],
    related: ['Financials', 'Industrials'],
    sensitivity: 'interest_rate'
  },
  'Utilities': {
    subsectors: ['Electric', 'Gas', 'Water', 'Renewables'],
    related: ['Energy'],
    sensitivity: 'defensive'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { eventType, eventDescription, severity } = await req.json();
    
    console.log('Mapping sector impacts for:', eventType);
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get historical sector impacts
    const { data: historicalImpacts } = await supabase
      .from('sector_impacts')
      .select('*')
      .eq('event_type', eventType);
    
    // Use AI to map sector impacts across all orders
    const sectorMapping = await mapSectorImpacts(
      eventType,
      eventDescription,
      severity,
      historicalImpacts || [],
      lovableApiKey
    );
    
    console.log('Sector mapping result:', JSON.stringify(sectorMapping, null, 2));
    
    // Store sector impacts in database
    for (const impact of sectorMapping.impacts) {
      await supabase
        .from('sector_impacts')
        .upsert({
          event_type: eventType,
          sector: impact.sector,
          impact_order: impact.order,
          impact_direction: impact.direction,
          typical_delay_days: impact.delay_days,
          confidence: impact.confidence,
          historical_examples: impact.historical_examples || []
        }, {
          onConflict: 'event_type,sector,impact_order'
        });
    }
    
    return new Response(
      JSON.stringify({
        sector_mapping: sectorMapping,
        taxonomy: SECTOR_TAXONOMY,
        stored_impacts: sectorMapping.impacts.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error mapping sector impacts:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

async function mapSectorImpacts(
  eventType: string,
  description: string,
  severity: number,
  historicalImpacts: any[],
  apiKey: string
) {
  const systemPrompt = `You are an expert in sector analysis and economic impact mapping. 

Your task is to map how an economic event affects different sectors across multiple orders of impact.

Use this sector taxonomy:
${JSON.stringify(SECTOR_TAXONOMY, null, 2)}

For each affected sector, determine:
1. Impact Order (1-4): Which order of causation?
   - Order 1: Direct, immediate impact
   - Order 2: Secondary effects (1-2 weeks)
   - Order 3: Tertiary effects (2-4 weeks)
   - Order 4: Long-term systemic (1-3 months)

2. Direction: positive, negative, or neutral

3. Delay Days: How many days until this impact manifests?

4. Confidence: 0-1 scale (how certain is this prediction?)

5. Mechanism: HOW does the event affect this sector?

6. Correlation Strength: 0-1 (how strongly correlated to the event?)

7. Historical Examples: Past similar events

Return JSON in this format:
{
  "impacts": [
    {
      "sector": "Airlines",
      "subsectors": ["Commercial Airlines", "Regional Carriers"],
      "order": 3,
      "direction": "negative",
      "delay_days": 21,
      "confidence": 0.85,
      "mechanism": "TSA/ATC shortages lead to flight cancellations and delays",
      "correlation_strength": 0.9,
      "magnitude_estimate": -8.5,
      "historical_examples": ["2018-2019 shutdown"],
      "related_sectors": ["Travel", "Hospitality", "Business Services"]
    }
  ],
  "supply_chain_effects": [
    {
      "from_sector": "Airlines",
      "to_sector": "Aviation Fuel",
      "mechanism": "Reduced flights decrease fuel demand",
      "order": 3,
      "delay_days": 14
    }
  ],
  "correlation_matrix": {
    "Airlines": {"Travel": 0.95, "Hotels": 0.85},
    "Travel": {"Hotels": 0.9, "Restaurants": 0.75}
  }
}

Be comprehensive - identify ALL sectors affected across all orders, including non-obvious connections.`;

  const userPrompt = `Map sector impacts for this event:

Event Type: ${eventType}
Severity: ${severity}/10
Description: ${description}

Historical Impacts:
${JSON.stringify(historicalImpacts.slice(0, 15), null, 2)}

Identify all affected sectors across all 4 orders of causation.`;

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
