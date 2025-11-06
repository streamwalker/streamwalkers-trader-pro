import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CronJob {
  jobid: number;
  jobname: string;
  schedule: string;
  active: boolean;
  command: string;
}

export interface ScrapingStats {
  totalScrapes: number;
  successfulScrapes: number;
  failedScrapes: number;
  successRate: number;
  lastScraped: string | null;
  articlesScraped: number;
  newArticles: number;
}

export function useCronMonitoring() {
  const queryClient = useQueryClient();

  // Fetch cron job status
  const { data: cronJobs, isLoading: cronLoading } = useQuery({
    queryKey: ['cron-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_cron_jobs');
      if (error) {
        console.error('Error fetching cron jobs:', error);
        return [];
      }
      return data as CronJob[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch news sources with scraping history
  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['news_sources_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .order('last_scraped_at', { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  // Calculate scraping statistics
  const { data: stats } = useQuery({
    queryKey: ['scraping-stats'],
    queryFn: async () => {
      const { data: articles, error } = await supabase
        .from('economic_news')
        .select('scraped_at, source')
        .order('scraped_at', { ascending: false });
      
      if (error) throw error;

      const stats: ScrapingStats = {
        totalScrapes: sources?.length || 0,
        successfulScrapes: sources?.filter(s => s.last_scraped_at).length || 0,
        failedScrapes: 0,
        successRate: 0,
        lastScraped: sources?.[0]?.last_scraped_at || null,
        articlesScraped: articles?.length || 0,
        newArticles: articles?.filter(a => {
          const scrapedDate = new Date(a.scraped_at);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return scrapedDate > oneDayAgo;
        }).length || 0,
      };

      stats.successRate = stats.totalScrapes > 0 
        ? (stats.successfulScrapes / stats.totalScrapes) * 100 
        : 0;

      return stats;
    },
    enabled: !!sources,
  });

  // Toggle cron job active status
  const toggleCronJob = useMutation({
    mutationFn: async (params: { jobId: number; active: boolean }) => {
      const { data, error } = await supabase.rpc('toggle_cron_job', {
        job_id: params.jobId,
        is_active: params.active
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cron-jobs'] });
      toast.success(
        variables.active 
          ? 'Automated scraping enabled' 
          : 'Automated scraping paused'
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to toggle cron job: ${error.message}`);
    }
  });

  // Manually trigger scraping
  const triggerManualScrape = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('scrape-news-cron', {
        body: { manual: true }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['news_sources_history'] });
      queryClient.invalidateQueries({ queryKey: ['economic_news'] });
      queryClient.invalidateQueries({ queryKey: ['scraping-stats'] });
      toast.success(`Scrape completed: ${data.totalArticles || 0} articles processed`);
    },
    onError: (error: Error) => {
      toast.error(`Manual scrape failed: ${error.message}`);
    }
  });

  return {
    cronJobs: cronJobs || [],
    sources: sources || [],
    stats,
    isLoading: cronLoading || sourcesLoading,
    toggleCronJob,
    triggerManualScrape,
  };
}
