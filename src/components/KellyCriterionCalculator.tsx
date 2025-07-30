import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

export const KellyCriterionCalculator = () => {
  const [winRate, setWinRate] = useState<number>(55);
  const [avgWin, setAvgWin] = useState<number>(200);
  const [avgLoss, setAvgLoss] = useState<number>(100);
  const [accountSize, setAccountSize] = useState<number>(27000);
  
  const calculateKelly = () => {
    const p = winRate / 100; // Win probability
    const q = 1 - p; // Loss probability
    const b = avgWin / avgLoss; // Win/loss ratio
    
    // Kelly formula: f = (bp - q) / b
    const kellyFraction = (b * p - q) / b;
    return Math.max(0, kellyFraction); // Never go negative
  };

  const kellyFraction = calculateKelly();
  const kellyPercentage = kellyFraction * 100;
  const recommendedRisk = Math.min(kellyPercentage, 25); // Cap at 25% for safety
  const positionSize = accountSize * (recommendedRisk / 100);
  
  const expectedValue = (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss;
  const profitFactor = (winRate / 100 * avgWin) / ((100 - winRate) / 100 * avgLoss);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Kelly Criterion Position Sizing
        </CardTitle>
        <CardDescription>
          Optimal position sizing for maximum growth while managing risk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="winRate">Win Rate (%)</Label>
            <Input
              id="winRate"
              type="number"
              value={winRate}
              onChange={(e) => setWinRate(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgWin">Average Win ($)</Label>
            <Input
              id="avgWin"
              type="number"
              value={avgWin}
              onChange={(e) => setAvgWin(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgLoss">Average Loss ($)</Label>
            <Input
              id="avgLoss"
              type="number"
              value={avgLoss}
              onChange={(e) => setAvgLoss(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountSize">Account Size ($)</Label>
            <Input
              id="accountSize"
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{kellyPercentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Kelly %</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{recommendedRisk.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Recommended Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">${positionSize.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Position Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{profitFactor.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Profit Factor</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Expected Value per Trade:</span>
            <span className={expectedValue > 0 ? 'text-green-500' : 'text-red-500'}>
              ${expectedValue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Risk/Reward Ratio:</span>
            <span>{(avgWin / avgLoss).toFixed(2)}:1</span>
          </div>
        </div>

        {kellyPercentage > 25 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Kelly suggests {kellyPercentage.toFixed(1)}% risk, but we recommend capping at 25% for safety. 
              High Kelly percentages indicate excellent edge but require careful risk management.
            </AlertDescription>
          </Alert>
        )}

        {expectedValue <= 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Negative expected value! This strategy will lose money over time. 
              Improve your win rate or risk/reward ratio before trading.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="font-semibold text-green-700">Conservative (50% Kelly)</div>
            <div className="text-green-600">{(recommendedRisk * 0.5).toFixed(1)}% risk</div>
            <div className="text-green-600">${(positionSize * 0.5).toLocaleString()}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded border border-orange-200">
            <div className="font-semibold text-orange-700">Optimal (Full Kelly)</div>
            <div className="text-orange-600">{recommendedRisk.toFixed(1)}% risk</div>
            <div className="text-orange-600">${positionSize.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <div className="font-semibold text-red-700">Aggressive (150% Kelly)</div>
            <div className="text-red-600">{(recommendedRisk * 1.5).toFixed(1)}% risk</div>
            <div className="text-red-600">${(positionSize * 1.5).toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};