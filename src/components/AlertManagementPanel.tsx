import { useState, useEffect } from "react";
import { useAlertManagement, type ScrapingAlert } from "@/hooks/useAlertManagement";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AlertDetailDialog } from "./AlertDetailDialog";
import { supabase } from "@/integrations/supabase/client";

export const AlertManagementPanel = () => {
  const [filters, setFilters] = useState({
    status: "",
    alert_type: "",
    severity: "",
    assignedTo: "",
    assignedToMe: false,
  });
  const [selectedAlert, setSelectedAlert] = useState<ScrapingAlert | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const { alerts, stats, isLoading, acknowledgeAlert, updateAlertStatus, assignAlert } = useAlertManagement(filters);
  const { teamMembers } = useTeamMembers();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'investigating': return 'secondary';
      default: return 'destructive';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'investigating': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {[
          { label: 'Total', value: stats?.total || 0 },
          { label: 'Pending', value: stats?.pending || 0, color: 'text-warning' },
          { label: 'Investigating', value: stats?.investigating || 0, color: 'text-accent' },
          { label: 'Resolved', value: stats?.resolved || 0, color: 'text-success' },
          { label: 'Critical', value: stats?.critical || 0, color: 'text-destructive' },
          { label: 'Assigned to Me', value: stats?.assignedToMe || 0, color: 'text-primary' },
          { label: 'Unassigned', value: stats?.unassigned || 0, color: 'text-muted-foreground' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{stat.label}</CardTitle></CardHeader>
            <CardContent><div className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={filters.status} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v }))}>
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.alert_type} onValueChange={(v) => setFilters(prev => ({ ...prev, alert_type: v }))}>
              <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="low_success_rate">Low Success Rate</SelectItem>
                <SelectItem value="execution_spike">Execution Spike</SelectItem>
                <SelectItem value="consecutive_failures">Consecutive Failures</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.severity} onValueChange={(v) => setFilters(prev => ({ ...prev, severity: v }))}>
              <SelectTrigger><SelectValue placeholder="All Severities" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.assignedTo} onValueChange={(v) => setFilters(prev => ({ ...prev, assignedTo: v }))}>
              <SelectTrigger><SelectValue placeholder="All Users" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Users</SelectItem>
                {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.display_name || m.email}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant={filters.assignedToMe ? "default" : "outline"} onClick={() => setFilters(prev => ({ ...prev, assignedToMe: !prev.assignedToMe }))}>My Alerts</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell><Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{alert.alert_type}</Badge></TableCell>
                  <TableCell className="max-w-md truncate">{alert.message}</TableCell>
                  <TableCell>{alert.assignee_name ? <Badge variant="secondary">{alert.assignee_name}</Badge> : <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(alert.detected_at), { addSuffix: true })}</TableCell>
                  <TableCell><Badge variant={getStatusColor(alert.status)}>{getStatusIcon(alert.status)}{alert.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedAlert(alert); setDetailDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                      {!alert.assigned_to && <Button size="sm" onClick={() => assignAlert.mutate({ alertId: alert.id, assignedTo: userId, userId })}><UserPlus className="h-4 w-4" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDetailDialog alert={selectedAlert} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} onUpdateStatus={(alertId, status, notes) => userId && updateAlertStatus.mutate({ alertId, status, notes, userId })} userId={userId} />
    </div>
  );
};
