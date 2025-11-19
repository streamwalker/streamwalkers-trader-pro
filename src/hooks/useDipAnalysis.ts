import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DipAnalysisResult {
  id: string;
  symbol: string;
  analysis_date: string;
  dip_quality_score: number;
  dip_type: 'type_a_buyable' | 'type_b_trouble' | 'neutral';
  recommendation: 'buy_dip' | 'wait' | 'sell_avoid';
  confidence_level: number;
  trend_score: number;
  volume_score: number;
  catalyst_score: number;
  rsi_score: number;
  support_score: number;
  insider_score: number;
  options_flow_score: number;
  trend_data: any;
  volume_data: any;
  catalyst_data: any;
  technical_data: any;
  insider_data: any;
  options_data: any;
  current_price: number;
  price_change_percent: number;
  volume: number;
  market_cap: number;
  sector: string;
  analysis_summary: string;
  key_risks: string[];
  key_opportunities: string[];
  created_at: string;
}

export function useDipAnalysis() {
  const queryClient = useQueryClient();

  // Fetch latest dip analysis results
  const { data: dipResults, isLoading } = useQuery({
    queryKey: ['dip-analysis'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('dip_analysis_results')
        .select('*')
        .eq('analysis_date', today)
        .order('dip_quality_score', { ascending: false });
      
      if (error) throw error;
      return data as DipAnalysisResult[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch historical data for a symbol
  const fetchHistory = async (symbol: string, days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('dip_analysis_history')
      .select('*')
      .eq('symbol', symbol)
      .gte('analysis_date', startDate.toISOString().split('T')[0])
      .order('analysis_date', { ascending: true });
    
    if (error) throw error;
    return data;
  };

  // Trigger new analysis
  const analyzeNow = useMutation({
    mutationFn: async (symbols?: string[]) => {
      const { data, error } = await supabase.functions.invoke('analyze-dip-quality', {
        body: { 
          symbols: symbols || ['PLTR', 'QTUM', 'QBTS', 'MNTN', 'RGTI', 'QUBT', 'NFLX'],
          forceRefresh: true 
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dip-analysis'] });
      toast.success('Dip analysis completed successfully');
    },
    onError: (error) => {
      console.error('Error running dip analysis:', error);
      toast.error('Failed to run dip analysis');
    }
  });

  // Fetch user's watchlist
  const { data: watchlist } = useQuery({
    queryKey: ['dip-watchlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dip_watchlist')
        .select('*')
        .eq('is_active', true)
        .order('symbol');
      
      if (error) throw error;
      return data;
    }
  });

  // Add symbol to watchlist
  const addToWatchlist = useMutation({
    mutationFn: async ({ symbol, targetScore }: { symbol: string; targetScore?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('dip_watchlist')
        .insert({
          user_id: user.id,
          symbol,
          target_dip_score: targetScore,
          is_active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dip-watchlist'] });
      toast.success('Added to watchlist');
    },
    onError: (error) => {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    }
  });

  // Remove symbol from watchlist
  const removeFromWatchlist = useMutation({
    mutationFn: async (symbol: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('dip_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dip-watchlist'] });
      toast.success('Removed from watchlist');
    },
    onError: (error) => {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  });

  return {
    dipResults,
    isLoading,
    analyzeNow,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    fetchHistory
  };
}

export function useDipAnalysisHistory(symbol: string, days: number = 30) {
  return useQuery({
    queryKey: ['dip-history', symbol, days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('dip_analysis_history')
        .select('*')
        .eq('symbol', symbol)
        .gte('analysis_date', startDate.toISOString().split('T')[0])
        .order('analysis_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!symbol
  });
}
