import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Waves, Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", to: "/#how-it-works", hash: true },
  { label: "Pricing", to: "/#pricing", hash: true },
  { label: "Education", to: "/education" },
  { label: "FAQ", to: "/faq" },
  { label: "About", to: "/about" },
];

const MarketingNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const linkCls =
    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop nav */}
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

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Log in
            </Button>
            <Button
              size="sm"
              className="shadow-primary"
              onClick={() => navigate("/education")}
            >
              Start Learning Free
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-6 pt-4 space-y-4">
          {navLinks.map((l) =>
            l.hash ? (
              <a key={l.label} href={l.to} className="block text-sm font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ) : (
              <NavLink key={l.label} to={l.to} className="block text-sm font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            )
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => { setOpen(false); navigate("/auth"); }}>
              Log in
            </Button>
            <Button size="sm" className="flex-1" onClick={() => { setOpen(false); navigate("/education"); }}>
              Start Learning Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNav;
