import MarketingNav from "@/components/MarketingNav";
import Footer from "@/components/Footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

/**
 * Public-facing shell: top navigation + footer, light premium theme.
 * Used for the marketing site, education funnel, and legal pages.
 */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
