-- Create dip analysis results table
CREATE TABLE dip_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  analysis_date date NOT NULL DEFAULT CURRENT_DATE,
  
  -- Overall Scoring
  dip_quality_score numeric(3,1) NOT NULL CHECK (dip_quality_score >= 0 AND dip_quality_score <= 10),
  dip_type text NOT NULL CHECK (dip_type IN ('type_a_buyable', 'type_b_trouble', 'neutral')),
  recommendation text NOT NULL CHECK (recommendation IN ('buy_dip', 'wait', 'sell_avoid')),
  confidence_level integer CHECK (confidence_level >= 0 AND confidence_level <= 100),
  
  -- 7-Point Analysis Breakdown
  trend_score numeric(2,1) CHECK (trend_score >= 0 AND trend_score <= 2),
  volume_score numeric(2,1) CHECK (volume_score >= 0 AND volume_score <= 2),
  catalyst_score numeric(2,1) CHECK (catalyst_score >= 0 AND catalyst_score <= 2),
  rsi_score numeric(2,1) CHECK (rsi_score >= 0 AND rsi_score <= 1),
  support_score numeric(2,1) CHECK (support_score >= 0 AND support_score <= 1),
  insider_score numeric(2,1) CHECK (insider_score >= 0 AND insider_score <= 1),
  options_flow_score numeric(2,1) CHECK (options_flow_score >= 0 AND options_flow_score <= 1),
  
  -- Detailed Analysis Data
  trend_data jsonb DEFAULT '{}'::jsonb,
  volume_data jsonb DEFAULT '{}'::jsonb,
  catalyst_data jsonb DEFAULT '{}'::jsonb,
  technical_data jsonb DEFAULT '{}'::jsonb,
  insider_data jsonb DEFAULT '{}'::jsonb,
  options_data jsonb DEFAULT '{}'::jsonb,
  
  -- Market Context
  current_price numeric(10,2),
  price_change_percent numeric(5,2),
  volume bigint,
  market_cap numeric(15,2),
  sector text,
  
  -- Metadata
  analysis_summary text,
  key_risks text[],
  key_opportunities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(symbol, analysis_date)
);

-- Create indexes
CREATE INDEX idx_dip_analysis_date ON dip_analysis_results(analysis_date DESC);
CREATE INDEX idx_dip_analysis_symbol ON dip_analysis_results(symbol);
CREATE INDEX idx_dip_analysis_score ON dip_analysis_results(dip_quality_score DESC);
CREATE INDEX idx_dip_analysis_recommendation ON dip_analysis_results(recommendation);
CREATE INDEX idx_dip_analysis_type ON dip_analysis_results(dip_type);

-- Enable RLS
ALTER TABLE dip_analysis_results ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view dip analysis
CREATE POLICY "Authenticated users can view dip analysis"
  ON dip_analysis_results FOR SELECT
  USING (true);

-- Create dip watchlist table
CREATE TABLE dip_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  target_dip_score numeric(3,1),
  is_active boolean DEFAULT true,
  alert_frequency text DEFAULT 'daily' CHECK (alert_frequency IN ('realtime', 'daily', 'weekly')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Enable RLS
ALTER TABLE dip_watchlist ENABLE ROW LEVEL SECURITY;

-- Users can manage their own watchlist
CREATE POLICY "Users can manage their own watchlist"
  ON dip_watchlist FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create dip analysis history table
CREATE TABLE dip_analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  analysis_date date NOT NULL,
  dip_quality_score numeric(3,1),
  recommendation text,
  price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create index for historical trending
CREATE INDEX idx_dip_history_symbol_date ON dip_analysis_history(symbol, analysis_date DESC);

-- Enable RLS
ALTER TABLE dip_analysis_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view history
CREATE POLICY "Authenticated users can view dip history"
  ON dip_analysis_history FOR SELECT
  USING (true);

-- Insert default watchlist for portfolio stocks
INSERT INTO dip_watchlist (user_id, symbol, is_active)
SELECT 
  id,
  symbol,
  true
FROM auth.users
CROSS JOIN (
  SELECT unnest(ARRAY['PLTR', 'QTUM', 'QBTS', 'MNTN', 'RGTI', 'QUBT', 'NFLX']) AS symbol
) symbols
ON CONFLICT (user_id, symbol) DO NOTHING;