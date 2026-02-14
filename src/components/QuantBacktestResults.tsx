import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useBacktests, QuantBacktest } from '@/hooks/useQuantEngine';
import { TrendingUp, TrendingDown, BarChart3, Activity, Target, Percent, Zap, Clock } from 'lucide-react';

interface Props { strategyId?: string }

function MetricCard({ label, value, suffix, icon: Icon, positive }: { label: string; value: string | number; suffix?: string; icon: any; positive?: boolean }) {
  return (
    <div className="p-4 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className={`text-xl font-bold ${positive === true ? 'text-emerald-500' : positive === false ? 'text-destructive' : 'text-foreground'}`}>
        {value}{suffix}
      </p>
    </div>
  );
}

export default function QuantBacktestResults({ strategyId }: Props) {
  const { data: backtests, isLoading } = useBacktests(strategyId);
  const latest = backtests?.[0];

  if (isLoading) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading backtests...</div>;
  if (!latest) return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No backtest results yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Configure a strategy and run a backtest to see results</p>
      </CardContent>
    </Card>
  );

  const m = latest.metrics;
  const equityCurve = (latest.equity_curve as any[]) || [];
  const drawdownCurve = (latest.drawdown_curve as any[]) || [];
  const trades = (latest.trades as any[]) || [];

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="flex items-center gap-3">
        <Badge variant={latest.status === 'completed' ? 'default' : 'secondary'}>{latest.status}</Badge>
        {latest.completed_at && <span className="text-xs text-muted-foreground">Completed {new Date(latest.completed_at).toLocaleString()}</span>}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="CAGR" value={m.cagr} suffix="%" icon={TrendingUp} positive={m.cagr > 0} />
        <MetricCard label="Sharpe Ratio" value={m.sharpe} icon={Activity} positive={m.sharpe > 1} />
        <MetricCard label="Sortino Ratio" value={m.sortino} icon={Zap} positive={m.sortino > 1} />
        <MetricCard label="Max Drawdown" value={m.max_drawdown} suffix="%" icon={TrendingDown} positive={m.max_drawdown < 15} />
        <MetricCard label="Win Rate" value={m.win_rate} suffix="%" icon={Target} positive={m.win_rate > 50} />
        <MetricCard label="Profit Factor" value={m.profit_factor} icon={Percent} positive={m.profit_factor > 1.5} />
        <MetricCard label="Total Trades" value={m.total_trades} icon={BarChart3} />
        <MetricCard label="Total Return" value={m.total_return} suffix="%" icon={TrendingUp} positive={m.total_return > 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Equity']} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#eqGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Drawdown Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={drawdownCurve}>
                <defs>
                  <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: number) => `${v.toFixed(1)}%`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`${v.toFixed(2)}%`, 'Drawdown']} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--destructive))" fill="url(#ddGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trades Table */}
      {trades.length > 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Trades ({trades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead className="text-right">Entry $</TableHead>
                  <TableHead className="text-right">Exit $</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.slice(0, 20).map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{t.symbol}</TableCell>
                    <TableCell className="text-xs">{t.entry_date}</TableCell>
                    <TableCell className="text-xs">{t.exit_date}</TableCell>
                    <TableCell className="text-right">${t.entry_price}</TableCell>
                    <TableCell className="text-right">${t.exit_price}</TableCell>
                    <TableCell className={`text-right font-medium ${t.pnl >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                      ${t.pnl?.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right ${t.return_pct >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                      {t.return_pct}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
