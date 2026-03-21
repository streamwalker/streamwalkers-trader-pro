import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapeRequest {
  sourceId?: string;
  forceRefresh?: boolean;
  method?: 'newsdata' | 'rss' | 'all';
}

interface ArticleData {
  title: string;
  url: string;
  source: string;
  summary?: string;
  published_at?: string;
  sentiment?: string;
  keywords?: string[];
  symbols?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const isServiceRole = token === supabaseKey;

    if (!isServiceRole) {
      const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const newsDataKey = Deno.env.get('NEWSDATA_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestData: ScrapeRequest = await req.json().catch(() => ({}));
    const method = requestData.method || 'all';

    console.log('Starting news scrape:', { method, sourceId: requestData.sourceId });

    const results = {
      articlesScraped: 0,
      newArticles: 0,
      duplicates: 0,
      errors: [] as string[],
      sources: [] as string[],
    };

    // ===== TIER 1: NewsData.io API =====
    if ((method === 'all' || method === 'newsdata') && newsDataKey) {
      try {
        console.log('Fetching from NewsData.io...');
        const newsDataArticles = await fetchFromNewsDataAPI(newsDataKey);
        results.sources.push('NewsData.io');
        
        for (const article of newsDataArticles) {
          const inserted = await upsertArticle(supabase, article);
          if (inserted === 'new') results.newArticles++;
          else if (inserted === 'duplicate') results.duplicates++;
          results.articlesScraped++;
        }
        console.log(`NewsData.io: ${newsDataArticles.length} articles fetched`);
      } catch (error) {
        console.error('NewsData.io failed:', error.message);
        results.errors.push(`NewsData.io: ${error.message}`);
      }
    }

    // ===== TIER 2: RSS Feeds =====
    if (method === 'all' || method === 'rss') {
      try {
        console.log('Fetching from RSS feeds...');

        // Get RSS URLs from news_sources table
        let rssQuery = supabase
          .from('news_sources')
          .select('*')
          .eq('is_active', true)
          .not('rss_url', 'is', null);

        if (requestData.sourceId) {
          rssQuery = rssQuery.eq('id', requestData.sourceId);
        }

        const { data: rssSources } = await rssQuery;

        // Also try hardcoded RSS feeds as fallback
        const defaultFeeds = [
          { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
          { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/' },
          { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
        ];

        const feedsToProcess = rssSources?.length
          ? rssSources.map(s => ({ name: s.name, url: s.rss_url! }))
          : defaultFeeds;

        for (const feed of feedsToProcess) {
          try {
            const rssArticles = await fetchFromRSSFeed(feed.url, feed.name);
            results.sources.push(`RSS:${feed.name}`);

            for (const article of rssArticles) {
              const inserted = await upsertArticle(supabase, article);
              if (inserted === 'new') results.newArticles++;
              else if (inserted === 'duplicate') results.duplicates++;
              results.articlesScraped++;
            }
            console.log(`RSS ${feed.name}: ${rssArticles.length} articles`);
          } catch (error) {
            console.error(`RSS ${feed.name} failed:`, error.message);
            results.errors.push(`RSS ${feed.name}: ${error.message}`);
          }
          // Small delay between feeds
          await new Promise(r => setTimeout(r, 500));
        }
      } catch (error) {
        console.error('RSS feeds failed:', error.message);
        results.errors.push(`RSS: ${error.message}`);
      }
    }

    // Update last_scraped_at for processed sources
    if (requestData.sourceId) {
      await supabase
        .from('news_sources')
        .update({ last_scraped_at: new Date().toISOString() })
        .eq('id', requestData.sourceId);
    } else {
      await supabase
        .from('news_sources')
        .update({ last_scraped_at: new Date().toISOString() })
        .eq('is_active', true);
    }

    console.log('Scrape complete:', results);

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-financial-news:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ===== NewsData.io Integration =====
async function fetchFromNewsDataAPI(apiKey: string): Promise<ArticleData[]> {
  const categories = ['business', 'technology'];
  const articles: ArticleData[] = [];

  for (const category of categories) {
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=${category}&language=en&size=10`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`NewsData.io ${response.status}: ${text}`);
    }

    const data = await response.json();
    
    if (data.results) {
      for (const item of data.results) {
        if (!item.title || !item.link) continue;

        articles.push({
          title: item.title.substring(0, 300),
          url: item.link,
          source: item.source_name || item.source_id || 'NewsData.io',
          summary: item.description?.substring(0, 500) || null,
          published_at: item.pubDate || new Date().toISOString(),
          sentiment: mapNewsDataSentiment(item.sentiment),
          keywords: item.keywords || [],
          symbols: extractSymbolsFromText(item.title + ' ' + (item.description || '')),
        });
      }
    }

    // Respect rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  return articles;
}

function mapNewsDataSentiment(sentiment: string | null): string | undefined {
  if (!sentiment) return undefined;
  const lower = sentiment.toLowerCase();
  if (lower === 'positive' || lower === 'bullish') return 'positive';
  if (lower === 'negative' || lower === 'bearish') return 'negative';
  return 'neutral';
}

// ===== RSS Feed Parsing =====
async function fetchFromRSSFeed(feedUrl: string, sourceName: string): Promise<ArticleData[]> {
  const response = await fetch(feedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`);
  }

  const xml = await response.text();
  return parseRSSXML(xml, sourceName);
}

function parseRSSXML(xml: string, sourceName: string): ArticleData[] {
  const articles: ArticleData[] = [];
  
  // Extract items from RSS XML using regex (no XML parser in Deno edge functions)
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemXml = itemMatch[1];
    
    const title = extractXMLTag(itemXml, 'title');
    const link = extractXMLTag(itemXml, 'link');
    const description = extractXMLTag(itemXml, 'description');
    const pubDate = extractXMLTag(itemXml, 'pubDate');

    if (!title || !link) continue;

    articles.push({
      title: cleanHTMLEntities(title).substring(0, 300),
      url: link.trim(),
      source: sourceName,
      summary: description ? cleanHTMLEntities(stripHTML(description)).substring(0, 500) : undefined,
      published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      symbols: extractSymbolsFromText(title + ' ' + (description || '')),
    });
  }

  return articles;
}

function extractXMLTag(xml: string, tag: string): string | null {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function cleanHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

// ===== Common Helpers =====
function extractSymbolsFromText(text: string): string[] {
  const knownSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA', 'NVDA', 
    'NFLX', 'AMD', 'INTC', 'PLTR', 'QBTS', 'RGTI', 'QUBT', 'QTUM',
    'JPM', 'BAC', 'GS', 'WMT', 'DIS', 'PYPL', 'SQ', 'COIN',
    'BTC', 'ETH', 'SPY', 'QQQ', 'IWM', 'VIX',
  ];
  
  const found: string[] = [];
  const upperText = text.toUpperCase();
  
  for (const symbol of knownSymbols) {
    if (upperText.includes(symbol)) {
      found.push(symbol);
    }
  }
  
  return [...new Set(found)];
}

async function upsertArticle(
  supabase: any, 
  article: ArticleData
): Promise<'new' | 'duplicate' | 'error'> {
  try {
    // Check for existing article by URL
    const { data: existing } = await supabase
      .from('economic_news')
      .select('id')
      .eq('url', article.url)
      .maybeSingle();

    if (existing) return 'duplicate';

    const { error } = await supabase
      .from('economic_news')
      .insert({
        title: article.title,
        url: article.url,
        source: article.source,
        summary: article.summary || null,
        published_at: article.published_at || new Date().toISOString(),
        sentiment: article.sentiment || null,
        keywords: article.keywords || [],
        symbols: article.symbols || [],
        scraped_at: new Date().toISOString(),
      });

    if (error) {
      if (error.code === '23505') return 'duplicate';
      console.error('Insert error:', error);
      return 'error';
    }

    return 'new';
  } catch (error) {
    console.error('Upsert error:', error);
    return 'error';
  }
}
