-- Create scraping_logs table to track all scraping attempts
CREATE TABLE scraping_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES news_sources(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  articles_found integer DEFAULT 0,
  new_articles integer DEFAULT 0,
  duplicates integer DEFAULT 0,
  error_message text,
  execution_time_ms integer,
  triggered_by text DEFAULT 'automatic',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for fast queries
CREATE INDEX idx_scraping_logs_source_id ON scraping_logs(source_id);
CREATE INDEX idx_scraping_logs_status ON scraping_logs(status);
CREATE INDEX idx_scraping_logs_created_at ON scraping_logs(created_at DESC);

-- Enable RLS
ALTER TABLE scraping_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public users can view scraping logs"
  ON scraping_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public anon can view scraping logs"
  ON scraping_logs FOR SELECT
  TO anon
  USING (true);

-- Enable realtime
ALTER TABLE scraping_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE scraping_logs;