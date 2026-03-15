import { DollarSign, Users, TrendingUp, Clock, Globe, Shield } from "lucide-react";

const TrustSection = () => {
  const stats = [
    { icon: DollarSign, value: "$18.4M+", label: "Paid Out To Traders", color: "text-profit" },
    { icon: Users, value: "12,417+", label: "Traders Funded", color: "text-primary" },
    { icon: TrendingUp, value: "90%", label: "Profit Split", color: "text-warning" },
    { icon: Clock, value: "7 Days", label: "Average Payout Cycle", color: "text-primary" },
    { icon: Globe, value: "120+", label: "Countries", color: "text-profit" },
    { icon: Shield, value: "24hrs", label: "Account Activation", color: "text-warning" },
  ];

  const recentPayouts = [
    { name: "M. Rodriguez", amount: "$4,230", location: "Spain", timeAgo: "2 hours ago" },
    { name: "J. Chen", amount: "$8,740", location: "Singapore", timeAgo: "5 hours ago" },
    { name: "A. Williams", amount: "$12,100", location: "USA", timeAgo: "1 day ago" },
    { name: "K. Müller", amount: "$6,890", location: "Germany", timeAgo: "1 day ago" },
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center">
                <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recent Payouts */}
        <div className="border-t border-border pt-8">
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">Recent Payouts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentPayouts.map((payout, i) => (
              <div key={i} className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-profit">{payout.amount}</div>
                <div className="text-sm font-medium mt-1">{payout.name}</div>
                <div className="text-xs text-muted-foreground">{payout.location} • {payout.timeAgo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
