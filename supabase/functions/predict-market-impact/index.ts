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
    const { symbols, timeframe } = await req.json()
    
    console.log('Predicting market impact for:', symbols, timeframe)
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get active economic events
    const { data: activeEvents } = await supabase
      .from('economic_events')
      .select('*')
      .is('end_date', null)
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Get current cycle indicators
    const { data: cycles } = await supabase
      .from('cycle_indicators')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5)
    
    // Get recent predictions for accuracy tracking
    const { data: recentPredictions } = await supabase
      .from('predictions')
      .select(`
        *,
        economic_events (*)
      `)
      .order('prediction_date', { ascending: false })
      .limit(20)
    
    // Use AI to generate predictions
    const predictions = lovableApiKey ? await generateAIPredictions(
      symbols || ['SPY', 'QQQ'],
      timeframe || 'medium',
      activeEvents || [],
      cycles || [],
      recentPredictions || [],
      lovableApiKey
    ) : generateBasicPredictions(symbols, timeframe)
    
    return new Response(
      JSON.stringify(predictions),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error predicting market impact:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function generateAIPredictions(
  symbols: string[],
  timeframe: string,
  activeEvents: any[],
  cycles: any[],
  recentPredictions: any[],
  apiKey: string
) {
  const systemPrompt = `You are a Market Oracle AI that predicts market movements based on economic cycles, active events, and historical patterns.

Analyze the current market conditions and provide predictions for the requested symbols and timeframe.

Format your response as JSON:
{
  "predictions": [
    {
      "symbol": "SPY",
      "timeframe": "short_term",
      "direction": "bearish",
      "confidence": 0.75,
      "predicted_move_percent": -3.5,
      "key_factors": ["factor1", "factor2"],
      "risk_level": "medium",
      "entry_level": "current",
      "target": "-3.5%",
      "stop_loss": "+1.5%"
    }
  ],
  "market_regime": "late_cycle",
  "overall_sentiment": "cautious",
  "top_opportunities": ["description1", "description2"],
  "key_risks": ["risk1", "risk2"]
}`

  const userPrompt = `Predict market movements for: ${symbols.join(', ')}
Timeframe: ${timeframe}

Active Economic Events:
${JSON.stringify(activeEvents.slice(0, 5), null, 2)}

Current Economic Cycles:
${JSON.stringify(cycles, null, 2)}

Recent Prediction Accuracy:
${JSON.stringify(recentPredictions.slice(0, 5).map(p => ({
  event: p.economic_events?.event_type,
  predicted: p.predicted_impact,
  actual: p.actual_impact,
  accuracy: p.accuracy_score
})), null, 2)}

Provide comprehensive predictions with specific entry/exit levels and confidence scores.`

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

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limits exceeded, please try again later.')
      }
      if (response.status === 402) {
        throw new Error('Payment required, please add funds to your Lovable AI workspace.')
      }
      const error = await response.text()
      console.error('Lovable AI API error:', error)
      throw new Error(`Lovable AI API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI API response structure:', JSON.stringify(data))
      throw new Error('Invalid AI API response structure')
    }

    const content = data.choices[0].message.content

    // Validate content exists and is not empty
    if (!content || content.trim() === '') {
      console.error('Empty content from AI API')
      throw new Error('Empty response from AI API')
    }

    console.log('AI response content:', content)
    
    // Parse JSON with error handling
    try {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
      
      const predictions = JSON.parse(jsonStr)
      console.log('Successfully parsed predictions:', predictions)
      return predictions
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      console.error('Content received:', content)
      throw new Error(`Failed to parse AI response: ${parseError.message}`)
    }
  } catch (error) {
    console.error('Error with AI predictions:', error.message)
    console.error('Full error:', error)
    // Return basic predictions as fallback
    console.log('Falling back to basic predictions')
    return generateBasicPredictions(symbols, timeframe)
  }
}

function generateBasicPredictions(symbols: string[], timeframe: string) {
  return {
    predictions: symbols.map(symbol => ({
      symbol,
      timeframe,
      direction: 'neutral',
      confidence: 0.5,
      predicted_move_percent: 0,
      key_factors: ['Market conditions unclear'],
      risk_level: 'medium'
    })),
    market_regime: 'uncertain',
    overall_sentiment: 'neutral',
    top_opportunities: ['No clear opportunities identified'],
    key_risks: ['Market volatility']
  }
}
