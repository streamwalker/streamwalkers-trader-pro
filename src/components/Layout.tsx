import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { TrendingUp, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="p-2 rounded-md hover:bg-muted/50 backdrop-blur-sm">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                
                {/* Mobile logo - only show when sidebar is collapsed on mobile */}
                <div className="flex items-center gap-2 md:hidden">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Equiforge
                  </span>
                </div>
              </div>

              {/* Auth buttons */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                  Login
                </Button>
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/auth')}>
                  Get Funded
                </Button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}