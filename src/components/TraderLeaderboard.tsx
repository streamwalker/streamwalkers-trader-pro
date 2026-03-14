import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

const TraderLeaderboard = () => {
  const leaders = [
    { rank: 1, name: "QuantumAlpha", profit: "$92,340", winRate: "74%", score: 97 },
    { rank: 2, name: "AstroTrader", profit: "$77,510", winRate: "69%", score: 94 },
    { rank: 3, name: "MacroHunter", profit: "$61,280", winRate: "71%", score: 91 },
    { rank: 4, name: "DeltaForce", profit: "$54,120", winRate: "68%", score: 88 },
    { rank: 5, name: "VolumeKing", profit: "$48,900", winRate: "66%", score: 85 },
    { rank: 6, name: "NightOwlFX", profit: "$43,770", winRate: "72%", score: 83 },
    { rank: 7, name: "IronCondor", profit: "$39,450", winRate: "65%", score: 81 },
    { rank: 8, name: "SwingMaster", profit: "$35,200", winRate: "63%", score: 79 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-warning" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-5 h-5 text-warning/70" />;
    return <span className="text-sm font-mono text-muted-foreground w-5 text-center">{rank}</span>;
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* AI Trader Score */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI <span className="bg-gradient-primary bg-clip-text text-transparent">Trader Intelligence</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Our AI analyzes every trade, every pattern, every behavior — giving you a real-time Trader Score 
              and personalized coaching to improve your performance.
            </p>

            {/* Example Trader Score Card */}
            <Card className="shadow-glow border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Trader Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold text-primary">82</div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>

                {[
                  { label: "Risk Discipline", value: 91, color: "bg-profit" },
                  { label: "Trend Capture", value: 74, color: "bg-primary" },
                  { label: "Entry Timing", value: 85, color: "bg-profit" },
                  { label: "Overtrading Risk", value: 45, color: "bg-warning" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{metric.label}</span>
                      <span className="font-mono">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-xs font-semibold text-primary mb-1">AI Coaching Suggestion</div>
                  <p className="text-xs text-muted-foreground">
                    Reduce position size on volatile sessions. Your risk discipline is strong — 
                    focus on improving trend capture by holding winners longer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trader <span className="bg-gradient-accent bg-clip-text text-transparent">Rankings</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Compete with funded traders worldwide. Top performers earn larger capital allocations and partnership opportunities.
            </p>

            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {leaders.map((trader) => (
                    <div key={trader.rank} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(trader.rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{trader.name}</div>
                        <div className="text-xs text-muted-foreground">Win Rate: {trader.winRate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-profit text-sm">{trader.profit}</div>
                        <div className="text-xs text-muted-foreground">Score: {trader.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraderLeaderboard;
