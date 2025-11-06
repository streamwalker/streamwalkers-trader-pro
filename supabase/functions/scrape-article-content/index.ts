import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeArticleRequest {
  articleId?: string;
  url?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: ScrapeArticleRequest = await req.json();
    
    let articleUrl = requestData.url;
    let articleId = requestData.articleId;

    // If articleId provided, fetch URL from database
    if (articleId && !articleUrl) {
      const { data: article } = await supabase
        .from('economic_news')
        .select('url')
        .eq('id', articleId)
        .single();
      
      if (article) {
        articleUrl = article.url;
      }
    }

    if (!articleUrl) {
      throw new Error('No URL provided');
    }

    console.log(`Scraping full article: ${articleUrl}`);

    // Scrape full article content with Firecrawl
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: articleUrl,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    if (!scrapeResponse.ok) {
      throw new Error(`Firecrawl error: ${scrapeResponse.status}`);
    }

    const scrapeData = await scrapeResponse.json();
    const content = scrapeData.data?.markdown || '';
    const html = scrapeData.data?.html || '';

    // Extract metadata from HTML
    const metadata = extractMetadata(html, content);

    // Analyze with AI if Lovable API key is available
    let aiAnalysis = null;
    if (lovableKey && content) {
      try {
        aiAnalysis = await analyzeWithAI(content, lovableKey);
      } catch (error) {
        console.error('AI analysis failed:', error);
      }
    }

    // Update database with scraped content
    const updateData: any = {
      content: content,
      summary: aiAnalysis?.summary || metadata.summary,
      sentiment: aiAnalysis?.sentiment,
      symbols: aiAnalysis?.symbols || [],
      keywords: aiAnalysis?.keywords || [],
      ai_processed: !!aiAnalysis,
      updated_at: new Date().toISOString(),
    };

    if (metadata.publishedDate) {
      updateData.published_at = metadata.publishedDate;
    }

    const { data: updatedArticle, error: updateError } = await supabase
      .from('economic_news')
      .update(updateData)
      .eq(articleId ? 'id' : 'url', articleId || articleUrl)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('Article scraped and analyzed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        article: updatedArticle,
        aiAnalysis,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-article-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractMetadata(html: string, markdown: string) {
  const metadata: any = {};

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) {
    metadata.summary = descMatch[1].trim();
  }

  // Extract published date
  const dateMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
  if (dateMatch) {
    metadata.publishedDate = dateMatch[1];
  }

  // Fallback: extract first paragraph as summary
  if (!metadata.summary && markdown) {
    const lines = markdown.split('\n');
    const firstParagraph = lines.find(line => line.trim().length > 50 && !line.startsWith('#'));
    if (firstParagraph) {
      metadata.summary = firstParagraph.trim().substring(0, 300);
    }
  }

  return metadata;
}

async function analyzeWithAI(content: string, apiKey: string) {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `Analyze this financial news article and extract:
1. Sentiment: positive, negative, or neutral
2. Stock symbols mentioned (array of ticker symbols like AAPL, TSLA)
3. Key topics/keywords (array of 3-5 important keywords)
4. One-sentence summary

Return ONLY valid JSON: {"sentiment": "positive|negative|neutral", "symbols": ["AAPL"], "keywords": ["inflation", "fed"], "summary": "One sentence summary"}`
      }, {
        role: 'user',
        content: content.substring(0, 8000)
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const result = await response.json();
  const analysisText = result.choices[0].message.content;
  
  try {
    return JSON.parse(analysisText);
  } catch {
    console.error('Failed to parse AI response:', analysisText);
    return null;
  }
}
