import { useCronMonitoring, AnomalyThresholds } from '@/hooks/useCronMonitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WebhookSettings } from './WebhookSettings';
import { 
  Clock, 
  Play, 
  Pause, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Activity,
  RefreshCw,
  Calendar,
  BarChart3,
  Timer,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow, format } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const STORAGE_KEY = 'cronMonitoring_thresholds';

export function CronMonitoringDashboard() {
  // Load thresholds from localStorage or use defaults
  const [thresholds, setThresholds] = useState<AnomalyThresholds>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored thresholds:', e);
      }
    }
    return {
      successRateThreshold: 70,
      executionTimeSpikeMultiplier: 2.5,
    };
  });

  // Persist thresholds to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
  }, [thresholds]);

  const { 
    cronJobs, 
    sources, 
    stats, 
    logs,
    chartData,
    sourcePerformance,
    anomalies,
    isLoading, 
    toggleCronJob, 
    triggerManualScrape 
  } = useCronMonitoring(thresholds);

  const mainCronJob = cronJobs.find(job => job.jobname === 'scrape-news-every-4-hours');

  // Export functions
  const exportToJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle nested objects/arrays
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Escape quotes in strings
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportLogs = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(logs, 'scraping_logs');
    } else {
      exportToJSON(logs, 'scraping_logs');
    }
  };

  const handleExportPerformance = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(sourcePerformance, 'source_performance');
    } else {
      exportToJSON(sourcePerformance, 'source_performance');
    }
  };

  const handleExportChartData = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(chartData, 'scraping_trends');
    } else {
      exportToJSON(chartData, 'scraping_trends');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Anomaly Alerts */}
      {anomalies?.hasAnomalies && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Anomalies Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {anomalies.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scraping Monitor</h2>
          <p className="text-muted-foreground">
            Automated news scraping status and history
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleExportLogs('csv')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Logs (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportLogs('json')}>
                <FileJson className="w-4 h-4 mr-2" />
                Export Logs (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportPerformance('csv')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Performance (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportPerformance('json')}>
                <FileJson className="w-4 h-4 mr-2" />
                Export Performance (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportChartData('csv')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Trends (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportChartData('json')}>
                <FileJson className="w-4 h-4 mr-2" />
                Export Trends (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => triggerManualScrape.mutate()}
            disabled={triggerManualScrape.isPending}
            variant="outline"
            size="lg"
          >
            <Play className={`w-4 h-4 mr-2 ${triggerManualScrape.isPending ? 'animate-spin' : ''}`} />
            Run Manual Scrape
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="thresholds" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="thresholds">Threshold Settings</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds">
          {/* Anomaly Threshold Settings */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Anomaly Detection Settings
          </CardTitle>
          <CardDescription>
            Configure alert thresholds for automated monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Success Rate Threshold */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="success-rate">Success Rate Threshold</Label>
                  <span className="text-sm font-medium">{thresholds.successRateThreshold}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Alert when success rate drops below this percentage
                </p>
              </div>
              <Slider
                id="success-rate"
                min={50}
                max={95}
                step={5}
                value={[thresholds.successRateThreshold]}
                onValueChange={(value) => 
                  setThresholds(prev => ({ ...prev, successRateThreshold: value[0] }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Execution Time Spike Multiplier */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exec-time">Execution Time Spike Multiplier</Label>
                  <span className="text-sm font-medium">{thresholds.executionTimeSpikeMultiplier.toFixed(1)}x</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Alert when execution time exceeds this multiple of average
                </p>
              </div>
              <Slider
                id="exec-time"
                min={1.5}
                max={5}
                step={0.5}
                value={[thresholds.executionTimeSpikeMultiplier]}
                onValueChange={(value) => 
                  setThresholds(prev => ({ ...prev, executionTimeSpikeMultiplier: value[0] }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1.5x</span>
                <span>5.0x</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">How Detection Works</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Success rate is monitored across the last 10 scraping attempts</li>
                  <li>• Execution time spikes are detected per source against historical average</li>
                  <li>• Settings are saved automatically and persist across sessions</li>
                  <li>• Alerts appear as toast notifications when thresholds are breached</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setThresholds({
                successRateThreshold: 70,
                executionTimeSpikeMultiplier: 2.5,
              });
            }}
          >
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookSettings />
        </TabsContent>
      </Tabs>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Success Rate
              {anomalies?.successRate !== undefined && anomalies.successRate < thresholds.successRateThreshold && (
                <Badge variant="destructive" className="text-xs">Low</Badge>
              )}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.successfulScrapes} of {stats?.totalScrapes} sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Scraped</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.articlesScraped}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newArticles} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Scrape</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.lastScraped 
                ? formatDistanceToNow(new Date(stats.lastScraped), { addSuffix: false })
                : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.lastScraped ? 'ago' : 'No scrapes yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cron Status</CardTitle>
            {mainCronJob?.active ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mainCronJob?.active ? 'Active' : 'Paused'}
            </div>
            <p className="text-xs text-muted-foreground">
              Every 4 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cron Job Control */}
      {mainCronJob && (
        <Card>
          <CardHeader>
            <CardTitle>Automated Scraping Control</CardTitle>
            <CardDescription>
              Schedule: {mainCronJob.schedule} (Every 4 hours at 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Automatic News Scraping
                </p>
                <p className="text-xs text-muted-foreground">
                  Enable or disable the automated scraping schedule
                </p>
              </div>
              <Switch
                checked={mainCronJob.active}
                onCheckedChange={(checked) => 
                  toggleCronJob.mutate({ 
                    jobId: mainCronJob.jobid, 
                    active: checked 
                  })
                }
                disabled={toggleCronJob.isPending}
              />
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-start gap-3">
                {mainCronJob.active ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Scraping is running automatically</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        News will be scraped every 4 hours from all active sources. 
                        You can still trigger manual scrapes at any time.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Automatic scraping is paused</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enable the switch above to resume automatic scraping. 
                        You can still run manual scrapes using the button at the top.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>News Sources Status</CardTitle>
          <CardDescription>
            Individual scraping status for each configured news source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sources.map(source => {
              const minutesSinceLastScrape = source.last_scraped_at
                ? (Date.now() - new Date(source.last_scraped_at).getTime()) / 1000 / 60
                : null;
              
              const isOverdue = minutesSinceLastScrape 
                ? minutesSinceLastScrape > source.scrape_interval_minutes 
                : true;

              return (
                <div 
                  key={source.id} 
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{source.name}</p>
                        {source.is_active ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {source.scrape_urls.length} URLs • Interval: {source.scrape_interval_minutes}min
                      </p>
                    </div>

                    <div className="text-right">
                      {source.last_scraped_at ? (
                        <>
                          <p className="text-sm font-medium">
                            {formatDistanceToNow(new Date(source.last_scraped_at), { addSuffix: true })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(source.last_scraped_at), 'MMM d, h:mm a')}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Never scraped</p>
                      )}
                    </div>

                    <div>
                      {isOverdue && source.is_active ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Article Volume Over Time
            </CardTitle>
            <CardDescription>
              New articles scraped per day (last 14 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="articles" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Articles"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scraping Success Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Scraping Success Rate
            </CardTitle>
            <CardDescription>
              Success vs. error rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="success" fill="#10b981" name="Successful" />
                <Bar dataKey="errors" fill="#ef4444" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Source Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Source Performance Comparison
          </CardTitle>
          <CardDescription>
            Articles scraped and success rates by source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourcePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="articles" fill="hsl(var(--primary))" name="Articles Scraped" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourcePerformance}
                  dataKey="articles"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.articles}`}
                >
                  {sourcePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Table */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium">Detailed Metrics</h4>
            {sourcePerformance.map((perf, index) => (
              <div 
                key={perf.name}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="text-sm font-medium">{perf.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {perf.total} scrapes • {perf.articles} articles
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{perf.successRate.toFixed(1)}%</p>
                      {perf.successRate < thresholds.successRateThreshold && (
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <p className="text-sm font-medium">{perf.avgTime}s</p>
                      {perf.avgTime > 15 && (
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scraping Activity</CardTitle>
          <CardDescription>
            Latest scraping operations and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.slice(0, 10).map(log => (
              <div 
                key={log.id}
                className="flex items-center gap-4 p-3 rounded-lg border"
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.source_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })} • 
                    {log.new_articles} new articles • {(log.execution_time_ms / 1000).toFixed(1)}s
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    log.status === 'success' 
                      ? 'text-green-600 border-green-600'
                      : log.status === 'error'
                      ? 'text-red-600 border-red-600'
                      : 'text-orange-600 border-orange-600'
                  }
                >
                  {log.status === 'success' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {log.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
