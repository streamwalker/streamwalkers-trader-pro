

## Comprehensive Fix Plan for Newsfeed Edge Functions

### **Phase 1: Replace Firecrawl with Free Alternatives in `scrape-financial-news`**

**Problem:** The function depends entirely on Firecrawl API which has exhausted credits.

**Solution:** Implement a multi-tier approach using FREE data sources:

#### 1.1 Primary Method: NewsData.io API Integration
- You already have `NEWSDATA_API_KEY` configured
- NewsData.io provides free tier with 200 requests/day
- Fetch articles by category (business, finance, economy)
- Direct API response with title, description, URL, sentiment

#### 1.2 Secondary Method: RSS Feed Parsing
Add RSS feeds (completely free, no API limits):
```
- Bloomberg: https://feeds.bloomberg.com/markets/news.rss
- Reuters: https://www.reutersagency.com/feed/
- CNBC: https://www.cnbc.com/id/100003114/device/rss/rss.html
- MarketWatch: https://feeds.marketwatch.com/marketwatch/topstories/
```

#### 1.3 Tertiary Method: Direct Fetch Fallback
- Use browser-like User-Agent headers
- Basic HTML parsing for article extraction
- Only used if other methods fail

**Updated `scrape-financial-news/index.ts` structure:**
```typescript
// 1. Try NewsData.io API first (has sentiment analysis built-in)
// 2. Try RSS feeds for additional sources
// 3. Fallback to direct fetch with proper headers
// 4. Store results in economic_news table
```

---

### **Phase 2: Fix `scrape-article-content` with Fallback Scraping**

**Problem:** Can't fetch full article content when Firecrawl fails.

**Solution:** Implement graceful degradation:

#### 2.1 Primary Method: Direct Fetch with Browser Headers
```typescript
const headers = {
  'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
  'Accept': 'text/html,application/xhtml+xml',
};
```

#### 2.2 HTML Content Extraction
- Parse HTML using regex patterns for article content
- Extract `<article>`, `<main>`, or `<div class="article-body">`
- Extract meta tags for description and published date

#### 2.3 Optional Firecrawl (Only if API Key Has Credits)
- Check Firecrawl first but don't fail if it errors
- Log warning and continue with fallback

**Updated flow:**
```
1. Try Firecrawl (if available) → If fails (402/429), continue
2. Direct fetch with proper headers
3. Parse HTML for main content
4. AI analysis with Lovable API (unchanged)
5. Store in database
```

---

### **Phase 3: Create New Edge Function `fetch-news-api`**

**Purpose:** Dedicated function for NewsData.io that can be called directly or as fallback.

**Features:**
- Fetch by category: business, technology, politics, economy
- Fetch by keyword/symbol: Search for specific stocks
- Built-in sentiment from NewsData.io
- Rate limiting awareness (200 req/day on free tier)

---

### **Phase 4: Update `news_sources` Table with RSS URLs**

Add `rss_url` column to support RSS parsing:

```sql
ALTER TABLE news_sources ADD COLUMN rss_url text;

UPDATE news_sources SET rss_url = 'https://feeds.bloomberg.com/markets/news.rss' WHERE name = 'Bloomberg';
UPDATE news_sources SET rss_url = 'https://www.reutersagency.com/feed/' WHERE name = 'Reuters';
UPDATE news_sources SET rss_url = 'https://www.cnbc.com/id/100003114/device/rss/rss.html' WHERE name = 'CNBC';
UPDATE news_sources SET rss_url = 'https://feeds.marketwatch.com/marketwatch/topstories/' WHERE name = 'MarketWatch';
```

---

### **Phase 5: Update `scrape-news-cron` for Better Resilience**

**Improvements:**
- Add health check before calling scrape functions
- Better error aggregation and reporting
- Don't stop entire cron if one source fails
- Send notification if all sources fail

---

### **Phase 6: Frontend Updates**

**Update `ScrapedNewsFeed.tsx`:**
- Show scraping status/health indicator
- Display data source (RSS, NewsData.io, Cached)
- Better error messaging when scraping fails
- Manual "Refresh from NewsData.io" button

---

## Implementation Details

### **File Changes:**

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/scrape-financial-news/index.ts` | **Rewrite** | Replace Firecrawl with NewsData.io + RSS |
| `supabase/functions/scrape-article-content/index.ts` | **Update** | Add fallback scraping, make Firecrawl optional |
| `supabase/functions/fetch-news-api/index.ts` | **Create** | New dedicated NewsData.io function |
| `supabase/functions/scrape-news-cron/index.ts` | **Update** | Better error handling, use new methods |
| `supabase/config.toml` | **Update** | Add new function configuration |
| `src/hooks/useNewsFeed.ts` | **Update** | Add fetchFromNewsAPI option |
| `src/components/ScrapedNewsFeed.tsx` | **Update** | Add status indicator, NewsData.io button |
| Database migration | **Create** | Add `rss_url` column to `news_sources` |

### **Key Code Changes:**

**New `scrape-financial-news/index.ts` (simplified):**
```typescript
// Step 1: Fetch from NewsData.io API
const newsDataArticles = await fetchFromNewsDataAPI(newsDataKey);

// Step 2: Fetch from RSS feeds
const rssArticles = await fetchFromRSSFeeds(sources);

// Step 3: Merge and deduplicate
const allArticles = deduplicateByUrl([...newsDataArticles, ...rssArticles]);

// Step 4: Store in database (upsert by URL)
for (const article of allArticles) {
  await supabase.from('economic_news').upsert(article, { onConflict: 'url' });
}
```

**New `scrape-article-content/index.ts` (fallback logic):**
```typescript
let content = null;

// Try Firecrawl first (if key exists and has credits)
if (firecrawlKey) {
  try {
    content = await scrapeWithFirecrawl(articleUrl, firecrawlKey);
  } catch (error) {
    console.warn('Firecrawl failed, using fallback:', error.message);
  }
}

// Fallback: Direct fetch with HTML parsing
if (!content) {
  content = await scrapeWithDirectFetch(articleUrl);
}

// Continue with AI analysis...
```

---

## Benefits of This Approach

1. **Zero Cost** - NewsData.io free tier + RSS feeds = completely free
2. **Reliability** - Multiple fallback methods ensure news keeps flowing
3. **Better Data** - NewsData.io includes sentiment analysis built-in
4. **No Breaking Changes** - Same database schema, same frontend API
5. **Future-Proof** - Easy to add premium APIs later if needed

---

## Estimated Timeline

- Phase 1-2: 1-2 hours (core functionality)
- Phase 3-4: 30 minutes (new function + migration)
- Phase 5-6: 30 minutes (cron + frontend updates)
- Testing: 30 minutes

**Total: ~3 hours**

