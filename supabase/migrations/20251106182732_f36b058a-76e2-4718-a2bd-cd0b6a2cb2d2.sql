-- Create alert_notifications_log table
CREATE TABLE alert_notifications_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES scraping_alerts(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('assignment', 'escalation', 'status_change', 'bulk_assignment')),
  recipient_user_id uuid REFERENCES auth.users(id),
  recipient_email text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  delivery_status text DEFAULT 'sent',
  resend_message_id text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alert_notifications_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON alert_notifications_log
  FOR SELECT
  USING (auth.uid() = recipient_user_id);

-- System can insert notifications
CREATE POLICY "System can create notifications"
  ON alert_notifications_log
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_alert_notifications_alert_id ON alert_notifications_log(alert_id);
CREATE INDEX idx_alert_notifications_recipient ON alert_notifications_log(recipient_user_id);
CREATE INDEX idx_alert_notifications_sent_at ON alert_notifications_log(sent_at DESC);

-- Create alert_escalation_rules table
CREATE TABLE alert_escalation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity text NOT NULL CHECK (severity IN ('critical', 'error', 'warning')),
  escalation_time_minutes integer NOT NULL DEFAULT 60,
  reassign_to_role text,
  notify_email text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alert_escalation_rules ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view escalation rules
CREATE POLICY "Authenticated users can view escalation rules"
  ON alert_escalation_rules
  FOR SELECT
  USING (true);

-- Only admins can manage escalation rules (for now, allow all authenticated)
CREATE POLICY "Authenticated users can manage escalation rules"
  ON alert_escalation_rules
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default escalation rules
INSERT INTO alert_escalation_rules (severity, escalation_time_minutes) VALUES
  ('critical', 30),
  ('error', 120),
  ('warning', 240);

-- Add escalation tracking columns to scraping_alerts
ALTER TABLE scraping_alerts
ADD COLUMN IF NOT EXISTS escalated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS escalation_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_escalated_at timestamptz,
ADD COLUMN IF NOT EXISTS escalated_to uuid REFERENCES auth.users(id);

-- Create indexes for escalation queries
CREATE INDEX idx_scraping_alerts_escalation_check 
  ON scraping_alerts(status, severity, detected_at) 
  WHERE status NOT IN ('resolved', 'false_positive');

-- Create cron job for alert escalation (runs every 15 minutes)
SELECT cron.schedule(
  'escalate-unresolved-alerts',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://tfcnxybvwcxfuksnqngq.supabase.co/functions/v1/escalate-alerts',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmY254eWJ2d2N4ZnVrc25xbmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mzc0MTcsImV4cCI6MjA2MzMxMzQxN30.NCpKnawX8_TBY7mbRX4dPznCTBGNaiSmIixNR4_j6FY"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);