import { Waves, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
                <Waves className="h-5 w-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="block font-display text-base font-bold tracking-tight">
                  Streamwalkers
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Trader Pro
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.tagline")}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              support@streamwalkers.com
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">{t("footer.learn")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/education" className="hover:text-primary transition-colors">{t("footer.educationCenter")}</Link></li>
              <li><Link to="/education/courses" className="hover:text-primary transition-colors">{t("footer.courseCatalog")}</Link></li>
              <li><Link to="/education/finance-reference" className="hover:text-primary transition-colors">{t("footer.financeReference")}</Link></li>
              <li><Link to="/resources" className="hover:text-primary transition-colors">{t("footer.setupGuides")}</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">{t("footer.faq")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">{t("footer.getFunded")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#pricing" className="hover:text-primary transition-colors">{t("footer.fundingChallenges")}</a></li>
              <li><Link to="/trading-rules#evaluation" className="hover:text-primary transition-colors">{t("footer.evaluationProcess")}</Link></li>
              <li><Link to="/trading-rules#rules" className="hover:text-primary transition-colors">{t("footer.tradingRules")}</Link></li>
              <li><Link to="/trading-rules#profit-splits" className="hover:text-primary transition-colors">{t("footer.profitSplits")}</Link></li>
              <li><Link to="/trading-rules#withdrawals" className="hover:text-primary transition-colors">{t("footer.withdrawals")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">{t("footer.company")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t("footer.about")}</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">{t("footer.support")}</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li><a href="/#risk-disclosure" className="hover:text-primary transition-colors">{t("footer.risk")}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </div>
            <p className="text-xs text-muted-foreground max-w-xl text-center md:text-right">
              {t("footer.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
