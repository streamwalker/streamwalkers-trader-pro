import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Plus, Mail, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EmailReportConfig {
  id: string;
  email: string;
  frequency: 'daily' | 'weekly';
  report_types: string[];
  is_active: boolean;
  last_sent_at?: string;
}

export const EmailReportSettings = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({
    email: '',
    frequency: 'daily' as 'daily' | 'weekly',
    report_types: ['summary', 'anomalies', 'performance']
  });

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['email-report-configs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('email_report_configs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailReportConfig[];
    }
  });

  const addConfig = useMutation({
    mutationFn: async (config: typeof newConfig) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('email_report_configs')
        .insert({
          user_id: user.id,
          email: config.email,
          frequency: config.frequency,
          report_types: config.report_types,
          is_active: true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-report-configs'] });
      toast.success('Email report configuration added');
      setIsAddDialogOpen(false);
      setNewConfig({
        email: '',
        frequency: 'daily',
        report_types: ['summary', 'anomalies', 'performance']
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add configuration');
    }
  });

  const toggleConfig = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('email_report_configs')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-report-configs'] });
      toast.success('Configuration updated');
    }
  });

  const deleteConfig = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('email_report_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-report-configs'] });
      toast.success('Configuration deleted');
    }
  });

  const testEmail = useMutation({
    mutationFn: async ({ email, reportTypes }: { email: string; reportTypes: string[] }) => {
      // If config includes dip_analysis, send dip analysis report
      if (reportTypes.includes('dip_analysis')) {
        const { error } = await supabase.functions.invoke('send-dip-analysis-report', {
          body: { 
            email, 
            isTest: true,
            includeDetailed: true
          }
        });
        if (error) throw error;
      }
      
      // If config includes scraping reports (summary, anomalies, performance)
      const scrapingTypes = reportTypes.filter(t => ['summary', 'anomalies', 'performance'].includes(t));
      if (scrapingTypes.length > 0) {
        const { error } = await supabase.functions.invoke('send-scraping-report', {
          body: { 
            email, 
            frequency: 'daily', 
            isTest: true 
          }
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Test email(s) sent! Check your inbox.');
    },
    onError: () => {
      toast.error('Failed to send test email');
    }
  });

  const handleReportTypeToggle = (type: string, checked: boolean) => {
    setNewConfig(prev => ({
      ...prev,
      report_types: checked 
        ? [...prev.report_types, type]
        : prev.report_types.filter(t => t !== type)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Report Settings
              </CardTitle>
              <CardDescription>
                Configure automated email reports for scraping summaries and dip analysis
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Email Report</DialogTitle>
                  <DialogDescription>
                    Configure a new automated email report
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={newConfig.email}
                      onChange={(e) => setNewConfig({ ...newConfig, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newConfig.frequency}
                      onValueChange={(value: 'daily' | 'weekly') => 
                        setNewConfig({ ...newConfig, frequency: value })
                      }
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (8 AM UTC)</SelectItem>
                        <SelectItem value="weekly">Weekly (Monday 8 AM UTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Report Contents</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="summary"
                          checked={newConfig.report_types.includes('summary')}
                          onCheckedChange={(checked) => 
                            handleReportTypeToggle('summary', checked as boolean)
                          }
                        />
                        <Label htmlFor="summary" className="font-normal">Summary Statistics</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="anomalies"
                          checked={newConfig.report_types.includes('anomalies')}
                          onCheckedChange={(checked) => 
                            handleReportTypeToggle('anomalies', checked as boolean)
                          }
                        />
                        <Label htmlFor="anomalies" className="font-normal">Anomalies Detected</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="performance"
                          checked={newConfig.report_types.includes('performance')}
                          onCheckedChange={(checked) => 
                            handleReportTypeToggle('performance', checked as boolean)
                          }
                        />
                        <Label htmlFor="performance" className="font-normal">Source Performance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dip_analysis"
                          checked={newConfig.report_types.includes('dip_analysis')}
                          onCheckedChange={(checked) => 
                            handleReportTypeToggle('dip_analysis', checked as boolean)
                          }
                        />
                        <Label htmlFor="dip_analysis" className="font-normal">Daily Dip Analysis (7 AM CST)</Label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => addConfig.mutate(newConfig)}
                    disabled={!newConfig.email || newConfig.report_types.length === 0}
                    className="w-full"
                  >
                    Add Configuration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : configs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No email reports configured. Click "Add Report" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config) => (
                <Card key={config.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{config.email}</p>
                          <span className="text-sm text-muted-foreground capitalize">
                            ({config.frequency})
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {config.report_types.map((type) => (
                            <span key={type} className="text-xs bg-secondary px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                        {config.last_sent_at && (
                          <p className="text-xs text-muted-foreground">
                            Last sent: {new Date(config.last_sent_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${config.id}`}>Active</Label>
                          <Switch
                            id={`active-${config.id}`}
                            checked={config.is_active}
                            onCheckedChange={(checked) => 
                              toggleConfig.mutate({ id: config.id, is_active: checked })
                            }
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testEmail.mutate({ 
                            email: config.email, 
                            reportTypes: config.report_types 
                          })}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteConfig.mutate(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
