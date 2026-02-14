import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ProbabilityExpectedValue = () => {
  const [outcomes, setOutcomes] = useState([
    { label: 'Big Win', value: 500, probability: 0.15 },
    { label: 'Small Win', value: 150, probability: 0.35 },
    { label: 'Break Even', value: 0, probability: 0.20 },
    { label: 'Small Loss', value: -100, probability: 0.20 },
    { label: 'Big Loss', value: -300, probability: 0.10 },
  ]);

  // Trade setup mode
  const [winProb, setWinProb] = useState(60);
  const [winAmount, setWinAmount] = useState(200);
  const [lossAmount, setLossAmount] = useState(150);

  const totalProb = outcomes.reduce((s, o) => s + o.probability, 0);
  const ev = outcomes.reduce((s, o) => s + o.value * o.probability, 0);
  const variance = outcomes.reduce((s, o) => s + o.probability * Math.pow(o.value - ev, 2), 0);
  const stdDev = Math.sqrt(variance);

  // Trade EV
  const wp = winProb / 100;
  const tradeEV = wp * winAmount - (1 - wp) * lossAmount;
  const tradeKelly = lossAmount > 0 ? (wp * (winAmount / lossAmount) - (1 - wp)) / (winAmount / lossAmount) : 0;

  const updateOutcome = (idx: number, field: string, val: string) => {
    const n = [...outcomes];
    (n[idx] as any)[field] = field === 'label' ? val : parseFloat(val) || 0;
    setOutcomes(n);
  };

  const chartData = outcomes.map(o => ({
    name: o.label,
    value: o.value,
    probability: o.probability,
    weightedValue: o.value * o.probability,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Probability Distribution</CardTitle>
            <CardDescription>Define outcomes and their probabilities to compute E(X)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {outcomes.map((o, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 items-end">
                  <div><Label className="text-xs">Outcome</Label><Input value={o.label} onChange={e => updateOutcome(idx, 'label', e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-xs">Value ($)</Label><Input type="number" value={o.value} onChange={e => updateOutcome(idx, 'value', e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-xs">P(x)</Label><Input type="number" step="0.01" value={o.probability} onChange={e => updateOutcome(idx, 'probability', e.target.value)} className="h-7 text-xs" /></div>
                  {outcomes.length > 2 && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOutcomes(outcomes.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button>}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setOutcomes([...outcomes, { label: `Outcome ${outcomes.length + 1}`, value: 0, probability: 0 }])} className="w-full"><Plus className="h-3 w-3 mr-1" /> Add Outcome</Button>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <Card className={totalProb > 1.001 || totalProb < 0.999 ? 'border-destructive/50' : 'border-accent/30'}>
                <CardContent className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground">ΣP(x)</p>
                  <p className="text-lg font-bold">{totalProb.toFixed(3)}</p>
                  <Badge variant={Math.abs(totalProb - 1) < 0.001 ? 'default' : 'destructive'} className="text-xs">{Math.abs(totalProb - 1) < 0.001 ? 'Valid' : 'Must = 1'}</Badge>
                </CardContent>
              </Card>
              <Card className="border-primary/30">
                <CardContent className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground">E(X)</p>
                  <p className={`text-lg font-bold ${ev >= 0 ? 'text-green-500' : 'text-red-500'}`}>${ev.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground">Std Dev</p>
                  <p className="text-lg font-bold">${stdDev.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Chart & Trade Setup */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Weighted Value Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="weightedValue" name="Weighted Value">
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.weightedValue >= 0 ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Trade Setup EV</CardTitle>
              <CardDescription>Simple win/loss expected value with Kelly Criterion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="text-xs">Win Prob (%)</Label><Input type="number" value={winProb} onChange={e => setWinProb(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Win Amount ($)</Label><Input type="number" value={winAmount} onChange={e => setWinAmount(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Loss Amount ($)</Label><Input type="number" value={lossAmount} onChange={e => setLossAmount(+e.target.value || 0)} className="h-7 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-primary/20">
                  <CardContent className="pt-3 text-center">
                    <p className="text-xs text-muted-foreground">Trade EV</p>
                    <p className={`text-lg font-bold ${tradeEV >= 0 ? 'text-green-500' : 'text-red-500'}`}>${tradeEV.toFixed(2)}</p>
                    <Badge variant={tradeEV >= 0 ? 'default' : 'destructive'}>{tradeEV >= 0 ? '+EV Trade' : '-EV Trade'}</Badge>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="pt-3 text-center">
                    <p className="text-xs text-muted-foreground">Kelly Fraction</p>
                    <p className="text-lg font-bold">{(tradeKelly * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Optimal position size</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
