import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Waves, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const MarketingNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navLinks = [
    { label: t("nav.howItWorks"), to: "/#how-it-works", hash: true },
    { label: t("nav.pricing"), to: "/#pricing", hash: true },
    { label: t("nav.education"), to: "/education" },
    { label: t("nav.faq"), to: "/faq" },
    { label: t("nav.about"), to: "/about" },
  ];

  const linkCls =
    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-primary">
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
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) =>
              l.hash ? (
                <a key={l.label} href={l.to} className={linkCls}>
                  {l.label}
                </a>
              ) : (
                <NavLink key={l.label} to={l.to} className={linkCls}>
                  {l.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              {t("common.login")}
            </Button>
            <Button
              size="sm"
              className="shadow-primary ml-1"
              onClick={() => navigate("/education")}
            >
              {t("common.startLearningFree")}
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label={t("nav.toggleMenu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-6 pt-4 space-y-4">
          {navLinks.map((l) =>
            l.hash ? (
              <a
                key={l.label}
                href={l.to}
                className="block text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.label}
                to={l.to}
                className="block text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            )
          )}
          <div className="flex items-center gap-2 pt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setOpen(false);
                navigate("/auth");
              }}
            >
              {t("common.login")}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                setOpen(false);
                navigate("/education");
              }}
            >
              {t("common.startLearningFree")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNav;
