import { DollarSign, Users, TrendingUp, Shield, Clock, Award } from "lucide-react";

const TrustSection = () => {
  const stats = [
    { icon: DollarSign, value: "$18.4M+", label: "Paid Out To Traders", color: "text-profit" },
    { icon: Users, value: "12,417+", label: "Traders Funded", color: "text-primary" },
    { icon: TrendingUp, value: "90%", label: "Profit Split", color: "text-warning" },
    { icon: Clock, value: "24hrs", label: "Average Payout Time", color: "text-primary" },
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
