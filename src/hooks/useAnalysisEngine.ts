import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useParseAndClassifyEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      newsArticles?: any[];
      economicData?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('parse-and-classify-event', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['economic-events'] });
      queryClient.invalidateQueries({ queryKey: ['active-events'] });
      
      if (data.stored_events?.length > 0) {
        toast.success(`Classified and stored ${data.stored_events.length} significant event(s)`);
      }
    },
    onError: (error) => {
      toast.error('Failed to parse events');
      console.error('Error parsing events:', error);
    }
  });
}

export function useCalculateCausalChains() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data, error } = await supabase.functions.invoke('calculate-causal-chains', {
        body: { eventId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['economic-events'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Causal chain analysis complete');
    },
    onError: (error) => {
      toast.error('Failed to calculate causal chains');
      console.error('Error calculating causal chains:', error);
    }
  });
}

export function useScorePrediction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      predictionId: string;
      actualOutcomes: any;
      marketData?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('score-predictions', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success(`Prediction scored: ${data.accuracy_score.grade} (${(data.accuracy_score.overall_accuracy * 100).toFixed(1)}%)`);
    },
    onError: (error) => {
      toast.error('Failed to score prediction');
      console.error('Error scoring prediction:', error);
    }
  });
}

export function useMapSectorImpacts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      eventType: string;
      eventDescription: string;
      severity: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('map-sector-impacts', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sector-impacts'] });
      toast.success(`Mapped ${data.stored_impacts} sector impacts`);
    },
    onError: (error) => {
      toast.error('Failed to map sector impacts');
      console.error('Error mapping sectors:', error);
    }
  });
}

export function useAnalysisEngine() {
  const parseEvents = useParseAndClassifyEvent();
  const calculateChains = useCalculateCausalChains();
  const scorePrediction = useScorePrediction();
  const mapSectors = useMapSectorImpacts();
  
  return {
    parseEvents,
    calculateChains,
    scorePrediction,
    mapSectors,
    isAnalyzing: parseEvents.isPending || calculateChains.isPending || 
                 scorePrediction.isPending || mapSectors.isPending
  };
}
