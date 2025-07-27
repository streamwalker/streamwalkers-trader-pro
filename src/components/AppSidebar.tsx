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
  ChevronLeft,
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const { state, toggleSidebar } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-white/10 hover:backdrop-blur-sm"

  const isCollapsed = state === "collapsed"

  const NavItem = ({ item, tooltip }: { item: any, tooltip?: string }) => (
    <SidebarMenuItem>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild>
              <NavLink 
                to={item.url} 
                end={item.url === "/"}
                className={getNavCls}
              >
                <div className="flex items-center gap-3 w-full">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </div>
              </NavLink>
            </SidebarMenuButton>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="ml-2">
              <p>{tooltip || item.title}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  )

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 ease-in-out backdrop-blur-md bg-background/10 border-r border-white/10 shadow-lg`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                StreamWalkers
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-white/10 hidden md:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 space-y-6">
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-foreground/70 font-medium px-2 mb-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trading Tools */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-foreground/70 font-medium px-2 mb-2">
              Trading Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {tradingToolsItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-foreground/70 font-medium px-2 mb-2">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-foreground/70 font-medium px-2 mb-2">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">Trader Pro</p>
                    <p className="text-xs text-foreground/70 truncate">Active Account</p>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="ml-2">
                <div>
                  <p className="font-medium">Trader Pro</p>
                  <p className="text-xs opacity-70">Active Account</p>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </SidebarFooter>
    </Sidebar>
  )
}