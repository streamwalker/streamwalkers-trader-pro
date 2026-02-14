import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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
      if (article) articleUrl = article.url;
    }

    if (!articleUrl) throw new Error('No URL provided');

    console.log(`Scraping full article: ${articleUrl}`);

    let content: string | null = null;
    let html: string | null = null;

    // ===== TIER 1: Try Firecrawl (optional) =====
    if (firecrawlKey) {
      try {
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

        if (scrapeResponse.ok) {
          const scrapeData = await scrapeResponse.json();
          content = scrapeData.data?.markdown || null;
          html = scrapeData.data?.html || null;
          console.log('Firecrawl succeeded');
        } else {
          console.warn(`Firecrawl failed (${scrapeResponse.status}), using fallback`);
        }
      } catch (error) {
        console.warn('Firecrawl error, using fallback:', error.message);
      }
    }

    // ===== TIER 2: Direct fetch with HTML parsing =====
    if (!content) {
      try {
        console.log('Using direct fetch fallback...');
        const response = await fetch(articleUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
        });

        if (response.ok) {
          html = await response.text();
          content = extractArticleContent(html);
          console.log(`Direct fetch succeeded, content length: ${content?.length || 0}`);
        } else {
          console.warn(`Direct fetch failed: ${response.status}`);
        }
      } catch (error) {
        console.warn('Direct fetch error:', error.message);
      }
    }

    if (!content && !html) {
      throw new Error('All scraping methods failed');
    }

    // Extract metadata from HTML
    const metadata = extractMetadata(html || '', content || '');

    // Analyze with AI if Lovable API key is available
    let aiAnalysis = null;
    if (lovableKey && content) {
      try {
        aiAnalysis = await analyzeWithAI(content, lovableKey);
      } catch (error) {
        console.error('AI analysis failed:', error.message);
      }
    }

    // Update database
    const updateData: Record<string, any> = {
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
      JSON.stringify({ success: true, article: updatedArticle, aiAnalysis }),
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

function extractArticleContent(html: string): string {
  // Try to find article content in order of specificity
  const patterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*article[_-]?(body|content|text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*story[_-]?(body|content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*role="main"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const rawContent = match[match.length - 1]; // Use last capture group
      return stripHTMLToMarkdown(rawContent);
    }
  }

  // Fallback: extract all paragraph text
  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(html)) !== null) {
    const text = pMatch[1].replace(/<[^>]*>/g, '').trim();
    if (text.length > 40) paragraphs.push(text);
  }

  return paragraphs.join('\n\n');
}

function stripHTMLToMarkdown(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) => {
      return '\n' + '#'.repeat(parseInt(level)) + ' ' + text.replace(/<[^>]*>/g, '').trim() + '\n';
    })
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => text.replace(/<[^>]*>/g, '').trim() + '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractMetadata(html: string, markdown: string) {
  const metadata: Record<string, any> = {};

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) metadata.summary = descMatch[1].trim();

  const dateMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
  if (dateMatch) metadata.publishedDate = dateMatch[1];

  if (!metadata.summary && markdown) {
    const lines = markdown.split('\n');
    const firstParagraph = lines.find(line => line.trim().length > 50 && !line.startsWith('#'));
    if (firstParagraph) metadata.summary = firstParagraph.trim().substring(0, 300);
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

  if (!response.ok) throw new Error(`AI API error: ${response.status}`);

  const result = await response.json();
  const analysisText = result.choices[0].message.content;

  try {
    return JSON.parse(analysisText);
  } catch {
    console.error('Failed to parse AI response:', analysisText);
    return null;
  }
}
