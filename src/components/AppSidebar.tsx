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
  ChevronRight,
  Search,
  Building2,
  Brain,
  Cpu
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

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
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const mainNavItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    badge: null
  },
  { 
    title: "Business Plan", 
    url: "/business-plan", 
    icon: FileText,
    badge: "New"
  },
]

const tradingToolsItems = [
  { 
    title: "Order Flow", 
    url: "/tools/order-flow", 
    icon: Activity,
    badge: "Live"
  },
  { 
    title: "Market Analysis", 
    url: "/tools/analysis", 
    icon: BarChart3,
    badge: null
  },
  { 
    title: "Stock Screener", 
    url: "/screener", 
    icon: Search,
    badge: "New"
  },
  { 
    title: "Risk Management", 
    url: "/tools/risk", 
    icon: Shield,
    badge: "Pro"
  },
  { 
    title: "PE Analyzer", 
    url: "/tools/pe-analyzer", 
    icon: Building2,
    badge: "New"
  },
  { 
    title: "Market Oracle", 
    url: "/tools/market-oracle", 
    icon: Brain,
    badge: "AI"
  },
  { 
    title: "Quant Engine", 
    url: "/tools/quant-engine", 
    icon: Cpu,
    badge: "Quant"
  },
]

const accountItems = [
  { 
    title: "Funding", 
    url: "/account/funding", 
    icon: DollarSign,
    badge: null
  },
  { 
    title: "Performance", 
    url: "/account/performance", 
    icon: TrendingUp,
    badge: "2"
  },
  { 
    title: "Settings", 
    url: "/account/settings", 
    icon: Settings,
    badge: null
  },
]

const supportItems = [
  { 
    title: "Education Center", 
    url: "/education", 
    icon: BookOpen,
    badge: "Beta"
  },
  { 
    title: "Finance Reference", 
    url: "/education/finance-reference", 
    icon: BookOpen,
    badge: "New"
  },
  { 
    title: "Help & Support", 
    url: "/support", 
    icon: HelpCircle,
    badge: null
  },
]

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary font-medium border-r-2 border-primary shadow-lg backdrop-blur-sm" 
      : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-card/30 hover:to-card/10 hover:backdrop-blur-sm hover:shadow-sm transition-all duration-300"

  const isCollapsed = state === "collapsed"

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  }

  const staggerVariants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
    closed: {
      transition: { staggerChildren: 0.02, staggerDirection: -1 }
    }
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "New": return "default"
      case "Pro": return "secondary" 
      case "Live": return "destructive"
      case "Beta": return "outline"
      default: return "secondary"
    }
  }

  const NavItem = ({ item, tooltip, index }: { item: any, tooltip?: string, index: number }) => (
    <motion.div
      variants={itemVariants}
      initial="closed"
      animate={isCollapsed ? "closed" : "open"}
      transition={{ delay: index * 0.05 }}
    >
      <SidebarMenuItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink 
                    to={item.url} 
                    end={item.url === "/"}
                    className={getNavCls}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span 
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="truncate"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {!isCollapsed && item.badge && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge 
                              variant={getBadgeVariant(item.badge)} 
                              className="text-xs px-2 py-0.5 h-5"
                            >
                              {item.badge}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </NavLink>
                </motion.div>
              </SidebarMenuButton>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="ml-2">
                <div className="flex items-center gap-2">
                  <p>{tooltip || item.title}</p>
                  {item.badge && (
                    <Badge variant={getBadgeVariant(item.badge)} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
    </motion.div>
  )

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 ease-in-out bg-background border-r border-border/30 shadow-2xl`}
      collapsible="icon"
    >
        <SidebarHeader className="border-b border-border/20 p-4 bg-background/50 backdrop-blur-sm">
          <motion.div 
            className="flex items-center justify-between"
            layout
          >
            <motion.div 
              className="flex items-center gap-2"
              layout
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent whitespace-nowrap"
                  >
                    Equiforge
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 hover:bg-card/20 hover:backdrop-blur-sm hidden md:flex transition-all duration-300 rounded-lg"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 space-y-6">
          {/* Main Navigation */}
          <motion.div
            variants={staggerVariants}
            initial="closed"
            animate={isCollapsed ? "closed" : "open"}
          >
            <SidebarGroup>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarGroupLabel className="text-sidebar-foreground/90 font-semibold px-2 mb-3 text-xs tracking-widest uppercase">
                      MAIN
                    </SidebarGroupLabel>
                  </motion.div>
                )}
              </AnimatePresence>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {mainNavItems.map((item, index) => (
                    <NavItem key={item.title} item={item} index={index} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </motion.div>

          {/* Trading Tools */}
          <motion.div
            variants={staggerVariants}
            initial="closed"
            animate={isCollapsed ? "closed" : "open"}
          >
            <SidebarGroup>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <SidebarGroupLabel className="text-sidebar-foreground/90 font-semibold px-2 mb-3 text-xs tracking-widest uppercase">
                      TRADING TOOLS
                    </SidebarGroupLabel>
                  </motion.div>
                )}
              </AnimatePresence>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {tradingToolsItems.map((item, index) => (
                    <NavItem key={item.title} item={item} index={index} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </motion.div>

          {/* Account */}
          <motion.div
            variants={staggerVariants}
            initial="closed"
            animate={isCollapsed ? "closed" : "open"}
          >
            <SidebarGroup>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <SidebarGroupLabel className="text-sidebar-foreground/90 font-semibold px-2 mb-3 text-xs tracking-widest uppercase">
                      ACCOUNT
                    </SidebarGroupLabel>
                  </motion.div>
                )}
              </AnimatePresence>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {accountItems.map((item, index) => (
                    <NavItem key={item.title} item={item} index={index} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </motion.div>

          {/* Support */}
          <motion.div
            variants={staggerVariants}
            initial="closed"
            animate={isCollapsed ? "closed" : "open"}
          >
            <SidebarGroup>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <SidebarGroupLabel className="text-sidebar-foreground/90 font-semibold px-2 mb-3 text-xs tracking-widest uppercase">
                      SUPPORT
                    </SidebarGroupLabel>
                  </motion.div>
                )}
              </AnimatePresence>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {supportItems.map((item, index) => (
                    <NavItem key={item.title} item={item} index={index} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </motion.div>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/20 p-4 bg-background/50 backdrop-blur-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-card/20 hover:to-card/5 rounded-xl p-3 transition-all duration-300 cursor-pointer bg-gradient-to-r from-background/20 to-background/10 backdrop-blur-sm border border-border/30 shadow-sm"
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 min-w-0"
                      >
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-semibold text-sidebar-foreground truncate">Trader Pro</p>
                           <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                             Premium
                           </Badge>
                         </div>
                         <p className="text-xs text-sidebar-foreground/80 truncate">Active Account</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="ml-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium">Trader Pro</p>
                      <p className="text-xs opacity-70">Active Account</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </SidebarFooter>
    </Sidebar>
  )
}