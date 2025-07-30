import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, DollarSign, Calendar } from 'lucide-react';

interface Milestone {
  amount: number;
  label: string;
  timeframe: string;
  requiredReturn: number;
  achieved: boolean;
}

export const CapitalGrowthDashboard = () => {
  const currentCapital = 27000; // Starting amount
  const targetCapital = 20000000; // Target amount
  
  const milestones: Milestone[] = [
    { amount: 50000, label: "First Milestone", timeframe: "Month 3", requiredReturn: 85, achieved: false },
    { amount: 135000, label: "Year 1 Target", timeframe: "Year 1", requiredReturn: 400, achieved: false },
    { amount: 500000, label: "Half Million", timeframe: "Year 2", requiredReturn: 270, achieved: false },
    { amount: 1000000, label: "Millionaire", timeframe: "Year 2.5", requiredReturn: 100, achieved: false },
    { amount: 3375000, label: "Multi-Millionaire", timeframe: "Year 3", requiredReturn: 237, achieved: false },
    { amount: 10000000, label: "Ten Million", timeframe: "Year 4", requiredReturn: 196, achieved: false },
    { amount: 20000000, label: "Ultimate Goal", timeframe: "Year 5", requiredReturn: 100, achieved: false },
  ];

  const progressPercentage = (currentCapital / targetCapital) * 100;
  const nextMilestone = milestones.find(m => !m.achieved);

  const calculateRequiredMonthlyReturn = (target: number, months: number) => {
    return (Math.pow(target / currentCapital, 1/months) - 1) * 100;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Capital Growth Journey: $27K → $20M
          </CardTitle>
          <CardDescription>
            Transform your capital through disciplined high-growth trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Ultimate Goal</span>
              <span>{progressPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${currentCapital.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Current Capital</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">${targetCapital.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Target Goal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">741x</div>
              <div className="text-sm text-muted-foreground">Growth Multiple</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">5 Years</div>
              <div className="text-sm text-muted-foreground">Time Horizon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {nextMilestone && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <TrendingUp className="h-5 w-5" />
              Next Milestone: {nextMilestone.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ${nextMilestone.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Target Amount</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {nextMilestone.requiredReturn}%
                </div>
                <div className="text-sm text-muted-foreground">Required Return</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {nextMilestone.timeframe}
                </div>
                <div className="text-sm text-muted-foreground">Timeline</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Growth Milestones</CardTitle>
          <CardDescription>Track your progress through each phase of capital growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">${milestone.amount.toLocaleString()}</span>
                  </div>
                  <Badge variant={milestone.achieved ? "default" : "secondary"}>
                    {milestone.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {milestone.timeframe}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {milestone.requiredReturn}% return
                  </div>
                  <Badge variant={milestone.achieved ? "default" : "outline"}>
                    {milestone.achieved ? "Achieved" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};