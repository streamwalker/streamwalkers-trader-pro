import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EconomicEvent {
  id: string;
  event_type: string;
  severity: number;
  start_date: string;
  end_date?: string;
  description: string;
  affected_sectors: string[];
  impact_timeline: any;
  confidence_score: number;
}

export interface CycleIndicator {
  id: string;
  cycle_type: string;
  current_phase: string;
  phase_start_date: string;
  indicator_values: any;
  historical_context: any;
}

export interface Prediction {
  id: string;
  event_id: string;
  predicted_impact: any;
  trade_recommendations: any[];
  prediction_date: string;
}

export function useEconomicEvents() {
  return useQuery({
    queryKey: ['economic-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as EconomicEvent[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useActiveEvents() {
  return useQuery({
    queryKey: ['active-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_events')
        .select('*')
        .is('end_date', null)
        .order('severity', { ascending: false });
      
      if (error) throw error;
      return data as EconomicEvent[];
    },
    refetchInterval: 30000,
  });
}

export function useCycleIndicators() {
  return useQuery({
    queryKey: ['cycle-indicators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_indicators')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as CycleIndicator[];
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

export function usePredictions(eventId?: string) {
  return useQuery({
    queryKey: ['predictions', eventId],
    queryFn: async () => {
      let query = supabase
        .from('predictions')
        .select(`
          *,
          economic_events (*)
        `)
        .order('prediction_date', { ascending: false });
      
      if (eventId) {
        query = query.eq('event_id', eventId);
      }
      
      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      return data;
    },
  });
}

export function useFetchEconomicData() {
  return useMutation({
    mutationFn: async (dataType: 'macro_indicators' | 'news' | 'global_indicators') => {
      const { data, error } = await supabase.functions.invoke('fetch-economic-data', {
        body: { dataType }
      });
      
      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast.error('Failed to fetch economic data');
      console.error('Error fetching economic data:', error);
    }
  });
}

export function useAnalyzeEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      eventDescription: string;
      eventType: string;
      severity: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('analyze-economic-event', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-events'] });
      queryClient.invalidateQueries({ queryKey: ['active-events'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Event analyzed successfully');
    },
    onError: (error) => {
      toast.error('Failed to analyze event');
      console.error('Error analyzing event:', error);
    }
  });
}

export function usePredictMarketImpact() {
  return useMutation({
    mutationFn: async (params: {
      symbols?: string[];
      timeframe?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('predict-market-impact', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast.error('Failed to generate predictions');
      console.error('Error predicting market impact:', error);
    }
  });
}

export function useMarketOracle() {
  const events = useEconomicEvents();
  const activeEvents = useActiveEvents();
  const cycles = useCycleIndicators();
  const predictions = usePredictions();
  const fetchData = useFetchEconomicData();
  const analyzeEvent = useAnalyzeEvent();
  const predictImpact = usePredictMarketImpact();
  
  return {
    events,
    activeEvents,
    cycles,
    predictions,
    fetchData,
    analyzeEvent,
    predictImpact,
    isLoading: events.isLoading || cycles.isLoading,
  };
}
