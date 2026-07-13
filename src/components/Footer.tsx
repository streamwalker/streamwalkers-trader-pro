import { Waves, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              Learn to trade with structured courses, prove your skill in our evaluation,
              and trade funded accounts up to $200K — keeping up to 90% of the profits.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              support@streamwalkers.com
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/education" className="hover:text-primary transition-colors">Education Center</Link></li>
              <li><Link to="/education/courses" className="hover:text-primary transition-colors">Course Catalog</Link></li>
              <li><Link to="/education/finance-reference" className="hover:text-primary transition-colors">Finance Reference</Link></li>
              <li><Link to="/resources" className="hover:text-primary transition-colors">Platform Setup Guides</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Get Funded */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Get Funded</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#pricing" className="hover:text-primary transition-colors">Funding Challenges</a></li>
              <li><Link to="/trading-rules#evaluation" className="hover:text-primary transition-colors">Evaluation Process</Link></li>
              <li><Link to="/trading-rules#rules" className="hover:text-primary transition-colors">Trading Rules</Link></li>
              <li><Link to="/trading-rules#profit-splits" className="hover:text-primary transition-colors">Profit Splits</Link></li>
              <li><Link to="/trading-rules#withdrawals" className="hover:text-primary transition-colors">Withdrawals</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">Help & Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><a href="/#risk-disclosure" className="hover:text-primary transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Streamwalkers Corporation. All rights reserved.
            </div>
            <p className="text-xs text-muted-foreground max-w-xl text-center md:text-right">
              Futures trading involves substantial risk of loss and is not suitable for every investor.
              Evaluations are conducted in simulated environments.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
