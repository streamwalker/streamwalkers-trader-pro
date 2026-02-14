
-- Quant Engine Tables

-- 1. quant_strategies
CREATE TABLE public.quant_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  strategy_type TEXT NOT NULL DEFAULT 'trend_follow',
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  risk_controls JSONB NOT NULL DEFAULT '{"max_position_pct": 10, "max_daily_loss_pct": 3, "max_drawdown_pct": 15, "kill_switch": true}'::jsonb,
  universe TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quant_strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own strategies" ON public.quant_strategies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. quant_backtests
CREATE TABLE public.quant_backtests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.quant_strategies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  run_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  metrics JSONB DEFAULT '{}'::jsonb,
  equity_curve JSONB DEFAULT '[]'::jsonb,
  drawdown_curve JSONB DEFAULT '[]'::jsonb,
  trades JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quant_backtests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own backtests" ON public.quant_backtests FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. quant_signals
CREATE TABLE public.quant_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.quant_strategies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL DEFAULT 'hold',
  confidence NUMERIC DEFAULT 0,
  entry_price NUMERIC,
  target_price NUMERIC,
  stop_loss NUMERIC,
  risk_reward NUMERIC,
  reasoning TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active'
);

ALTER TABLE public.quant_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own signals" ON public.quant_signals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. quant_paper_orders
CREATE TABLE public.quant_paper_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.quant_strategies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'market',
  quantity NUMERIC NOT NULL,
  price NUMERIC,
  filled_price NUMERIC,
  slippage NUMERIC DEFAULT 0,
  commission_cents INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  filled_at TIMESTAMPTZ
);

ALTER TABLE public.quant_paper_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own paper orders" ON public.quant_paper_orders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. quant_paper_positions
CREATE TABLE public.quant_paper_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.quant_strategies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  avg_entry_price NUMERIC NOT NULL DEFAULT 0,
  current_price NUMERIC DEFAULT 0,
  unrealized_pnl NUMERIC DEFAULT 0,
  realized_pnl NUMERIC DEFAULT 0,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open'
);

ALTER TABLE public.quant_paper_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own paper positions" ON public.quant_paper_positions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. quant_paper_account
CREATE TABLE public.quant_paper_account (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.quant_strategies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  starting_capital NUMERIC NOT NULL DEFAULT 100000,
  current_equity NUMERIC NOT NULL DEFAULT 100000,
  cash_balance NUMERIC NOT NULL DEFAULT 100000,
  total_pnl NUMERIC NOT NULL DEFAULT 0,
  max_drawdown_pct NUMERIC NOT NULL DEFAULT 0,
  daily_pnl NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  kill_switch_triggered BOOLEAN NOT NULL DEFAULT false,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quant_paper_account ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own paper account" ON public.quant_paper_account FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_quant_strategies_user ON public.quant_strategies(user_id);
CREATE INDEX idx_quant_backtests_strategy ON public.quant_backtests(strategy_id);
CREATE INDEX idx_quant_signals_strategy ON public.quant_signals(strategy_id);
CREATE INDEX idx_quant_paper_orders_strategy ON public.quant_paper_orders(strategy_id);
CREATE INDEX idx_quant_paper_positions_strategy ON public.quant_paper_positions(strategy_id);
CREATE INDEX idx_quant_paper_account_strategy ON public.quant_paper_account(strategy_id);

-- Triggers for updated_at
CREATE TRIGGER update_quant_strategies_updated_at BEFORE UPDATE ON public.quant_strategies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
