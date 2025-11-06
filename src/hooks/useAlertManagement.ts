import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export interface ScrapingAlert {
  id: string;
  alert_type: string;
  severity: 'warning' | 'error' | 'critical';
  message: string;
  details: any;
  status: 'pending' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  detected_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AlertFilters {
  status?: string;
  alert_type?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
}

export const useAlertManagement = (filters?: AlertFilters) => {
  const queryClient = useQueryClient();

  // Fetch alerts with filters
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['scraping-alerts', filters],
    queryFn: async () => {
      let query = supabase
        .from('scraping_alerts')
        .select('*')
        .order('detected_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status as any);
      }
      if (filters?.alert_type) {
        query = query.eq('alert_type', filters.alert_type);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity as any);
      }
      if (filters?.startDate) {
        query = query.gte('detected_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('detected_at', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ScrapingAlert[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch alert statistics
  const { data: stats } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: async () => {
      const { data: allAlerts, error } = await supabase
        .from('scraping_alerts')
        .select('status, severity');
      
      if (error) throw error;

      const pending = allAlerts.filter(a => a.status === 'pending').length;
      const acknowledged = allAlerts.filter(a => a.status === 'acknowledged').length;
      const investigating = allAlerts.filter(a => a.status === 'investigating').length;
      const resolved = allAlerts.filter(a => a.status === 'resolved').length;
      const critical = allAlerts.filter(a => a.severity === 'critical').length;

      return { pending, acknowledged, investigating, resolved, critical, total: allAlerts.length };
    },
    refetchInterval: 30000,
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('scraping-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scraping_alerts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scraping-alerts'] });
          queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Acknowledge alert mutation
  const acknowledgeAlert = useMutation({
    mutationFn: async ({ alertId, userId }: { alertId: string; userId: string }) => {
      const { data: alert } = await supabase
        .from('scraping_alerts')
        .select('status')
        .eq('id', alertId)
        .single();

      const { error } = await supabase
        .from('scraping_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: userId
        })
        .eq('id', alertId);

      if (error) throw error;

      // Record history
      await supabase
        .from('alert_status_history')
        .insert({
          alert_id: alertId,
          user_id: userId,
          old_status: alert?.status || 'pending',
          new_status: 'acknowledged'
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
      toast.success("Alert acknowledged");
    },
    onError: (error) => {
      console.error("Error acknowledging alert:", error);
      toast.error("Failed to acknowledge alert");
    }
  });

  // Update alert status mutation
  const updateAlertStatus = useMutation({
    mutationFn: async ({ 
      alertId, 
      status, 
      notes, 
      userId 
    }: { 
      alertId: string; 
      status: 'pending' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive'; 
      notes?: string;
      userId: string;
    }) => {
      const { data: alert } = await supabase
        .from('scraping_alerts')
        .select('status')
        .eq('id', alertId)
        .single();

      const alertData = alert as any;
      const updateData: any = { status };
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = userId;
        if (notes) {
          updateData.resolution_notes = notes;
        }
      } else if (status === 'acknowledged' && !alertData?.acknowledged_at) {
        updateData.acknowledged_at = new Date().toISOString();
        updateData.acknowledged_by = userId;
      }

      const { error } = await supabase
        .from('scraping_alerts')
        .update(updateData)
        .eq('id', alertId);

      if (error) throw error;

      // Record history
      await supabase
        .from('alert_status_history')
        .insert({
          alert_id: alertId,
          user_id: userId,
          old_status: alert?.status || 'pending',
          new_status: status,
          notes
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
      toast.success("Alert status updated");
    },
    onError: (error) => {
      console.error("Error updating alert status:", error);
      toast.error("Failed to update alert status");
    }
  });

  // Resolve alert mutation
  const resolveAlert = useMutation({
    mutationFn: async ({ 
      alertId, 
      userId, 
      resolutionNotes 
    }: { 
      alertId: string; 
      userId: string; 
      resolutionNotes: string;
    }) => {
      return updateAlertStatus.mutateAsync({
        alertId,
        status: 'resolved',
        notes: resolutionNotes,
        userId
      });
    }
  });

  return {
    alerts,
    stats,
    isLoading,
    acknowledgeAlert,
    updateAlertStatus,
    resolveAlert
  };
};
