import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Webhook, Plus, Trash2, TestTube } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookConfig {
  id: string;
  name: string;
  webhook_url: string;
  service_type: 'slack' | 'discord' | 'custom';
  is_active: boolean;
  alert_on_low_success_rate: boolean;
  alert_on_execution_spike: boolean;
  alert_on_consecutive_failures: boolean;
}

export function WebhookSettings() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    name: '',
    webhook_url: '',
    service_type: 'slack',
    is_active: true,
    alert_on_low_success_rate: true,
    alert_on_execution_spike: true,
    alert_on_consecutive_failures: true,
  });

  // Fetch webhooks
  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhook_configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WebhookConfig[];
    },
  });

  // Add webhook
  const addWebhook = useMutation({
    mutationFn: async (webhook: Omit<WebhookConfig, 'id'>) => {
      const { data, error } = await supabase
        .from('webhook_configs')
        .insert([webhook])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook_configs'] });
      toast.success('Webhook added successfully');
      setIsAddDialogOpen(false);
      setNewWebhook({
        name: '',
        webhook_url: '',
        service_type: 'slack',
        is_active: true,
        alert_on_low_success_rate: true,
        alert_on_execution_spike: true,
        alert_on_consecutive_failures: true,
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add webhook: ${error.message}`);
    },
  });

  // Delete webhook
  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook_configs'] });
      toast.success('Webhook deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete webhook: ${error.message}`);
    },
  });

  // Toggle webhook active status
  const toggleWebhook = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('webhook_configs')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook_configs'] });
      toast.success('Webhook updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update webhook: ${error.message}`);
    },
  });

  // Test webhook
  const testWebhook = useMutation({
    mutationFn: async (webhookUrl: string) => {
      const { data, error } = await supabase.functions.invoke('send-webhook-alert', {
        body: {
          type: 'low_success_rate',
          message: 'Test Alert from Market Oracle',
          details: {
            successRate: 65,
            threshold: 70,
          },
          timestamp: new Date().toISOString(),
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Test alert sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send test alert: ${error.message}`);
    },
  });

  const getServiceBadgeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'slack':
        return 'bg-purple-500';
      case 'discord':
        return 'bg-indigo-500';
      case 'custom':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Webhook Notifications
            </CardTitle>
            <CardDescription>
              Configure alerts to Slack, Discord, or custom endpoints
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Webhook Notification</DialogTitle>
                <DialogDescription>
                  Configure a new webhook endpoint for real-time anomaly alerts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Webhook Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ops Team Slack"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Type</Label>
                  <Select
                    value={newWebhook.service_type}
                    onValueChange={(value: 'slack' | 'discord' | 'custom') =>
                      setNewWebhook({ ...newWebhook, service_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="custom">Custom Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Webhook URL</Label>
                  <Input
                    id="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={newWebhook.webhook_url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, webhook_url: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Alert Triggers</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Success Rate</span>
                      <Switch
                        checked={newWebhook.alert_on_low_success_rate}
                        onCheckedChange={(checked) =>
                          setNewWebhook({ ...newWebhook, alert_on_low_success_rate: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Execution Time Spike</span>
                      <Switch
                        checked={newWebhook.alert_on_execution_spike}
                        onCheckedChange={(checked) =>
                          setNewWebhook({ ...newWebhook, alert_on_execution_spike: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consecutive Failures</span>
                      <Switch
                        checked={newWebhook.alert_on_consecutive_failures}
                        onCheckedChange={(checked) =>
                          setNewWebhook({ ...newWebhook, alert_on_consecutive_failures: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    if (newWebhook.name && newWebhook.webhook_url && newWebhook.service_type) {
                      addWebhook.mutate({
                        name: newWebhook.name,
                        webhook_url: newWebhook.webhook_url,
                        service_type: newWebhook.service_type,
                        is_active: newWebhook.is_active ?? true,
                        alert_on_low_success_rate: newWebhook.alert_on_low_success_rate ?? true,
                        alert_on_execution_spike: newWebhook.alert_on_execution_spike ?? true,
                        alert_on_consecutive_failures: newWebhook.alert_on_consecutive_failures ?? true,
                      });
                    }
                  }}
                  disabled={!newWebhook.name || !newWebhook.webhook_url || addWebhook.isPending}
                >
                  Add Webhook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {webhooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No webhooks configured</p>
            <p className="text-sm">Add a webhook to receive real-time alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{webhook.name}</h4>
                    <Badge className={getServiceBadgeColor(webhook.service_type)}>
                      {webhook.service_type}
                    </Badge>
                    {webhook.is_active && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {webhook.webhook_url}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {webhook.alert_on_low_success_rate && (
                      <Badge variant="secondary" className="text-xs">Success Rate</Badge>
                    )}
                    {webhook.alert_on_execution_spike && (
                      <Badge variant="secondary" className="text-xs">Exec Spike</Badge>
                    )}
                    {webhook.alert_on_consecutive_failures && (
                      <Badge variant="secondary" className="text-xs">Failures</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testWebhook.mutate(webhook.webhook_url)}
                    disabled={testWebhook.isPending}
                  >
                    <TestTube className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={webhook.is_active}
                    onCheckedChange={(checked) =>
                      toggleWebhook.mutate({ id: webhook.id, is_active: checked })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWebhook.mutate(webhook.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
