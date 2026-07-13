import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Waves, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Application shell used for authenticated trading pages.
 * Uses the site-wide theme (light/dark/system) — no forced dark wrapper.
 */
export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="p-2 rounded-md hover:bg-muted/50 backdrop-blur-sm">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>

                <div className="flex items-center gap-2 md:hidden">
                  <Waves className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold font-display tracking-tight">
                    Streamwalkers
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                  {t("common.home")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  {t("common.login")}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/#pricing")}
                >
                  {t("common.getFunded")}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
