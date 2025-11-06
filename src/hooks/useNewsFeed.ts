import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  url: string;
  source: string;
  published_at: string | null;
  scraped_at: string;
  sentiment: 'positive' | 'negative' | 'neutral' | null;
  keywords: string[] | null;
  symbols: string[] | null;
  ai_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsSource {
  id: string;
  name: string;
  base_url: string;
  scrape_urls: string[];
  is_active: boolean;
  scrape_interval_minutes: number;
  last_scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useNewsFeed() {
  const queryClient = useQueryClient();

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ['economic_news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_news')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('scraped_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as NewsArticle[];
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: sources } = useQuery({
    queryKey: ['news_sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as NewsSource[];
    },
  });

  const triggerScrape = useMutation({
    mutationFn: async (sourceId?: string) => {
      const { data, error } = await supabase.functions.invoke('scrape-financial-news', {
        body: { sourceId, forceRefresh: true }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['economic_news'] });
      toast.success(`Scraped ${data.newArticles} new articles (${data.duplicates} duplicates)`);
    },
    onError: (error: Error) => {
      toast.error(`Scraping failed: ${error.message}`);
    }
  });

  const scrapeArticleContent = useMutation({
    mutationFn: async (params: { articleId: string }) => {
      const { data, error } = await supabase.functions.invoke('scrape-article-content', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic_news'] });
      toast.success('Full article content loaded');
    },
    onError: (error: Error) => {
      toast.error(`Failed to load article: ${error.message}`);
    }
  });

  return {
    news,
    sources,
    isLoading: newsLoading,
    triggerScrape,
    scrapeArticleContent,
  };
}
