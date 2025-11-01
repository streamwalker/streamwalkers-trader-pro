import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { eventDescription, eventType, severity } = await req.json()
    
    console.log('Analyzing economic event:', eventType, severity)
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get historical sector impacts for this event type
    const { data: historicalImpacts } = await supabase
      .from('sector_impacts')
      .select('*')
      .eq('event_type', eventType)
      .order('impact_order')
    
    // Use AI to analyze the event and predict multi-order effects
    const aiAnalysis = lovableApiKey ? await analyzeWithAI(
      eventDescription,
      eventType,
      severity,
      historicalImpacts || [],
      lovableApiKey
    ) : generateBasicAnalysis(eventType, severity, historicalImpacts || [])
    
    // Store the event in the database
    const { data: event, error: eventError } = await supabase
      .from('economic_events')
      .insert({
        event_type: eventType,
        severity,
        start_date: new Date().toISOString(),
        description: eventDescription,
        affected_sectors: aiAnalysis.affected_sectors,
        impact_timeline: aiAnalysis.impact_timeline,
        confidence_score: aiAnalysis.confidence_score
      })
      .select()
      .single()
    
    if (eventError) throw eventError
    
    // Store predictions
    const { error: predError } = await supabase
      .from('predictions')
      .insert({
        event_id: event.id,
        predicted_impact: aiAnalysis.predicted_impact,
        trade_recommendations: aiAnalysis.trade_recommendations
      })
    
    if (predError) console.error('Error storing prediction:', predError)
    
    return new Response(
      JSON.stringify({
        event,
        analysis: aiAnalysis
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error analyzing event:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function analyzeWithAI(
  eventDescription: string,
  eventType: string,
  severity: number,
  historicalImpacts: any[],
  apiKey: string
) {
  const systemPrompt = `You are an advanced Market Oracle with predictive capabilities. Analyze economic events and provide multi-order impact analysis.

When analyzing events, you MUST:
- Map all orders of effects (first → second → third → fourth)
- Identify affected sectors with confidence scores
- Provide specific trade recommendations with entry/exit levels
- Reference historical precedents
- Explain reasoning step-by-step
- Give timeline predictions (when will X affect Y?)

Format your response as JSON with this structure:
{
  "affected_sectors": ["sector1", "sector2"],
  "impact_timeline": {
    "first_order": {"effects": ["effect1"], "timeline": "immediate"},
    "second_order": {"effects": ["effect1"], "timeline": "1-2 weeks"},
    "third_order": {"effects": ["effect1"], "timeline": "2-4 weeks"},
    "fourth_order": {"effects": ["effect1"], "timeline": "1-3 months"}
  },
  "predicted_impact": {
    "short_term": "1-7 days prediction",
    "medium_term": "1-4 weeks prediction",
    "long_term": "1-3 months prediction"
  },
  "trade_recommendations": [
    {
      "action": "SHORT",
      "symbols": ["DAL", "UAL"],
      "reasoning": "explanation",
      "confidence": 0.82,
      "entry": "current price",
      "target": "-8%",
      "stop": "+3%"
    }
  ],
  "confidence_score": 0.75
}`

  const userPrompt = `Analyze this economic event:
Event Type: ${eventType}
Severity: ${severity}/10
Description: ${eventDescription}

Historical similar events affected these sectors:
${JSON.stringify(historicalImpacts, null, 2)}

Provide a comprehensive multi-order impact analysis.`

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('Error with AI analysis:', error)
    return generateBasicAnalysis(eventType, severity, historicalImpacts)
  }
}

function generateBasicAnalysis(eventType: string, severity: number, historicalImpacts: any[]) {
  const sectors = historicalImpacts.map(h => h.sector)
  
  return {
    affected_sectors: sectors.length > 0 ? sectors : ['general_market'],
    impact_timeline: {
      first_order: {
        effects: [`Direct impact from ${eventType}`],
        timeline: 'immediate'
      },
      second_order: {
        effects: ['Secondary market reactions'],
        timeline: '1-2 weeks'
      },
      third_order: {
        effects: ['Cascading effects to related sectors'],
        timeline: '2-4 weeks'
      },
      fourth_order: {
        effects: ['Systemic economic impacts'],
        timeline: '1-3 months'
      }
    },
    predicted_impact: {
      short_term: `Severity ${severity}/10 impact expected in 1-7 days`,
      medium_term: 'Continued effects over 1-4 weeks',
      long_term: 'Long-term structural changes possible over 1-3 months'
    },
    trade_recommendations: [],
    confidence_score: 0.5
  }
}
