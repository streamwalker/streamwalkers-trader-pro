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
    const { predictionId, actualOutcomes, marketData } = await req.json();
    
    console.log('Scoring prediction:', predictionId);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the prediction
    const { data: prediction, error: predError } = await supabase
      .from('predictions')
      .select(`
        *,
        economic_events (*)
      `)
      .eq('id', predictionId)
      .single();
    
    if (predError || !prediction) {
      throw new Error('Prediction not found');
    }
    
    // Calculate accuracy score
    const accuracyScore = calculateAccuracyScore(
      prediction.predicted_impact,
      actualOutcomes,
      marketData
    );
    
    // Score trade recommendations
    const tradeScores = scoreTradeRecommendations(
      prediction.trade_recommendations,
      actualOutcomes,
      marketData
    );
    
    // Update prediction with actual impact and accuracy
    const { error: updateError } = await supabase
      .from('predictions')
      .update({
        actual_impact: actualOutcomes,
        accuracy_score: accuracyScore.overall_accuracy
      })
      .eq('id', predictionId);
    
    if (updateError) {
      console.error('Error updating prediction:', updateError);
    }
    
    // Calculate aggregate statistics for this event type
    const stats = await calculateAggregateStats(
      supabase,
      prediction.economic_events.event_type
    );
    
    return new Response(
      JSON.stringify({
        prediction_id: predictionId,
        accuracy_score: accuracyScore,
        trade_scores: tradeScores,
        event_type_stats: stats,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error scoring prediction:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

function calculateAccuracyScore(
  predicted: any,
  actual: any,
  marketData: any
): any {
  let totalScore = 0;
  let componentCount = 0;
  const components: any = {};
  
  // Score directional accuracy (most important)
  if (predicted.direction && actual.direction) {
    const directionCorrect = predicted.direction === actual.direction;
    components.direction_accuracy = directionCorrect ? 1.0 : 0.0;
    totalScore += directionCorrect ? 3.0 : 0.0; // Weight: 3x
    componentCount += 3;
  }
  
  // Score magnitude accuracy
  if (predicted.magnitude && actual.magnitude) {
    const predictedMag = Math.abs(predicted.magnitude);
    const actualMag = Math.abs(actual.magnitude);
    const error = Math.abs(predictedMag - actualMag) / actualMag;
    const magnitudeScore = Math.max(0, 1 - error);
    components.magnitude_accuracy = magnitudeScore;
    totalScore += magnitudeScore * 2.0; // Weight: 2x
    componentCount += 2;
  }
  
  // Score timing accuracy
  if (predicted.timing && actual.timing) {
    const timingError = Math.abs(predicted.timing - actual.timing);
    const timingScore = Math.max(0, 1 - (timingError / 7)); // 7 day tolerance
    components.timing_accuracy = timingScore;
    totalScore += timingScore;
    componentCount += 1;
  }
  
  // Score sector prediction accuracy
  if (predicted.affected_sectors && actual.affected_sectors) {
    const predictedSet = new Set(predicted.affected_sectors);
    const actualSet = new Set(actual.affected_sectors);
    const intersection = [...predictedSet].filter(x => actualSet.has(x));
    const union = new Set([...predictedSet, ...actualSet]);
    const sectorScore = intersection.length / union.size;
    components.sector_accuracy = sectorScore;
    totalScore += sectorScore;
    componentCount += 1;
  }
  
  const overall_accuracy = componentCount > 0 ? totalScore / componentCount : 0;
  
  return {
    overall_accuracy: Math.min(1.0, Math.max(0, overall_accuracy)),
    components,
    grade: getAccuracyGrade(overall_accuracy)
  };
}

function scoreTradeRecommendations(
  recommendations: any[],
  actualOutcomes: any,
  marketData: any
): any[] {
  if (!recommendations || recommendations.length === 0) {
    return [];
  }
  
  return recommendations.map(trade => {
    let score = 0;
    const components: any = {};
    
    // Check if trade direction was correct
    if (trade.action && actualOutcomes.price_movements) {
      const symbols = trade.symbols || [];
      let directionCorrect = 0;
      
      symbols.forEach((symbol: string) => {
        const movement = actualOutcomes.price_movements[symbol];
        if (movement) {
          const correct = (trade.action === 'LONG' && movement > 0) ||
                         (trade.action === 'SHORT' && movement < 0);
          if (correct) directionCorrect++;
        }
      });
      
      components.direction_correct = symbols.length > 0 
        ? directionCorrect / symbols.length 
        : 0;
      score += components.direction_correct * 50;
    }
    
    // Check if target was reached
    if (trade.target && actualOutcomes.targets_reached) {
      components.target_reached = actualOutcomes.targets_reached[trade.symbols?.[0]] || false;
      score += components.target_reached ? 30 : 0;
    }
    
    // Check if stop loss was avoided
    if (trade.stop_loss && actualOutcomes.stops_hit) {
      components.stop_avoided = !actualOutcomes.stops_hit[trade.symbols?.[0]];
      score += components.stop_avoided ? 20 : -20;
    }
    
    return {
      trade_id: trade.symbols?.join(',') || 'unknown',
      action: trade.action,
      score: Math.min(100, Math.max(0, score)),
      components,
      profitability: score > 50 ? 'profitable' : 'unprofitable'
    };
  });
}

function getAccuracyGrade(score: number): string {
  if (score >= 0.9) return 'A+';
  if (score >= 0.8) return 'A';
  if (score >= 0.7) return 'B+';
  if (score >= 0.6) return 'B';
  if (score >= 0.5) return 'C';
  return 'D';
}

async function calculateAggregateStats(supabase: any, eventType: string) {
  const { data: predictions, error } = await supabase
    .from('predictions')
    .select(`
      *,
      economic_events!inner (event_type)
    `)
    .eq('economic_events.event_type', eventType)
    .not('accuracy_score', 'is', null);
  
  if (error || !predictions || predictions.length === 0) {
    return {
      total_predictions: 0,
      average_accuracy: 0,
      median_accuracy: 0
    };
  }
  
  const scores = predictions.map((p: any) => p.accuracy_score).sort();
  const sum = scores.reduce((a: number, b: number) => a + b, 0);
  const median = scores[Math.floor(scores.length / 2)];
  
  return {
    total_predictions: predictions.length,
    average_accuracy: sum / predictions.length,
    median_accuracy: median,
    best_accuracy: Math.max(...scores),
    worst_accuracy: Math.min(...scores)
  };
}
