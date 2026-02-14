import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

    const results = {
      sourcesProcessed: 0,
      totalArticles: 0,
      methods: [] as string[],
      errors: [] as string[],
    };

    // Step 1: Call the main scrape function (NewsData.io + RSS)
    try {
      const scrapeResponse = await supabase.functions.invoke('scrape-financial-news', {
        body: { method: 'all', forceRefresh: true }
      });

      if (scrapeResponse.error) {
        throw scrapeResponse.error;
      }

      const data = scrapeResponse.data;
      results.totalArticles += data?.newArticles || 0;
      results.methods.push(...(data?.sources || []));
      results.sourcesProcessed++;
      console.log(`Main scrape: ${data?.newArticles || 0} new, ${data?.duplicates || 0} dupes`);
    } catch (error) {
      console.error('Main scrape failed:', error.message || error);
      results.errors.push(`scrape-financial-news: ${error.message || 'Unknown error'}`);
    }

    // Step 2: Try dedicated NewsData.io as backup if main scrape had errors
    if (results.errors.length > 0) {
      try {
        const newsResponse = await supabase.functions.invoke('fetch-news-api', {
          body: { category: 'business', size: 20 }
        });

        if (!newsResponse.error && newsResponse.data) {
          results.totalArticles += newsResponse.data.newArticles || 0;
          results.methods.push('fetch-news-api-backup');
          console.log(`Backup NewsData.io: ${newsResponse.data.newArticles || 0} new`);
        }
      } catch (error) {
        console.error('Backup news fetch failed:', error.message || error);
        results.errors.push(`fetch-news-api: ${error.message || 'Unknown error'}`);
      }
    }

    // Log overall health
    const isHealthy = results.totalArticles > 0 || results.errors.length === 0;
    console.log(`Automated scraping complete. Healthy: ${isHealthy}`, results);

    if (!isHealthy && results.errors.length > 0) {
      console.error('ALL scraping methods failed:', results.errors);
    }

    return new Response(
      JSON.stringify({ success: true, ...results }),
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
