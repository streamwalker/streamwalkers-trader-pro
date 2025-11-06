import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

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

export interface ScrapingLog {
  id: string;
  source_id: string;
  source_name: string;
  status: 'success' | 'error' | 'partial';
  articles_found: number;
  new_articles: number;
  duplicates: number;
  error_message: string | null;
  execution_time_ms: number;
  triggered_by: string;
  created_at: string;
}

export interface ChartDataPoint {
  date: string;
  articles: number;
  scrapes: number;
  success: number;
  errors: number;
}

export interface AnomalyThresholds {
  successRateThreshold: number;
  executionTimeSpikeMultiplier: number;
}

export function useCronMonitoring(thresholds?: AnomalyThresholds) {
  const queryClient = useQueryClient();
  
  // Use provided thresholds or defaults
  const SUCCESS_RATE_THRESHOLD = thresholds?.successRateThreshold ?? 70;
  const EXECUTION_TIME_SPIKE_MULTIPLIER = thresholds?.executionTimeSpikeMultiplier ?? 2.5;

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

  // Fetch scraping logs for charts
  const { data: logs } = useQuery({
    queryKey: ['scraping-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as ScrapingLog[];
    },
    refetchInterval: 60000,
  });

  // Subscribe to realtime updates for logs with anomaly detection
  useEffect(() => {
    const channel = supabase
      .channel('scraping-logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scraping_logs'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['scraping-logs'] });
          queryClient.invalidateQueries({ queryKey: ['scraping-stats'] });
          
          // Check for anomalies in new log entry
          const newLog = payload.new as ScrapingLog;
          
          // Get current user for alert creation
          const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return user?.id;
          };
          
          // Calculate recent success rate (last 10 scrapes)
          if (logs && logs.length > 0) {
            const recentLogs = [newLog, ...logs].slice(0, 10);
            const recentSuccesses = recentLogs.filter(l => l.status === 'success').length;
            const recentSuccessRate = (recentSuccesses / recentLogs.length) * 100;
            
            if (recentSuccessRate < SUCCESS_RATE_THRESHOLD) {
              toast.error(
                `⚠️ Low success rate detected: ${recentSuccessRate.toFixed(1)}%`,
                { description: 'Recent scraping attempts are failing more than usual' }
              );
              
              // Create alert in database
              supabase.from('scraping_alerts').insert({
                alert_type: 'low_success_rate',
                severity: recentSuccessRate < 50 ? 'critical' : 'error',
                message: `Low Success Rate: ${recentSuccessRate.toFixed(1)}%`,
                details: {
                  successRate: recentSuccessRate,
                  threshold: SUCCESS_RATE_THRESHOLD,
                  recentLogs: recentLogs.length,
                },
                status: 'pending',
              }).then(() => console.log('Alert created in database'));
              
              // Send webhook alert
              supabase.functions.invoke('send-webhook-alert', {
                body: {
                  type: 'low_success_rate',
                  message: `Low Success Rate: ${recentSuccessRate.toFixed(1)}%`,
                  details: {
                    successRate: recentSuccessRate,
                    threshold: SUCCESS_RATE_THRESHOLD,
                  },
                  timestamp: new Date().toISOString(),
                },
              }).catch(err => console.error('Failed to send webhook:', err));
            }
          }
          
          // Check for execution time spike
          if (logs && logs.length > 0) {
            const sameSourcLogs = logs.filter(l => l.source_id === newLog.source_id);
            if (sameSourcLogs.length >= 3) {
              const avgTime = sameSourcLogs.reduce((sum, l) => sum + l.execution_time_ms, 0) / sameSourcLogs.length;
              
              if (newLog.execution_time_ms > avgTime * EXECUTION_TIME_SPIKE_MULTIPLIER) {
                toast.warning(
                  `⚠️ Execution time spike: ${newLog.source_name}`,
                  { 
                    description: `${(newLog.execution_time_ms / 1000).toFixed(1)}s (avg: ${(avgTime / 1000).toFixed(1)}s)` 
                  }
                );
                
                // Create alert in database
                supabase.from('scraping_alerts').insert({
                  alert_type: 'execution_spike',
                  severity: 'warning',
                  message: `Execution Time Spike: ${newLog.source_name}`,
                  details: {
                    executionTime: (newLog.execution_time_ms / 1000).toFixed(1),
                    averageTime: (avgTime / 1000).toFixed(1),
                    source: newLog.source_name,
                    multiplier: EXECUTION_TIME_SPIKE_MULTIPLIER,
                  },
                  status: 'pending',
                }).then(() => console.log('Alert created in database'));
                
                // Send webhook alert
                supabase.functions.invoke('send-webhook-alert', {
                  body: {
                    type: 'execution_spike',
                    message: `Execution Time Spike: ${newLog.source_name}`,
                    details: {
                      executionTime: (newLog.execution_time_ms / 1000).toFixed(1),
                      averageTime: (avgTime / 1000).toFixed(1),
                      source: newLog.source_name,
                    },
                    timestamp: new Date().toISOString(),
                  },
                }).catch(err => console.error('Failed to send webhook:', err));
              }
            }
          }
          
          // Alert on errors and check for consecutive failures
          if (newLog.status === 'error') {
            toast.error(
              `Scraping failed: ${newLog.source_name}`,
              { description: newLog.error_message || 'Unknown error' }
            );
            
            // Check for 3 consecutive failures
            if (logs && logs.length >= 2) {
              const lastThree = [newLog, ...logs.slice(0, 2)];
              const allSameSource = lastThree.every(l => l.source_id === newLog.source_id);
              const allErrors = lastThree.every(l => l.status === 'error');
              
              if (allSameSource && allErrors) {
                // Create alert in database
                supabase.from('scraping_alerts').insert({
                  alert_type: 'consecutive_failures',
                  severity: 'critical',
                  message: `3 Consecutive Failures: ${newLog.source_name}`,
                  details: {
                    source: newLog.source_name,
                    consecutiveFailures: 3,
                    lastError: newLog.error_message,
                  },
                  status: 'pending',
                }).then(() => console.log('Alert created in database'));
                
                // Send webhook alert for consecutive failures
                supabase.functions.invoke('send-webhook-alert', {
                  body: {
                    type: 'consecutive_failures',
                    message: `3 Consecutive Failures: ${newLog.source_name}`,
                    details: {
                      source: newLog.source_name,
                      consecutiveFailures: 3,
                    },
                    timestamp: new Date().toISOString(),
                  },
                }).catch(err => console.error('Failed to send webhook:', err));
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, logs]);

  // Process logs into chart data
  const chartData = useQuery({
    queryKey: ['chart-data', logs],
    queryFn: () => {
      if (!logs || logs.length === 0) return [];

      // Group by date
      const dataByDate = new Map<string, ChartDataPoint>();
      
      logs.forEach(log => {
        const date = new Date(log.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!dataByDate.has(date)) {
          dataByDate.set(date, {
            date,
            articles: 0,
            scrapes: 0,
            success: 0,
            errors: 0,
          });
        }
        
        const point = dataByDate.get(date)!;
        point.articles += log.new_articles;
        point.scrapes += 1;
        if (log.status === 'success') point.success += 1;
        if (log.status === 'error') point.errors += 1;
      });

      return Array.from(dataByDate.values()).reverse().slice(0, 14);
    },
    enabled: !!logs,
  });

  // Source performance data
  const sourcePerformance = useQuery({
    queryKey: ['source-performance', logs],
    queryFn: () => {
      if (!logs || logs.length === 0) return [];

      const performanceMap = new Map();
      
      logs.forEach(log => {
        if (!performanceMap.has(log.source_name)) {
          performanceMap.set(log.source_name, {
            name: log.source_name,
            total: 0,
            success: 0,
            articles: 0,
            avgTime: 0,
          });
        }
        
        const perf = performanceMap.get(log.source_name);
        perf.total += 1;
        if (log.status === 'success') perf.success += 1;
        perf.articles += log.new_articles;
        perf.avgTime = ((perf.avgTime * (perf.total - 1)) + log.execution_time_ms) / perf.total;
      });

      return Array.from(performanceMap.values()).map(p => ({
        ...p,
        successRate: (p.success / p.total) * 100,
        avgTime: Math.round(p.avgTime / 1000), // Convert to seconds
      }));
    },
    enabled: !!logs,
  });

  // Detect anomalies in overall stats
  const anomalies = useQuery({
    queryKey: ['anomalies', logs, SUCCESS_RATE_THRESHOLD, EXECUTION_TIME_SPIKE_MULTIPLIER],
    queryFn: () => {
      if (!logs || logs.length < 5) return { hasAnomalies: false, issues: [] };
      
      const issues: string[] = [];
      const recentLogs = logs.slice(0, 20);
      
      // Check success rate
      const successCount = recentLogs.filter(l => l.status === 'success').length;
      const successRate = (successCount / recentLogs.length) * 100;
      
      if (successRate < SUCCESS_RATE_THRESHOLD) {
        issues.push(`Low success rate: ${successRate.toFixed(1)}%`);
      }
      
      // Check for repeated failures
      const consecutiveFailures = recentLogs.slice(0, 3).filter(l => l.status === 'error').length;
      if (consecutiveFailures === 3) {
        issues.push('3 consecutive failures detected');
      }
      
      // Check execution times
      const avgExecutionTime = recentLogs.reduce((sum, l) => sum + l.execution_time_ms, 0) / recentLogs.length;
      const recentAvg = recentLogs.slice(0, 5).reduce((sum, l) => sum + l.execution_time_ms, 0) / 5;
      
      if (recentAvg > avgExecutionTime * EXECUTION_TIME_SPIKE_MULTIPLIER) {
        issues.push(`Execution time spike: ${(recentAvg / 1000).toFixed(1)}s vs ${(avgExecutionTime / 1000).toFixed(1)}s avg`);
      }
      
      return {
        hasAnomalies: issues.length > 0,
        issues,
        successRate,
      };
    },
    enabled: !!logs && logs.length > 0,
  });

  return {
    cronJobs: cronJobs || [],
    sources: sources || [],
    stats,
    logs: logs || [],
    chartData: chartData.data || [],
    sourcePerformance: sourcePerformance.data || [],
    anomalies: anomalies.data,
    isLoading: cronLoading || sourcesLoading,
    toggleCronJob,
    triggerManualScrape,
  };
}
