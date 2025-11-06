-- Create enum for alert severity
CREATE TYPE public.alert_severity AS ENUM ('warning', 'error', 'critical');

-- Create enum for alert status
CREATE TYPE public.alert_status AS ENUM ('pending', 'acknowledged', 'investigating', 'resolved', 'false_positive');

-- Create scraping_alerts table
CREATE TABLE public.scraping_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  severity public.alert_severity NOT NULL DEFAULT 'warning',
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  status public.alert_status NOT NULL DEFAULT 'pending',
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alert_status_history table for audit trail
CREATE TABLE public.alert_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID NOT NULL REFERENCES public.scraping_alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  old_status public.alert_status,
  new_status public.alert_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_report_configs table
CREATE TABLE public.email_report_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  report_types JSONB NOT NULL DEFAULT '["summary", "anomalies", "performance"]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, email, frequency)
);

-- Enable RLS
ALTER TABLE public.scraping_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_report_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scraping_alerts
CREATE POLICY "Authenticated users can view alerts"
  ON public.scraping_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update alerts"
  ON public.scraping_alerts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "System can create alerts"
  ON public.scraping_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for alert_status_history
CREATE POLICY "Authenticated users can view alert history"
  ON public.alert_status_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create alert history"
  ON public.alert_status_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for email_report_configs
CREATE POLICY "Users can manage their own report configs"
  ON public.email_report_configs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_scraping_alerts_status ON public.scraping_alerts(status);
CREATE INDEX idx_scraping_alerts_type ON public.scraping_alerts(alert_type);
CREATE INDEX idx_scraping_alerts_detected_at ON public.scraping_alerts(detected_at DESC);
CREATE INDEX idx_alert_history_alert_id ON public.alert_status_history(alert_id);
CREATE INDEX idx_email_configs_user_id ON public.email_report_configs(user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_scraping_alerts_updated_at
  BEFORE UPDATE ON public.scraping_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_report_configs_updated_at
  BEFORE UPDATE ON public.email_report_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for scraping_alerts
ALTER TABLE public.scraping_alerts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scraping_alerts;