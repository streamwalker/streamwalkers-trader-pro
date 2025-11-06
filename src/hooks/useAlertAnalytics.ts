import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

export interface AlertTrend {
  date: string;
  pending: number;
  acknowledged: number;
  investigating: number;
  resolved: number;
  critical: number;
  error: number;
  warning: number;
}

export interface ResolutionTimeStats {
  alert_type: string;
  avg_hours: number;
  min_hours: number;
  max_hours: number;
  count: number;
}

export interface TeamPerformance {
  user_id: string;
  display_name: string;
  email: string;
  assigned_count: number;
  resolved_count: number;
  avg_resolution_hours: number;
  last_activity: string;
}

export interface AlertTypeDistribution {
  alert_type: string;
  count: number;
  critical: number;
  error: number;
  warning: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export const useAlertAnalytics = (days: number = 30) => {
  const startDate = subDays(new Date(), days).toISOString();

  // Alert trends over time
  const { data: alertTrends = [] } = useQuery({
    queryKey: ['alert-trends', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_alerts')
        .select('detected_at, status, severity')
        .gte('detected_at', startDate)
        .order('detected_at', { ascending: true });
      
      if (error) throw error;

      // Group by date
      const groupedByDate: Record<string, AlertTrend> = {};
      
      data?.forEach((alert: any) => {
        const date = format(new Date(alert.detected_at), 'yyyy-MM-dd');
        if (!groupedByDate[date]) {
          groupedByDate[date] = {
            date,
            pending: 0,
            acknowledged: 0,
            investigating: 0,
            resolved: 0,
            critical: 0,
            error: 0,
            warning: 0,
          };
        }
        
        // Count by status
        const statusKey = alert.status as keyof AlertTrend;
        if (statusKey in groupedByDate[date] && typeof groupedByDate[date][statusKey] === 'number') {
          (groupedByDate[date][statusKey] as number)++;
        }
        
        // Count by severity
        const severityKey = alert.severity as keyof AlertTrend;
        if (severityKey in groupedByDate[date] && typeof groupedByDate[date][severityKey] === 'number') {
          (groupedByDate[date][severityKey] as number)++;
        }
      });

      return Object.values(groupedByDate);
    },
    refetchInterval: 60000,
  });

  // Resolution time statistics
  const { data: resolutionStats = [] } = useQuery({
    queryKey: ['resolution-stats', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_alerts')
        .select('alert_type, detected_at, resolved_at')
        .gte('detected_at', startDate)
        .eq('status', 'resolved')
        .not('resolved_at', 'is', null);
      
      if (error) throw error;

      // Calculate resolution times by alert type
      const statsByType: Record<string, { times: number[]; count: number }> = {};
      
      data?.forEach((alert: any) => {
        if (!alert.resolved_at) return;
        
        const detectedTime = new Date(alert.detected_at).getTime();
        const resolvedTime = new Date(alert.resolved_at).getTime();
        const hoursToResolve = (resolvedTime - detectedTime) / (1000 * 60 * 60);
        
        if (!statsByType[alert.alert_type]) {
          statsByType[alert.alert_type] = { times: [], count: 0 };
        }
        
        statsByType[alert.alert_type].times.push(hoursToResolve);
        statsByType[alert.alert_type].count++;
      });

      return Object.entries(statsByType).map(([alert_type, stats]) => {
        const times = stats.times.sort((a, b) => a - b);
        return {
          alert_type,
          avg_hours: times.reduce((a, b) => a + b, 0) / times.length,
          min_hours: Math.min(...times),
          max_hours: Math.max(...times),
          count: stats.count,
        };
      });
    },
    refetchInterval: 60000,
  });

  // Team performance metrics
  const { data: teamPerformance = [] } = useQuery({
    queryKey: ['team-performance', days],
    queryFn: async () => {
      const { data: alerts, error: alertsError } = await supabase
        .from('scraping_alerts')
        .select('assigned_to, resolved_by, detected_at, resolved_at, acknowledged_at')
        .gte('detected_at', startDate);
      
      if (alertsError) throw alertsError;

      // Get all unique user IDs
      const userIds = new Set<string>();
      alerts?.forEach((alert: any) => {
        if (alert.assigned_to) userIds.add(alert.assigned_to);
        if (alert.resolved_by) userIds.add(alert.resolved_by);
      });

      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', Array.from(userIds));
      
      if (profilesError) throw profilesError;

      // Calculate metrics per user
      const userMetrics: Record<string, any> = {};
      
      profiles?.forEach((profile: any) => {
        userMetrics[profile.id] = {
          user_id: profile.id,
          display_name: profile.display_name || profile.email || 'Unknown',
          email: profile.email,
          assigned_count: 0,
          resolved_count: 0,
          resolution_times: [] as number[],
          last_activity: null,
        };
      });

      alerts?.forEach((alert: any) => {
        if (alert.assigned_to && userMetrics[alert.assigned_to]) {
          userMetrics[alert.assigned_to].assigned_count++;
        }
        
        if (alert.resolved_by && userMetrics[alert.resolved_by]) {
          userMetrics[alert.resolved_by].resolved_count++;
          
          if (alert.resolved_at && alert.detected_at) {
            const hours = (new Date(alert.resolved_at).getTime() - new Date(alert.detected_at).getTime()) / (1000 * 60 * 60);
            userMetrics[alert.resolved_by].resolution_times.push(hours);
          }
          
          const activityTime = alert.resolved_at || alert.acknowledged_at;
          if (activityTime && (!userMetrics[alert.resolved_by].last_activity || activityTime > userMetrics[alert.resolved_by].last_activity)) {
            userMetrics[alert.resolved_by].last_activity = activityTime;
          }
        }
      });

      return Object.values(userMetrics).map((metrics: any) => ({
        user_id: metrics.user_id,
        display_name: metrics.display_name,
        email: metrics.email,
        assigned_count: metrics.assigned_count,
        resolved_count: metrics.resolved_count,
        avg_resolution_hours: metrics.resolution_times.length > 0
          ? metrics.resolution_times.reduce((a: number, b: number) => a + b, 0) / metrics.resolution_times.length
          : 0,
        last_activity: metrics.last_activity,
      }));
    },
    refetchInterval: 60000,
  });

  // Alert type distribution
  const { data: typeDistribution = [] } = useQuery({
    queryKey: ['type-distribution', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_alerts')
        .select('alert_type, severity')
        .gte('detected_at', startDate);
      
      if (error) throw error;

      const distribution: Record<string, AlertTypeDistribution> = {};
      
      data?.forEach((alert: any) => {
        if (!distribution[alert.alert_type]) {
          distribution[alert.alert_type] = {
            alert_type: alert.alert_type,
            count: 0,
            critical: 0,
            error: 0,
            warning: 0,
          };
        }
        
        distribution[alert.alert_type].count++;
        distribution[alert.alert_type][alert.severity as keyof AlertTypeDistribution]++;
      });

      return Object.values(distribution);
    },
    refetchInterval: 60000,
  });

  // Status distribution
  const { data: statusDistribution = [] } = useQuery({
    queryKey: ['status-distribution', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_alerts')
        .select('status')
        .gte('detected_at', startDate);
      
      if (error) throw error;

      const distribution: Record<string, number> = {};
      
      data?.forEach((alert: any) => {
        distribution[alert.status] = (distribution[alert.status] || 0) + 1;
      });

      return Object.entries(distribution).map(([status, count]) => ({
        status,
        count,
      }));
    },
    refetchInterval: 60000,
  });

  // Summary statistics
  const { data: summaryStats } = useQuery({
    queryKey: ['alert-summary-stats', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_alerts')
        .select('detected_at, resolved_at, resolved_by')
        .gte('detected_at', startDate);
      
      if (error) throw error;

      const totalAlerts = data?.length || 0;
      const resolvedAlerts = data?.filter((a: any) => a.resolved_at) || [];
      
      const resolutionTimes = resolvedAlerts
        .map((alert: any) => (new Date(alert.resolved_at).getTime() - new Date(alert.detected_at).getTime()) / (1000 * 60 * 60))
        .filter((time: number) => !isNaN(time));
      
      const avgResolutionTime = resolutionTimes.length > 0
        ? resolutionTimes.reduce((a: number, b: number) => a + b, 0) / resolutionTimes.length
        : 0;

      // Find fastest resolver
      const resolverTimes: Record<string, number[]> = {};
      resolvedAlerts.forEach((alert: any) => {
        if (alert.resolved_by) {
          const time = (new Date(alert.resolved_at).getTime() - new Date(alert.detected_at).getTime()) / (1000 * 60 * 60);
          if (!resolverTimes[alert.resolved_by]) resolverTimes[alert.resolved_by] = [];
          resolverTimes[alert.resolved_by].push(time);
        }
      });

      let fastestResolver = null;
      let fastestTime = Infinity;
      Object.entries(resolverTimes).forEach(([userId, times]) => {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        if (avg < fastestTime) {
          fastestTime = avg;
          fastestResolver = userId;
        }
      });

      return {
        totalAlerts,
        avgResolutionTime,
        fastestResolver,
      };
    },
    refetchInterval: 60000,
  });

  return {
    alertTrends,
    resolutionStats,
    teamPerformance,
    typeDistribution,
    statusDistribution,
    summaryStats,
  };
};
