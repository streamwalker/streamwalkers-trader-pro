import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Crown } from "lucide-react";

const ScalePlan = () => {
  const levels = [
    { level: "Starter", account: "$50K", color: "bg-muted" },
    { level: "Pro", account: "$100K", color: "bg-primary/20" },
    { level: "Elite", account: "$200K", color: "bg-primary/30" },
    { level: "Master", account: "$400K", color: "bg-profit/20" },
    { level: "Titan", account: "$1M", color: "bg-warning/20", crown: true },
  ];

  return (
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The <span className="bg-gradient-primary bg-clip-text text-transparent">Scale Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Prove yourself and grow your capital. Top traders can scale up to $1,000,000 in funded capital.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          {levels.map((level, i) => (
            <div key={level.level} className="flex items-center gap-3">
              <Card className={`${level.color} border-border shadow-card min-w-[140px]`}>
                <CardContent className="p-4 text-center">
                  {level.crown && <Crown className="w-5 h-5 text-warning mx-auto mb-1" />}
                  <div className="text-xs text-muted-foreground">{level.level}</div>
                  <div className="text-xl font-bold">{level.account}</div>
                </CardContent>
              </Card>
              {i < levels.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center space-y-2">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-profit" /> Consistent Profitability Required</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-profit" /> Automatic Scaling</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-profit" /> Real Capital at Titan Level</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScalePlan;
