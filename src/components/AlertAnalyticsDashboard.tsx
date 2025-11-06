import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlertAnalytics } from "@/hooks/useAlertAnalytics";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Clock, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = {
  critical: 'hsl(var(--destructive))',
  error: 'hsl(var(--warning))',
  warning: 'hsl(var(--accent))',
  pending: 'hsl(var(--warning))',
  acknowledged: 'hsl(var(--accent))',
  investigating: 'hsl(var(--secondary))',
  resolved: 'hsl(var(--success))',
};

export const AlertAnalyticsDashboard = () => {
  const [timePeriod, setTimePeriod] = useState<number>(30);
  const { alertTrends, resolutionStats, teamPerformance, typeDistribution, statusDistribution, summaryStats } = useAlertAnalytics(timePeriod);
  const { teamMembers } = useTeamMembers();

  const getFastestResolverName = () => {
    if (!summaryStats?.fastestResolver) return "N/A";
    const member = teamMembers.find(m => m.id === summaryStats.fastestResolver);
    return member?.display_name || member?.email || "Unknown";
  };

  const getMostActiveInvestigator = () => {
    if (!teamPerformance || teamPerformance.length === 0) return "N/A";
    const mostActive = teamPerformance.reduce((prev, current) => 
      current.assigned_count > prev.assigned_count ? current : prev
    );
    return mostActive.display_name || "Unknown";
  };

  if (!summaryStats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={timePeriod.toString()} onValueChange={(v) => setTimePeriod(Number(v))}>
        <TabsList>
          <TabsTrigger value="7">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30">Last 30 Days</TabsTrigger>
          <TabsTrigger value="90">Last 90 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats.avgResolutionTime.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Average time to resolve alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              In the last {timePeriod} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fastest Resolver</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{getFastestResolverName()}</div>
            <p className="text-xs text-muted-foreground">
              Lowest avg resolution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{getMostActiveInvestigator()}</div>
            <p className="text-xs text-muted-foreground">
              Most alerts assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Trends Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="critical" stroke={COLORS.critical} name="Critical" />
                <Line type="monotone" dataKey="error" stroke={COLORS.error} name="Error" />
                <Line type="monotone" dataKey="warning" stroke={COLORS.warning} name="Warning" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="alert_type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="critical" fill={COLORS.critical} name="Critical" />
                <Bar dataKey="error" fill={COLORS.error} name="Error" />
                <Bar dataKey="warning" fill={COLORS.warning} name="Warning" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || 'hsl(var(--muted))'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time by Alert Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="alert_type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg_hours" fill="hsl(var(--primary))" name="Avg Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead className="text-right">Assigned</TableHead>
                <TableHead className="text-right">Resolved</TableHead>
                <TableHead className="text-right">Avg Resolution Time</TableHead>
                <TableHead className="text-right">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamPerformance && teamPerformance.length > 0 ? (
                teamPerformance
                  .sort((a, b) => b.resolved_count - a.resolved_count)
                  .map((member) => (
                    <TableRow key={member.user_id}>
                      <TableCell className="font-medium">
                        {member.display_name || member.email}
                      </TableCell>
                      <TableCell className="text-right">{member.assigned_count}</TableCell>
                      <TableCell className="text-right">
                        <span className={member.resolved_count > 0 ? "text-success" : ""}>
                          {member.resolved_count}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {member.avg_resolution_hours > 0 ? (
                          <span className={member.avg_resolution_hours < 2 ? "text-success" : member.avg_resolution_hours > 6 ? "text-warning" : ""}>
                            {member.avg_resolution_hours.toFixed(1)}h
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {member.last_activity ? formatDistanceToNow(new Date(member.last_activity), { addSuffix: true }) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No team performance data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
