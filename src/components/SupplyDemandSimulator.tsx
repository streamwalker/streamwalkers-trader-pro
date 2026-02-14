import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

export const SupplyDemandSimulator = () => {
  // Base curves: Qd = a - bP, Qs = c + dP
  const [demandIntercept, setDemandIntercept] = useState(200);
  const [demandSlope, setDemandSlope] = useState(2);
  const [supplyIntercept, setSupplyIntercept] = useState(20);
  const [supplySlope, setSupplySlope] = useState(1.5);

  // Shift factors
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);

  // Elasticity inputs
  const [p1, setP1] = useState(10);
  const [p2, setP2] = useState(12);
  const [q1, setQ1] = useState(100);
  const [q2, setQ2] = useState(85);

  const a = demandIntercept + demandShift;
  const b = demandSlope;
  const c = supplyIntercept + supplyShift;
  const d = supplySlope;

  const eqPrice = (b + d) > 0 ? (a - c) / (b + d) : 0;
  const eqQuantity = a - b * eqPrice;

  const chartData = useMemo(() => {
    const maxP = Math.max(eqPrice * 2.5, 50);
    return Array.from({ length: 30 }, (_, i) => {
      const price = (maxP / 29) * i;
      return {
        price: +price.toFixed(2),
        demand: Math.max(0, a - b * price),
        supply: Math.max(0, c + d * price),
      };
    });
  }, [a, b, c, d, eqPrice]);

  // Midpoint elasticity
  const midQ = (q1 + q2) / 2;
  const midP = (p1 + p2) / 2;
  const elasticity = midP !== 0 && midQ !== 0 ? ((q2 - q1) / midQ) / ((p2 - p1) / midP) : 0;
  const elasticityType = Math.abs(elasticity) > 1 ? 'Elastic' : Math.abs(elasticity) === 1 ? 'Unit Elastic' : 'Inelastic';

  // Surplus at equilibrium
  const consumerSurplus = 0.5 * eqQuantity * ((a / b) - eqPrice);
  const producerSurplus = 0.5 * eqQuantity * (eqPrice - (c > 0 ? -c / d : 0));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supply & Demand Simulator</CardTitle>
          <CardDescription>Interactive equilibrium, surplus analysis, and price elasticity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Demand Curve: Qd = {a} - {b}P</h4>
              <div className="space-y-2">
                <Label className="text-xs">Demand Intercept (a): {demandIntercept}</Label>
                <Slider value={[demandIntercept]} onValueChange={v => setDemandIntercept(v[0])} min={50} max={500} step={10} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Demand Slope (b): {demandSlope}</Label>
                <Slider value={[demandSlope * 10]} onValueChange={v => setDemandSlope(v[0] / 10)} min={5} max={50} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Demand Shift: {demandShift > 0 ? '+' : ''}{demandShift}</Label>
                <Slider value={[demandShift]} onValueChange={v => setDemandShift(v[0])} min={-100} max={100} step={5} />
                <p className="text-xs text-muted-foreground">Simulate: income changes, consumer expectations, substitutes/complements</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Supply Curve: Qs = {c} + {d}P</h4>
              <div className="space-y-2">
                <Label className="text-xs">Supply Intercept (c): {supplyIntercept}</Label>
                <Slider value={[supplyIntercept]} onValueChange={v => setSupplyIntercept(v[0])} min={-50} max={200} step={10} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Supply Slope (d): {supplySlope}</Label>
                <Slider value={[supplySlope * 10]} onValueChange={v => setSupplySlope(v[0] / 10)} min={5} max={50} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Supply Shift: {supplyShift > 0 ? '+' : ''}{supplyShift}</Label>
                <Slider value={[supplyShift]} onValueChange={v => setSupplyShift(v[0])} min={-100} max={100} step={5} />
                <p className="text-xs text-muted-foreground">Simulate: resource prices, technology, taxes, number of suppliers</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-accent/30 bg-accent/5"><CardContent className="pt-3 text-center"><p className="text-xs text-muted-foreground">Equilibrium Price</p><p className="text-lg font-bold text-accent">${eqPrice.toFixed(2)}</p></CardContent></Card>
            <Card className="border-primary/30"><CardContent className="pt-3 text-center"><p className="text-xs text-muted-foreground">Equilibrium Qty</p><p className="text-lg font-bold">{eqQuantity.toFixed(0)}</p></CardContent></Card>
            <Card className="border-primary/20"><CardContent className="pt-3 text-center"><p className="text-xs text-muted-foreground">Consumer Surplus</p><p className="text-lg font-bold">${consumerSurplus.toFixed(0)}</p></CardContent></Card>
            <Card className="border-primary/20"><CardContent className="pt-3 text-center"><p className="text-xs text-muted-foreground">Producer Surplus</p><p className="text-lg font-bold">${producerSurplus.toFixed(0)}</p></CardContent></Card>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="price" label={{ value: 'Price', position: 'insideBottom', offset: -5 }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="demand" stroke="hsl(var(--primary))" name="Demand" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="supply" stroke="hsl(var(--accent))" name="Supply" strokeWidth={2} dot={false} />
                {eqPrice > 0 && eqQuantity > 0 && <ReferenceDot x={+eqPrice.toFixed(2)} y={+eqQuantity.toFixed(0)} r={6} fill="hsl(var(--destructive))" stroke="none" />}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Price Elasticity of Demand (Midpoint Method)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="space-y-1"><Label className="text-xs">P₁</Label><Input type="number" value={p1} onChange={e => setP1(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">P₂</Label><Input type="number" value={p2} onChange={e => setP2(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Q₁</Label><Input type="number" value={q1} onChange={e => setQ1(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Q₂</Label><Input type="number" value={q2} onChange={e => setQ2(+e.target.value || 0)} className="h-7 text-sm" /></div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm">Elasticity: <span className="font-bold">{elasticity.toFixed(3)}</span></p>
                <Badge variant={Math.abs(elasticity) > 1 ? 'destructive' : 'default'}>{elasticityType}</Badge>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
