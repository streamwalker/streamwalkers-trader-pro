-- Add assignment columns to scraping_alerts table
ALTER TABLE scraping_alerts 
ADD COLUMN assigned_to uuid REFERENCES auth.users(id),
ADD COLUMN assigned_at timestamp with time zone,
ADD COLUMN assigned_by uuid REFERENCES auth.users(id);

-- Add indexes for better performance (only new ones)
CREATE INDEX IF NOT EXISTS idx_scraping_alerts_assigned_to ON scraping_alerts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_scraping_alerts_resolved_at ON scraping_alerts(resolved_at);
CREATE INDEX IF NOT EXISTS idx_scraping_alerts_status_detected ON scraping_alerts(status, detected_at);
CREATE INDEX IF NOT EXISTS idx_alert_status_history_alert_id ON alert_status_history(alert_id, created_at);

-- Create cron jobs for automated email reports
SELECT cron.schedule(
  'send-daily-scraping-reports',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://tfcnxybvwcxfuksnqngq.supabase.co/functions/v1/send-scraping-report',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmY254eWJ2d2N4ZnVrc25xbmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mzc0MTcsImV4cCI6MjA2MzMxMzQxN30.NCpKnawX8_TBY7mbRX4dPznCTBGNaiSmIixNR4_j6FY"}'::jsonb,
    body:='{"automated": true, "frequency": "daily"}'::jsonb
  ) AS request_id;
  $$
);

SELECT cron.schedule(
  'send-weekly-scraping-reports',
  '0 8 * * 1',
  $$
  SELECT net.http_post(
    url:='https://tfcnxybvwcxfuksnqngq.supabase.co/functions/v1/send-scraping-report',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmY254eWJ2d2N4ZnVrc25xbmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mzc0MTcsImV4cCI6MjA2MzMxMzQxN30.NCpKnawX8_TBY7mbRX4dPznCTBGNaiSmIixNR4_j6FY"}'::jsonb,
    body:='{"automated": true, "frequency": "weekly"}'::jsonb
  ) AS request_id;
  $$
);