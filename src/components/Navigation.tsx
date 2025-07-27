import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Streamwalkers Trader Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Trading Tools
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#education" className="text-foreground hover:text-primary transition-colors">
              Education
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button variant="hero" size="sm">
              Get Funded
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-foreground hover:bg-muted rounded-md">
                Trading Tools
              </a>
              <a href="#pricing" className="block px-3 py-2 text-foreground hover:bg-muted rounded-md">
                Pricing
              </a>
              <a href="#education" className="block px-3 py-2 text-foreground hover:bg-muted rounded-md">
                Education
              </a>
              <a href="#about" className="block px-3 py-2 text-foreground hover:bg-muted rounded-md">
                About
              </a>
              <div className="pt-4 pb-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
                <Button variant="hero" size="sm" className="w-full">
                  Get Funded
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;