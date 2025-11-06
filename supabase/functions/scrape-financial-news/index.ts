import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  sourceId?: string;
  url?: string;
  forceRefresh?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: ScrapeRequest = await req.json();
    
    console.log('Starting scrape with params:', requestData);

    // Fetch news source configuration
    let query = supabase.from('news_sources').select('*').eq('is_active', true);
    
    if (requestData.sourceId) {
      query = query.eq('id', requestData.sourceId);
    }
    
    const { data: sources, error: sourcesError } = await query;
    
    if (sourcesError) throw sourcesError;
    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active news sources found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      articlesScraped: 0,
      newArticles: 0,
      duplicates: 0,
      errors: [] as string[],
    };

    // Process each source
    for (const source of sources) {
      const startTime = Date.now();
      // Check if we should scrape based on interval
      if (!requestData.forceRefresh && source.last_scraped_at) {
        const lastScraped = new Date(source.last_scraped_at);
        const now = new Date();
        const minutesSinceLastScrape = (now.getTime() - lastScraped.getTime()) / 1000 / 60;
        
        if (minutesSinceLastScrape < source.scrape_interval_minutes) {
          console.log(`Skipping ${source.name}, scraped ${Math.floor(minutesSinceLastScrape)} minutes ago`);
          continue;
        }
      }

      console.log(`Scraping ${source.name}...`);

      // Process each URL for this source
      for (const url of source.scrape_urls) {
        try {
          // Rate limiting: wait 2 seconds between requests
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Scrape with Firecrawl
          const scrapeResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              formats: ['markdown', 'html'],
              onlyMainContent: true,
              waitFor: 3000,
            }),
          });

          if (!scrapeResponse.ok) {
            const errorText = await scrapeResponse.text();
            throw new Error(`Firecrawl error (${scrapeResponse.status}): ${errorText}`);
          }

          const scrapeData = await scrapeResponse.json();
          results.articlesScraped++;

          // Extract article links from markdown
          const markdown = scrapeData.data?.markdown || '';
          const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
          let match;
          const articles = [];

          while ((match = linkPattern.exec(markdown)) !== null) {
            const [, title, articleUrl] = match;
            
            // Filter for actual article URLs (not navigation links)
            if (isArticleUrl(articleUrl, source.name)) {
              articles.push({
                title: cleanTitle(title),
                url: normalizeUrl(articleUrl, source.base_url),
                source: source.name,
              });
            }
          }

          // Insert articles into database (dedup by URL)
          for (const article of articles) {
            const { error: insertError } = await supabase
              .from('economic_news')
              .insert({
                title: article.title,
                url: article.url,
                source: article.source,
                published_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (insertError) {
              if (insertError.code === '23505') {
                // Duplicate URL
                results.duplicates++;
              } else {
                console.error('Insert error:', insertError);
                results.errors.push(`Failed to insert ${article.url}: ${insertError.message}`);
              }
            } else {
              results.newArticles++;
            }
          }

        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          results.errors.push(`${url}: ${error.message}`);
        }
      }

      // Update last_scraped_at timestamp
      await supabase
        .from('news_sources')
        .update({ last_scraped_at: new Date().toISOString() })
        .eq('id', source.id);

      // Log scraping attempt
      const executionTime = Date.now() - startTime;
      const sourceResults = {
        articlesFound: results.articlesScraped,
        newArticles: results.newArticles,
        duplicates: results.duplicates,
      };

      await supabase.from('scraping_logs').insert({
        source_id: source.id,
        source_name: source.name,
        status: results.errors.length > 0 ? 'partial' : 'success',
        articles_found: sourceResults.articlesFound,
        new_articles: sourceResults.newArticles,
        duplicates: sourceResults.duplicates,
        error_message: results.errors.length > 0 ? results.errors.join('; ') : null,
        execution_time_ms: executionTime,
        triggered_by: requestData.forceRefresh ? 'manual' : 'automatic',
      });
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

// Helper functions
function isArticleUrl(url: string, source: string): boolean {
  // Filter out navigation, footer, and external links
  const excludePatterns = [
    '/about', '/contact', '/privacy', '/terms',
    'facebook.com', 'twitter.com', 'linkedin.com',
    '/newsletter', '/subscribe', 'mailto:',
    '#', 'javascript:'
  ];
  
  const lowerUrl = url.toLowerCase();
  
  if (excludePatterns.some(pattern => lowerUrl.includes(pattern))) {
    return false;
  }
  
  // Must contain typical article indicators
  const articleIndicators = [
    '/article/', '/story/', '/news/', '/market',
    '/business/', '/economy/', '/finance/',
    '-', 'html'
  ];
  
  return articleIndicators.some(indicator => lowerUrl.includes(indicator));
}

function cleanTitle(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 300);
}

function normalizeUrl(url: string, baseUrl: string): string {
  try {
    // If relative URL, make it absolute
    if (url.startsWith('/')) {
      return new URL(url, baseUrl).href;
    }
    return url;
  } catch {
    return url;
  }
}
