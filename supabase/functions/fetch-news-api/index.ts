import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FetchNewsRequest {
  category?: string;
  query?: string;
  symbols?: string[];
  size?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const newsDataKey = Deno.env.get('NEWSDATA_API_KEY');

    if (!newsDataKey) throw new Error('NEWSDATA_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: FetchNewsRequest = await req.json().catch(() => ({}));

    const category = requestData.category || 'business';
    const size = Math.min(requestData.size || 10, 50);

    let url = `https://newsdata.io/api/1/latest?apikey=${newsDataKey}&language=en&size=${size}`;

    if (requestData.query) {
      url += `&q=${encodeURIComponent(requestData.query)}`;
    } else if (requestData.symbols?.length) {
      url += `&q=${encodeURIComponent(requestData.symbols.join(' OR '))}`;
    } else {
      url += `&category=${category}`;
    }

    console.log(`Fetching from NewsData.io: category=${category}, query=${requestData.query || 'none'}`);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`NewsData.io error ${response.status}: ${text}`);
    }

    const data = await response.json();
    const articles = data.results || [];

    let newCount = 0;
    let dupCount = 0;

    for (const item of articles) {
      if (!item.title || !item.link) continue;

      const { data: existing } = await supabase
        .from('economic_news')
        .select('id')
        .eq('url', item.link)
        .maybeSingle();

      if (existing) {
        dupCount++;
        continue;
      }

      const { error } = await supabase.from('economic_news').insert({
        title: item.title.substring(0, 300),
        url: item.link,
        source: item.source_name || 'NewsData.io',
        summary: item.description?.substring(0, 500) || null,
        published_at: item.pubDate || new Date().toISOString(),
        sentiment: item.sentiment?.toLowerCase() === 'positive' ? 'positive'
          : item.sentiment?.toLowerCase() === 'negative' ? 'negative'
          : item.sentiment ? 'neutral' : null,
        keywords: item.keywords || [],
        scraped_at: new Date().toISOString(),
      });

      if (error && error.code !== '23505') {
        console.error('Insert error:', error);
      } else if (!error) {
        newCount++;
      } else {
        dupCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalFetched: articles.length,
        newArticles: newCount,
        duplicates: dupCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-news-api:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
