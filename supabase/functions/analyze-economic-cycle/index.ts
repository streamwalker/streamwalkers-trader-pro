import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting economic cycle analysis...');

    // Step 1: Fetch economic data by invoking the fetch-economic-data function
    const { data: macroData, error: fetchError } = await supabase.functions.invoke('fetch-economic-data', {
      body: { dataType: 'macro_indicators' }
    });

    if (fetchError) {
      console.error('Error fetching economic data:', fetchError);
      throw fetchError;
    }

    console.log('Macro indicators fetched:', macroData?.indicators?.length || 0);

    // Step 2: Use Lovable AI to analyze the indicators
    const prompt = `Analyze the following macroeconomic indicators and determine the current economic cycle phases:

INDICATORS:
${JSON.stringify(macroData.indicators, null, 2)}

Please analyze and provide:
1. Business Cycle Phase (Early Expansion, Mid Expansion, Late Expansion, Peak, Early Contraction, Deep Contraction, or Trough)
2. Credit Cycle Phase (Expansion, Peak, Contraction, or Trough)
3. Key supporting indicators and their values
4. Confidence score (0-1)
5. Expected phase duration
6. Key risks to watch

Return your analysis in this exact JSON structure:
{
  "business_cycle": {
    "phase": "Mid Expansion",
    "confidence": 0.85,
    "supporting_indicators": ["GDP Growth: 2.8%", "Unemployment: 4.1%"],
    "reasoning": "Strong GDP growth with low unemployment suggests mid-expansion phase"
  },
  "credit_cycle": {
    "phase": "Expansion",
    "confidence": 0.75,
    "supporting_indicators": ["Low credit spreads", "Increasing lending"],
    "reasoning": "Credit conditions remain accommodative"
  },
  "key_risks": ["Inflation pressures", "Fed policy tightening"],
  "expected_duration_months": "3-6",
  "phase_start_estimate": "2024-06-01"
}`;

    console.log('Calling Lovable AI for cycle analysis...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert economist specializing in economic cycle analysis. Provide precise, data-driven analysis in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    console.log('AI analysis received:', analysisText.substring(0, 200));

    // Parse the AI response (handle markdown code blocks if present)
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(analysisText);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      throw new Error('Invalid AI response format');
    }

    // Step 3: Store both business cycle and credit cycle in the database
    const now = new Date().toISOString();
    const phaseStartDate = analysis.phase_start_estimate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const cyclesToInsert = [
      {
        cycle_type: 'Business Cycle',
        current_phase: analysis.business_cycle.phase,
        phase_start_date: phaseStartDate,
        indicator_values: {
          confidence: analysis.business_cycle.confidence,
          supporting_indicators: analysis.business_cycle.supporting_indicators,
          key_risks: analysis.key_risks,
          expected_duration: analysis.expected_duration_months,
          raw_indicators: macroData.indicators.slice(0, 10) // Store subset of raw data
        },
        historical_context: {
          reasoning: analysis.business_cycle.reasoning,
          analysis_date: now,
          data_source: 'FRED API',
          ai_model: 'google/gemini-2.5-flash'
        },
        created_at: now,
        updated_at: now
      },
      {
        cycle_type: 'Credit Cycle',
        current_phase: analysis.credit_cycle.phase,
        phase_start_date: phaseStartDate,
        indicator_values: {
          confidence: analysis.credit_cycle.confidence,
          supporting_indicators: analysis.credit_cycle.supporting_indicators,
          key_risks: analysis.key_risks
        },
        historical_context: {
          reasoning: analysis.credit_cycle.reasoning,
          analysis_date: now,
          data_source: 'FRED API',
          ai_model: 'google/gemini-2.5-flash'
        },
        created_at: now,
        updated_at: now
      }
    ];

    console.log('Storing cycle analysis in database...');

    // Delete old cycle data and insert new
    await supabase.from('cycle_indicators').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { data: insertedData, error: insertError } = await supabase
      .from('cycle_indicators')
      .insert(cyclesToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting cycle data:', insertError);
      throw insertError;
    }

    console.log('Cycle analysis complete:', insertedData.length, 'cycles stored');

    return new Response(
      JSON.stringify({
        success: true,
        cycles: insertedData,
        business_cycle_phase: analysis.business_cycle.phase,
        credit_cycle_phase: analysis.credit_cycle.phase
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-economic-cycle:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
