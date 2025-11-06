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
  assigned_to?: string;
  assigned_at?: string;
  assigned_by?: string;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AlertFilters {
  status?: string;
  alert_type?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  assignedToMe?: boolean;
}

export const useAlertManagement = (filters?: AlertFilters) => {
  const queryClient = useQueryClient();

  // Fetch alerts with filters
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['scraping-alerts', filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('scraping_alerts')
        .select(`
          *,
          assignee:assigned_to(display_name, email)
        `)
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
      if (filters?.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }
      if (filters?.assignedToMe && user) {
        query = query.eq('assigned_to', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Map assignee info
      return (data || []).map((alert: any) => ({
        ...alert,
        assignee_name: alert.assignee?.display_name || alert.assignee?.email || null,
      })) as ScrapingAlert[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch alert statistics
  const { data: stats } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: allAlerts, error } = await supabase
        .from('scraping_alerts')
        .select('status, severity, assigned_to');
      
      if (error) throw error;

      const pending = allAlerts.filter(a => a.status === 'pending').length;
      const acknowledged = allAlerts.filter(a => a.status === 'acknowledged').length;
      const investigating = allAlerts.filter(a => a.status === 'investigating').length;
      const resolved = allAlerts.filter(a => a.status === 'resolved').length;
      const critical = allAlerts.filter(a => a.severity === 'critical').length;
      const assignedToMe = user ? allAlerts.filter(a => a.assigned_to === user.id).length : 0;
      const unassigned = allAlerts.filter(a => !a.assigned_to).length;

      return { pending, acknowledged, investigating, resolved, critical, assignedToMe, unassigned, total: allAlerts.length };
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

  // Assign alert mutation
  const assignAlert = useMutation({
    mutationFn: async ({
      alertId,
      assignedTo,
      userId
    }: {
      alertId: string;
      assignedTo: string;
      userId: string;
    }) => {
      const { data: alert } = await supabase
        .from('scraping_alerts')
        .select('assigned_to')
        .eq('id', alertId)
        .single();

      const { error } = await supabase
        .from('scraping_alerts')
        .update({
          assigned_to: assignedTo,
          assigned_at: new Date().toISOString(),
          assigned_by: userId
        })
        .eq('id', alertId);

      if (error) throw error;

      // Record history
      await supabase
        .from('alert_status_history')
        .insert({
          alert_id: alertId,
          user_id: userId,
          old_status: 'pending',
          new_status: 'pending',
          notes: `Assigned to user ${assignedTo}`
        });
    },
    onSuccess: async (_, variables) => {
      // Trigger email notification
      try {
        await supabase.functions.invoke('send-alert-assignment-email', {
          body: {
            alertId: variables.alertId,
            assignedToUserId: variables.assignedTo,
            assignedByUserId: variables.userId,
            isBulk: false
          }
        });
      } catch (error) {
        console.error("Error sending assignment email:", error);
      }
      
      queryClient.invalidateQueries({ queryKey: ['scraping-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
      toast.success("Alert assigned successfully");
    },
    onError: (error) => {
      console.error("Error assigning alert:", error);
      toast.error("Failed to assign alert");
    }
  });

  // Unassign alert mutation
  const unassignAlert = useMutation({
    mutationFn: async ({
      alertId,
      userId
    }: {
      alertId: string;
      userId: string;
    }) => {
      const { error } = await supabase
        .from('scraping_alerts')
        .update({
          assigned_to: null,
          assigned_at: null,
          assigned_by: null
        })
        .eq('id', alertId);

      if (error) throw error;

      // Record history
      await supabase
        .from('alert_status_history')
        .insert({
          alert_id: alertId,
          user_id: userId,
          old_status: 'pending',
          new_status: 'pending',
          notes: 'Alert unassigned'
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
      toast.success("Alert unassigned");
    },
    onError: (error) => {
      console.error("Error unassigning alert:", error);
      toast.error("Failed to unassign alert");
    }
  });

  // Bulk assign alerts mutation
  const bulkAssignAlerts = useMutation({
    mutationFn: async ({
      alertIds,
      assignedTo,
      userId
    }: {
      alertIds: string[];
      assignedTo: string;
      userId: string;
    }) => {
      const results = await Promise.allSettled(
        alertIds.map(async (alertId) => {
          const { error } = await supabase
            .from('scraping_alerts')
            .update({
              assigned_to: assignedTo,
              assigned_at: new Date().toISOString(),
              assigned_by: userId
            })
            .eq('id', alertId);
          
          if (error) throw error;
          
          // Record history
          await supabase
            .from('alert_status_history')
            .insert({
              alert_id: alertId,
              user_id: userId,
              old_status: 'pending',
              new_status: 'pending',
              notes: `Bulk assigned to user`
            });
        })
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      // Trigger bulk email notification
      if (successful > 0) {
        try {
          await supabase.functions.invoke('send-alert-assignment-email', {
            body: {
              assignedToUserId: assignedTo,
              assignedByUserId: userId,
              isBulk: true,
              bulkAlertIds: alertIds
            }
          });
        } catch (error) {
          console.error("Error sending bulk assignment email:", error);
        }
      }
      
      return { successful, failed, total: alertIds.length };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['scraping-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
      
      if (result.failed > 0) {
        toast.warning(`Assigned ${result.successful} alerts, ${result.failed} failed`);
      } else {
        toast.success(`Successfully assigned ${result.successful} alerts`);
      }
    },
    onError: (error) => {
      console.error("Error bulk assigning alerts:", error);
      toast.error("Failed to bulk assign alerts");
    }
  });

  return {
    alerts,
    stats,
    isLoading,
    acknowledgeAlert,
    updateAlertStatus,
    resolveAlert,
    assignAlert,
    unassignAlert,
    bulkAssignAlerts
  };
};
