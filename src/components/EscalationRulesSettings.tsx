import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertTriangle, Clock, Save } from "lucide-react";

interface EscalationRule {
  id: string;
  severity: string;
  escalation_time_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const EscalationRulesSettings = () => {
  const queryClient = useQueryClient();
  const [editingRules, setEditingRules] = useState<Record<string, number>>({});

  const { data: rules, isLoading } = useQuery({
    queryKey: ['escalation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_escalation_rules')
        .select('*')
        .order('severity');
      
      if (error) throw error;
      return data as EscalationRule[];
    },
  });

  const updateRule = useMutation({
    mutationFn: async ({ id, escalation_time_minutes, is_active }: { id: string; escalation_time_minutes?: number; is_active?: boolean }) => {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (escalation_time_minutes !== undefined) updateData.escalation_time_minutes = escalation_time_minutes;
      if (is_active !== undefined) updateData.is_active = is_active;

      const { error } = await supabase
        .from('alert_escalation_rules')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalation-rules'] });
      toast.success("Escalation rule updated");
      setEditingRules({});
    },
    onError: (error) => {
      console.error("Error updating escalation rule:", error);
      toast.error("Failed to update escalation rule");
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'default';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    return <AlertTriangle className={`h-4 w-4 ${
      severity === 'critical' ? 'text-destructive' : 
      severity === 'error' ? 'text-orange-500' : 
      'text-yellow-500'
    }`} />;
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Alert Escalation Rules
          </CardTitle>
          <CardDescription>
            Configure automatic reassignment of unresolved alerts based on severity and time thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Escalation Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules?.map((rule) => {
                  const isEditing = editingRules[rule.id] !== undefined;
                  const editValue = editingRules[rule.id] || rule.escalation_time_minutes;

                  return (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(rule.severity)}
                          <Badge variant={getSeverityColor(rule.severity)}>
                            {rule.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <Input
                              type="number"
                              min="5"
                              max="1440"
                              value={editValue}
                              onChange={(e) => setEditingRules({ ...editingRules, [rule.id]: parseInt(e.target.value) })}
                              className="w-24"
                            />
                          ) : (
                            <span className="font-medium">{rule.escalation_time_minutes}</span>
                          )}
                          <span className="text-sm text-muted-foreground">minutes</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ~{Math.floor(rule.escalation_time_minutes / 60)}h {rule.escalation_time_minutes % 60}m
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={(checked) => updateRule.mutate({ id: rule.id, is_active: checked })}
                          />
                          <span className="text-sm text-muted-foreground">
                            {rule.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateRule.mutate({ id: rule.id, escalation_time_minutes: editValue })}
                              disabled={updateRule.isPending}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRules((prev) => {
                                const newRules = { ...prev };
                                delete newRules[rule.id];
                                return newRules;
                              })}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRules({ ...editingRules, [rule.id]: rule.escalation_time_minutes })}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">How Escalation Works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Alerts are checked every 15 minutes by the escalation cron job</li>
              <li>• If an alert exceeds the time threshold for its severity, it will be automatically reassigned</li>
              <li>• The system uses round-robin to assign to available team members</li>
              <li>• Email notifications are sent to the newly assigned user</li>
              <li>• Escalation history is tracked in the alert timeline</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
