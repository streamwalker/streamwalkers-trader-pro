-- Create webhook_configs table to store notification endpoints
CREATE TABLE webhook_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  webhook_url text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('slack', 'discord', 'custom')),
  is_active boolean DEFAULT true,
  alert_on_low_success_rate boolean DEFAULT true,
  alert_on_execution_spike boolean DEFAULT true,
  alert_on_consecutive_failures boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public users can manage webhooks
CREATE POLICY "Public users can view webhook configs"
  ON webhook_configs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public anon can view webhook configs"
  ON webhook_configs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public users can manage webhook configs"
  ON webhook_configs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for fast queries
CREATE INDEX idx_webhook_configs_active ON webhook_configs(is_active) WHERE is_active = true;