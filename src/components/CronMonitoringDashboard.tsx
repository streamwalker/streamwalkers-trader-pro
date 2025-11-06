import { useCronMonitoring } from '@/hooks/useCronMonitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  Play, 
  Pause, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Activity,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export function CronMonitoringDashboard() {
  const { 
    cronJobs, 
    sources, 
    stats, 
    isLoading, 
    toggleCronJob, 
    triggerManualScrape 
  } = useCronMonitoring();

  const mainCronJob = cronJobs.find(job => job.jobname === 'scrape-news-every-4-hours');

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scraping Monitor</h2>
          <p className="text-muted-foreground">
            Automated news scraping status and history
          </p>
        </div>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
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
            {sources
              .filter(s => s.last_scraped_at)
              .slice(0, 5)
              .map(source => (
                <div 
                  key={source.id}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Scraped {formatDistanceToNow(new Date(source.last_scraped_at!), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Success
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
