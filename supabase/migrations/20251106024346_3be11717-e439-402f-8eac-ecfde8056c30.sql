-- Create economic_news table for storing scraped articles
CREATE TABLE economic_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text,
  url text UNIQUE NOT NULL,
  source text NOT NULL,
  published_at timestamptz,
  scraped_at timestamptz DEFAULT now(),
  sentiment text CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  keywords text[],
  symbols text[],
  ai_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_economic_news_source ON economic_news(source);
CREATE INDEX idx_economic_news_published ON economic_news(published_at DESC);
CREATE INDEX idx_economic_news_symbols ON economic_news USING gin(symbols);
CREATE INDEX idx_economic_news_ai_processed ON economic_news(ai_processed);
CREATE INDEX idx_economic_news_scraped_at ON economic_news(scraped_at DESC);

-- Create news_sources configuration table
CREATE TABLE news_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  base_url text NOT NULL,
  scrape_urls text[] NOT NULL,
  is_active boolean DEFAULT true,
  scrape_interval_minutes integer DEFAULT 240,
  last_scraped_at timestamptz,
  scrape_strategy jsonb DEFAULT '{"type": "article_list"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default news sources
INSERT INTO news_sources (name, base_url, scrape_urls, scrape_interval_minutes) VALUES
  ('Bloomberg', 'https://www.bloomberg.com', ARRAY[
    'https://www.bloomberg.com/markets',
    'https://www.bloomberg.com/economics'
  ], 240),
  ('MarketWatch', 'https://www.marketwatch.com', ARRAY[
    'https://www.marketwatch.com/latest-news',
    'https://www.marketwatch.com/investing'
  ], 240),
  ('MSNBC', 'https://www.msnbc.com', ARRAY[
    'https://www.msnbc.com/business'
  ], 240),
  ('CNBC', 'https://www.cnbc.com', ARRAY[
    'https://www.cnbc.com/markets/'
  ], 240),
  ('Reuters', 'https://www.reuters.com', ARRAY[
    'https://www.reuters.com/business/',
    'https://www.reuters.com/markets/'
  ], 240);

-- Enable RLS
ALTER TABLE economic_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for economic_news
CREATE POLICY "Public users can view news"
  ON economic_news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public anon can view news"
  ON economic_news FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for news_sources
CREATE POLICY "Public users can view news sources"
  ON news_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public anon can view news sources"
  ON news_sources FOR SELECT
  TO anon
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_economic_news_updated_at
  BEFORE UPDATE ON economic_news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_sources_updated_at
  BEFORE UPDATE ON news_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();