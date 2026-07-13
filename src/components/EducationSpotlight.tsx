import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, LineChart, Shield, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tracks = [
  {
    icon: BookOpen,
    title: "Trading Foundations",
    level: "Beginner",
    description:
      "Candlesticks, market structure, and order types — everything you need before your first trade, explained in plain English.",
  },
  {
    icon: LineChart,
    title: "Technical Analysis",
    level: "Intermediate",
    description:
      "Read price action with confidence: trends, support and resistance, volume, and the indicators that actually matter.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    level: "Essential",
    description:
      "The skill that separates funded traders from blown accounts. Position sizing, drawdown control, and trading psychology.",
  },
  {
    icon: Trophy,
    title: "Evaluation Prep",
    level: "Advanced",
    description:
      "A step-by-step playbook for passing your funding challenge — built from the data of thousands of evaluations.",
  },
];

const EducationSpotlight = () => {
  const navigate = useNavigate();

  return (
    <section id="education" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Education Center
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Start free. <span className="text-gradient-primary">Learn everything.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            You don't need experience to begin — you need a path. Our structured
            courses take you from zero to evaluation-ready, at your own pace.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.title}
                className="group bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/education/courses")}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
                  {track.level}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {track.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {track.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="group shadow-primary" onClick={() => navigate("/education")}>
            Explore the Education Center
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Free to start. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EducationSpotlight;
