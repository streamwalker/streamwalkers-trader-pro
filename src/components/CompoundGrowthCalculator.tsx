import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp } from 'lucide-react';

export const CompoundGrowthCalculator = () => {
  const [principal, setPrincipal] = useState<number>(27000);
  const [monthlyReturn, setMonthlyReturn] = useState<number>(15);
  const [months, setMonths] = useState<number>(60);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  const calculateGrowth = () => {
    const data = [];
    let currentValue = principal;
    
    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        currentValue = currentValue * (1 + monthlyReturn / 100) + monthlyContribution;
      }
      
      data.push({
        month,
        value: Math.round(currentValue),
        year: Math.round(month / 12 * 10) / 10,
      });
    }
    
    return data;
  };

  const growthData = calculateGrowth();
  const finalValue = growthData[growthData.length - 1].value;
  const totalGain = finalValue - principal;
  const totalReturn = ((finalValue / principal) - 1) * 100;
  const annualReturn = (Math.pow(finalValue / principal, 12 / months) - 1) * 100;

  // Calculate milestone achievements
  const milestones = [100000, 500000, 1000000, 5000000, 10000000, 20000000];
  const achievedMilestones = milestones.filter(milestone => finalValue >= milestone);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Compound Growth Calculator
        </CardTitle>
        <CardDescription>
          Model your path from $27K to $20M with compound returns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Starting Capital ($)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyReturn">Monthly Return (%)</Label>
            <Input
              id="monthlyReturn"
              type="number"
              value={monthlyReturn}
              onChange={(e) => setMonthlyReturn(Number(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="months">Time Period (Months)</Label>
            <Input
              id="months"
              type="number"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              min="1"
              max="120"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly Addition ($)</Label>
            <Input
              id="monthlyContribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatCurrency(finalValue)}</div>
            <div className="text-sm text-muted-foreground">Final Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalGain)}</div>
            <div className="text-sm text-muted-foreground">Total Gain</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{totalReturn.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Total Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{annualReturn.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Annual Return</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                tickFormatter={formatCurrency}
                label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Portfolio Value']}
                labelFormatter={(value) => `Year ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={false}
              />
              {/* Add milestone lines */}
              <Line 
                type="monotone" 
                dataKey={() => 1000000} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                dot={false}
                strokeWidth={1}
              />
              <Line 
                type="monotone" 
                dataKey={() => 10000000} 
                stroke="#f97316" 
                strokeDasharray="5 5" 
                dot={false}
                strokeWidth={1}
              />
              <Line 
                type="monotone" 
                dataKey={() => 20000000} 
                stroke="#22c55e" 
                strokeDasharray="5 5" 
                dot={false}
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Milestone Progress</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {milestones.map((milestone) => (
              <div 
                key={milestone}
                className={`p-2 text-center rounded text-sm ${
                  finalValue >= milestone 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}
              >
                <div className="font-semibold">{formatCurrency(milestone)}</div>
                <div className="text-xs">
                  {finalValue >= milestone ? '✓ Achieved' : 'Not Reached'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> {monthlyReturn}% monthly return equals {annualReturn.toFixed(1)}% annually. 
            This is extremely aggressive and requires exceptional trading skill and risk management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};