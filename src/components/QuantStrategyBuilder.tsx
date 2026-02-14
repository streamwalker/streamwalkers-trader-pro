import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Play, Plus, X, Settings2, Shield, Target } from 'lucide-react';
import { useStrategies, useSaveStrategy, useRunBacktest, QuantStrategy } from '@/hooks/useQuantEngine';
import { toast } from 'sonner';

interface Props {
  onStrategySelect?: (id: string) => void;
  selectedStrategyId?: string;
}

export default function QuantStrategyBuilder({ onStrategySelect, selectedStrategyId }: Props) {
  const { data: strategies } = useStrategies();
  const saveStrategy = useSaveStrategy();
  const runBacktest = useRunBacktest();

  const [name, setName] = useState('My Trend Strategy');
  const [strategyType, setStrategyType] = useState('trend_follow');
  const [fastMA, setFastMA] = useState(20);
  const [slowMA, setSlowMA] = useState(100);
  const [volCap, setVolCap] = useState(2.0);
  const [zThreshold, setZThreshold] = useState(2.0);
  const [lookback, setLookback] = useState(20);
  const [maxPositionPct, setMaxPositionPct] = useState(10);
  const [maxDailyLossPct, setMaxDailyLossPct] = useState(3);
  const [maxDrawdownPct, setMaxDrawdownPct] = useState(15);
  const [killSwitch, setKillSwitch] = useState(true);
  const [universe, setUniverse] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL']);
  const [tickerInput, setTickerInput] = useState('');
  const [editingId, setEditingId] = useState<string | undefined>(selectedStrategyId);

  useEffect(() => {
    if (selectedStrategyId && strategies) {
      const s = strategies.find(s => s.id === selectedStrategyId);
      if (s) loadStrategy(s);
    }
  }, [selectedStrategyId, strategies]);

  function loadStrategy(s: QuantStrategy) {
    setEditingId(s.id);
    setName(s.name);
    setStrategyType(s.strategy_type);
    setUniverse(s.universe || []);
    const p = s.parameters || {};
    setFastMA(p.fast_ma || 20);
    setSlowMA(p.slow_ma || 100);
    setVolCap(p.vol_cap || 2.0);
    setZThreshold(p.z_threshold || 2.0);
    setLookback(p.lookback || 20);
    const r = s.risk_controls || {};
    setMaxPositionPct(r.max_position_pct || 10);
    setMaxDailyLossPct(r.max_daily_loss_pct || 3);
    setMaxDrawdownPct(r.max_drawdown_pct || 15);
    setKillSwitch(r.kill_switch !== false);
    onStrategySelect?.(s.id);
  }

  function handleSave() {
    const payload: Partial<QuantStrategy> = {
      ...(editingId ? { id: editingId } : {}),
      name,
      strategy_type: strategyType,
      universe,
      parameters: strategyType === 'trend_follow'
        ? { fast_ma: fastMA, slow_ma: slowMA, vol_cap: volCap }
        : { z_threshold: zThreshold, lookback, return_period: 5 },
      risk_controls: { max_position_pct: maxPositionPct, max_daily_loss_pct: maxDailyLossPct, max_drawdown_pct: maxDrawdownPct, kill_switch: killSwitch },
    };
    saveStrategy.mutate(payload, {
      onSuccess: (data: any) => {
        setEditingId(data.id);
        onStrategySelect?.(data.id);
      }
    });
  }

  function handleRunBacktest() {
    if (!editingId) { toast.error('Save the strategy first'); return; }
    runBacktest.mutate({ strategy_id: editingId });
  }

  function addTicker() {
    const t = tickerInput.trim().toUpperCase();
    if (t && !universe.includes(t)) { setUniverse([...universe, t]); }
    setTickerInput('');
  }

  return (
    <div className="space-y-6">
      {/* Saved strategies */}
      {strategies && strategies.length > 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Strategies</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {strategies.map(s => (
              <Button key={s.id} variant={editingId === s.id ? 'default' : 'outline'} size="sm" onClick={() => loadStrategy(s)}>
                {s.name}
                <Badge variant="secondary" className="ml-2 text-xs">{s.strategy_type === 'trend_follow' ? 'Trend' : 'MR'}</Badge>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Config */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary" />Strategy Configuration</CardTitle>
            <CardDescription>Define your quantitative strategy parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Strategy Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="My Strategy" />
            </div>

            <div className="space-y-2">
              <Label>Strategy Type</Label>
              <Select value={strategyType} onValueChange={setStrategyType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend_follow">Trend Follow + Vol Filter</SelectItem>
                  <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {strategyType === 'trend_follow' ? (
              <>
                <div className="space-y-2">
                  <Label>Fast MA Period: {fastMA}</Label>
                  <Slider min={5} max={50} step={1} value={[fastMA]} onValueChange={v => setFastMA(v[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Slow MA Period: {slowMA}</Label>
                  <Slider min={50} max={200} step={5} value={[slowMA]} onValueChange={v => setSlowMA(v[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Volatility Cap (ATR multiplier): {volCap}x</Label>
                  <Slider min={1} max={4} step={0.1} value={[volCap]} onValueChange={v => setVolCap(v[0])} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Z-Score Threshold: {zThreshold}</Label>
                  <Slider min={1} max={3} step={0.1} value={[zThreshold]} onValueChange={v => setZThreshold(v[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Lookback Period: {lookback}</Label>
                  <Slider min={10} max={60} step={5} value={[lookback]} onValueChange={v => setLookback(v[0])} />
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <Label>Universe (tickers)</Label>
              <div className="flex gap-2">
                <Input value={tickerInput} onChange={e => setTickerInput(e.target.value)} placeholder="AAPL" onKeyDown={e => e.key === 'Enter' && addTicker()} />
                <Button size="icon" variant="outline" onClick={addTicker}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {universe.map(t => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setUniverse(universe.filter(u => u !== t))} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Controls */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-destructive" />Risk Controls</CardTitle>
            <CardDescription>Non-negotiable risk limits to keep you alive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Max Position Size: {maxPositionPct}%</Label>
              <Slider min={1} max={25} step={1} value={[maxPositionPct]} onValueChange={v => setMaxPositionPct(v[0])} />
              <p className="text-xs text-muted-foreground">Maximum % of portfolio per position</p>
            </div>
            <div className="space-y-2">
              <Label>Max Daily Loss: {maxDailyLossPct}%</Label>
              <Slider min={1} max={10} step={0.5} value={[maxDailyLossPct]} onValueChange={v => setMaxDailyLossPct(v[0])} />
              <p className="text-xs text-muted-foreground">Hard stop on daily P&L</p>
            </div>
            <div className="space-y-2">
              <Label>Max Drawdown: {maxDrawdownPct}%</Label>
              <Slider min={5} max={30} step={1} value={[maxDrawdownPct]} onValueChange={v => setMaxDrawdownPct(v[0])} />
              <p className="text-xs text-muted-foreground">Kill switch trigger level</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-destructive/5">
              <div>
                <Label>Kill Switch</Label>
                <p className="text-xs text-muted-foreground">Auto-stop trading if max drawdown hit</p>
              </div>
              <Switch checked={killSwitch} onCheckedChange={setKillSwitch} />
            </div>

            <Separator />

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saveStrategy.isPending} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {saveStrategy.isPending ? 'Saving...' : editingId ? 'Update Strategy' : 'Save Strategy'}
              </Button>
              <Button onClick={handleRunBacktest} disabled={runBacktest.isPending || !editingId} variant="secondary" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                {runBacktest.isPending ? 'Running...' : 'Run Backtest'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
