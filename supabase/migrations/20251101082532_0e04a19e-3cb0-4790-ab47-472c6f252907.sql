-- Create economic events table
CREATE TABLE public.economic_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  description TEXT NOT NULL,
  affected_sectors JSONB DEFAULT '[]'::jsonb,
  impact_timeline JSONB DEFAULT '{}'::jsonb,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cycle tracking table
CREATE TABLE public.cycle_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_type VARCHAR(50) NOT NULL,
  current_phase VARCHAR(30) NOT NULL,
  phase_start_date DATE NOT NULL,
  indicator_values JSONB DEFAULT '{}'::jsonb,
  historical_context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES economic_events(id) ON DELETE CASCADE,
  prediction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  predicted_impact JSONB DEFAULT '{}'::jsonb,
  actual_impact JSONB DEFAULT '{}'::jsonb,
  accuracy_score DECIMAL(3,2) CHECK (accuracy_score >= 0 AND accuracy_score <= 1),
  trade_recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sector impact mapping table
CREATE TABLE public.sector_impacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  impact_order INTEGER NOT NULL CHECK (impact_order >= 1 AND impact_order <= 4),
  impact_direction VARCHAR(10) CHECK (impact_direction IN ('positive', 'negative', 'neutral')),
  typical_delay_days INTEGER,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  historical_examples JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_economic_events_type ON public.economic_events(event_type);
CREATE INDEX idx_economic_events_start_date ON public.economic_events(start_date);
CREATE INDEX idx_cycle_indicators_type ON public.cycle_indicators(cycle_type);
CREATE INDEX idx_predictions_event ON public.predictions(event_id);
CREATE INDEX idx_sector_impacts_event_type ON public.sector_impacts(event_type);
CREATE INDEX idx_sector_impacts_sector ON public.sector_impacts(sector);

-- Enable RLS
ALTER TABLE public.economic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_impacts ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access for all authenticated users)
CREATE POLICY "Authenticated users can view economic events" 
ON public.economic_events FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can view cycle indicators" 
ON public.cycle_indicators FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can view predictions" 
ON public.predictions FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can view sector impacts" 
ON public.sector_impacts FOR SELECT 
TO authenticated USING (true);

-- Create update trigger for economic_events
CREATE TRIGGER update_economic_events_updated_at
BEFORE UPDATE ON public.economic_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create update trigger for cycle_indicators
CREATE TRIGGER update_cycle_indicators_updated_at
BEFORE UPDATE ON public.cycle_indicators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();