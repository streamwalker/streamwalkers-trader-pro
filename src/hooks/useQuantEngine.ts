import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────────
export interface QuantStrategy {
  id: string;
  user_id: string;
  name: string;
  strategy_type: string;
  parameters: Record<string, any>;
  risk_controls: Record<string, any>;
  universe: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BacktestMetrics {
  cagr: number;
  sharpe: number;
  sortino: number;
  max_drawdown: number;
  win_rate: number;
  profit_factor: number;
  total_trades: number;
  total_return: number;
  final_equity: number;
}

export interface QuantBacktest {
  id: string;
  strategy_id: string;
  run_config: Record<string, any>;
  status: string;
  metrics: BacktestMetrics;
  equity_curve: { date: string; value: number }[];
  drawdown_curve: { date: string; value: number }[];
  trades: any[];
  started_at: string;
  completed_at: string;
  created_at: string;
}

export interface QuantSignal {
  id: string;
  strategy_id: string;
  symbol: string;
  signal_type: string;
  confidence: number;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  risk_reward: number;
  reasoning: string;
  generated_at: string;
  expires_at: string;
  status: string;
}

export interface PaperAccount {
  id: string;
  strategy_id: string;
  starting_capital: number;
  current_equity: number;
  cash_balance: number;
  total_pnl: number;
  max_drawdown_pct: number;
  daily_pnl: number;
  is_active: boolean;
  kill_switch_triggered: boolean;
  last_updated: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  quantity: number;
  avg_entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  status: string;
  opened_at: string;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  side: string;
  order_type: string;
  quantity: number;
  price: number;
  filled_price: number;
  slippage: number;
  commission_cents: number;
  status: string;
  created_at: string;
  filled_at: string;
}

// ── Hooks ────────────────────────────────────────────────────────────
export function useStrategies() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['quant-strategies', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_strategies')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as QuantStrategy[];
    },
    enabled: !!user,
  });
}

export function useSaveStrategy() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (strategy: Partial<QuantStrategy>) => {
      if (strategy.id) {
        const { data, error } = await supabase
          .from('quant_strategies')
          .update({ ...strategy, updated_at: new Date().toISOString() } as any)
          .eq('id', strategy.id)
          .select().single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from('quant_strategies')
        .insert({ ...strategy, user_id: user!.id } as any)
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quant-strategies'] });
      toast.success('Strategy saved');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBacktests(strategyId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['quant-backtests', strategyId],
    queryFn: async () => {
      let q = supabase.from('quant_backtests').select('*').order('created_at', { ascending: false });
      if (strategyId) q = q.eq('strategy_id', strategyId);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as QuantBacktest[];
    },
    enabled: !!user,
  });
}

export function useRunBacktest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { strategy_id: string; slippage?: number; transaction_cost?: number; starting_capital?: number }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await supabase.functions.invoke('quant-backtest', {
        body: params,
      });
      if (resp.error) throw resp.error;
      return resp.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quant-backtests'] });
      toast.success('Backtest completed');
    },
    onError: (e: Error) => toast.error(`Backtest failed: ${e.message}`),
  });
}

export function useSignals(strategyId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['quant-signals', strategyId],
    queryFn: async () => {
      let q = supabase.from('quant_signals').select('*').order('generated_at', { ascending: false }).limit(50);
      if (strategyId) q = q.eq('strategy_id', strategyId);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as QuantSignal[];
    },
    enabled: !!user,
  });
}

export function useGenerateSignals() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { strategy_id: string }) => {
      const resp = await supabase.functions.invoke('quant-signals', { body: params });
      if (resp.error) throw resp.error;
      return resp.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quant-signals'] });
      toast.success('Signals generated');
    },
    onError: (e: Error) => toast.error(`Signal generation failed: ${e.message}`),
  });
}

export function usePaperAccount(strategyId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['quant-paper-account', strategyId],
    queryFn: async () => {
      if (!strategyId) return null;
      const { data, error } = await supabase
        .from('quant_paper_account')
        .select('*')
        .eq('strategy_id', strategyId)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as PaperAccount | null;
    },
    enabled: !!user && !!strategyId,
  });
}

export function usePaperPositions(strategyId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['quant-paper-positions', strategyId],
    queryFn: async () => {
      if (!strategyId) return [];
      const { data, error } = await supabase
        .from('quant_paper_positions')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('status', 'open');
      if (error) throw error;
      return data as unknown as PaperPosition[];
    },
    enabled: !!user && !!strategyId,
  });
}

export function usePaperOrders(strategyId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['quant-paper-orders', strategyId],
    queryFn: async () => {
      if (!strategyId) return [];
      const { data, error } = await supabase
        .from('quant_paper_orders')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as unknown as PaperOrder[];
    },
    enabled: !!user && !!strategyId,
  });
}

export function usePaperTradeAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { action: string; strategy_id: string; starting_capital?: number }) => {
      const resp = await supabase.functions.invoke('quant-paper-trade', { body: params });
      if (resp.error) throw resp.error;
      return resp.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['quant-paper-account'] });
      qc.invalidateQueries({ queryKey: ['quant-paper-positions'] });
      qc.invalidateQueries({ queryKey: ['quant-paper-orders'] });
      const msg = vars.action === 'start' ? 'Paper trading started' : vars.action === 'kill' ? 'Kill switch activated' : 'Paper trading stopped';
      toast.success(msg);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
