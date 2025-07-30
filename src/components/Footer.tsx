import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  console.log('Footer component loaded successfully');
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Streamwalkers Trader Pro
              </span>
            </div>
            <p className="text-muted-foreground">
              Professional trading platform providing funded accounts and cutting-edge tools for serious traders.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                support@streamwalkerstraderpro.com
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                New York, NY
              </div>
            </div>
          </div>

          {/* Trading */}
          <div>
            <h3 className="font-semibold mb-4">Trading</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Evaluation Process</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trading Rules</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Funded Accounts</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Profit Splits</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Withdrawals</a></li>
            </ul>
          </div>

          {/* Tools & Education */}
          <div>
            <h3 className="font-semibold mb-4">Tools & Education</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Trading Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">NinjaTrader Setup</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tradovate Integration</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Video Tutorials</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trading Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Live Chat</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status Page</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 Streamwalkers Trader Pro. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Risk Disclosure</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;