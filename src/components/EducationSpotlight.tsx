import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, LineChart, Shield, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EducationSpotlight = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tracks = [
    { icon: BookOpen, title: t("education.track1Title"), level: t("education.levelBeginner"), description: t("education.track1Desc") },
    { icon: LineChart, title: t("education.track2Title"), level: t("education.levelIntermediate"), description: t("education.track2Desc") },
    { icon: Shield, title: t("education.track3Title"), level: t("education.levelEssential"), description: t("education.track3Desc") },
    { icon: Trophy, title: t("education.track4Title"), level: t("education.levelAdvanced"), description: t("education.track4Desc") },
  ];

  return (
    <section id="education" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            {t("education.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("education.titlePrefix")}{" "}
            <span className="text-gradient-primary">{t("education.titleAccent")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{t("education.subtitle")}</p>
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
                <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="group shadow-primary" onClick={() => navigate("/education")}>
            {t("education.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">{t("education.ctaSubtext")}</p>
        </div>
      </div>
    </section>
  );
};

export default EducationSpotlight;
