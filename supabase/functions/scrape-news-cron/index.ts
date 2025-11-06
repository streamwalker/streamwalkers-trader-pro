import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting automated news scraping...');

    // Fetch all active news sources that need scraping
    const { data: sources, error: sourcesError } = await supabase
      .from('news_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) throw sourcesError;

    const sourcesToScrape = sources.filter(source => {
      if (!source.last_scraped_at) return true;
      
      const lastScraped = new Date(source.last_scraped_at);
      const now = new Date();
      const minutesSinceLastScrape = (now.getTime() - lastScraped.getTime()) / 1000 / 60;
      
      return minutesSinceLastScrape >= source.scrape_interval_minutes;
    });

    console.log(`Found ${sourcesToScrape.length} sources to scrape`);

    const results = {
      sourcesProcessed: 0,
      totalArticles: 0,
      errors: [] as string[],
    };

    // Call scrape-financial-news for each source
    for (const source of sourcesToScrape) {
      try {
        const scrapeResponse = await supabase.functions.invoke('scrape-financial-news', {
          body: { sourceId: source.id }
        });

        if (scrapeResponse.error) {
          throw scrapeResponse.error;
        }

        results.sourcesProcessed++;
        results.totalArticles += scrapeResponse.data?.newArticles || 0;
        
        console.log(`Scraped ${source.name}: ${scrapeResponse.data?.newArticles || 0} new articles`);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        results.errors.push(`${source.name}: ${error.message}`);
      }

      // Rate limiting between sources
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('Automated scraping complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-news-cron:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
