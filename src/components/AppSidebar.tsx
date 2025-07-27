import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  User, 
  DollarSign,
  BookOpen,
  Activity,
  Shield,
  FileText,
  Home,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home 
  },
  { 
    title: "Business Plan", 
    url: "/business-plan", 
    icon: FileText 
  },
]

const tradingToolsItems = [
  { 
    title: "Order Flow", 
    url: "/tools/order-flow", 
    icon: Activity 
  },
  { 
    title: "Market Analysis", 
    url: "/tools/analysis", 
    icon: BarChart3 
  },
  { 
    title: "Risk Management", 
    url: "/tools/risk", 
    icon: Shield 
  },
]

const accountItems = [
  { 
    title: "Funding", 
    url: "/account/funding", 
    icon: DollarSign 
  },
  { 
    title: "Performance", 
    url: "/account/performance", 
    icon: TrendingUp 
  },
  { 
    title: "Settings", 
    url: "/account/settings", 
    icon: Settings 
  },
]

const supportItems = [
  { 
    title: "Education Center", 
    url: "/education", 
    icon: BookOpen 
  },
  { 
    title: "Help & Support", 
    url: "/support", 
    icon: HelpCircle 
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50"

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar-background`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-sidebar-primary" />
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">
              StreamWalkers
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 text-sidebar-foreground" />
                      {!isCollapsed && (
                        <span className="text-sidebar-foreground">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trading Tools */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Trading Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {tradingToolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 text-sidebar-foreground" />
                      {!isCollapsed && (
                        <span className="text-sidebar-foreground">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 text-sidebar-foreground" />
                      {!isCollapsed && (
                        <span className="text-sidebar-foreground">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 text-sidebar-foreground" />
                      {!isCollapsed && (
                        <span className="text-sidebar-foreground">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">Trader Pro</p>
              <p className="text-xs text-sidebar-foreground/70">Active Account</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}