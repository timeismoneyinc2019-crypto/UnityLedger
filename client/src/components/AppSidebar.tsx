import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Shield,
  Wallet,
  FileText,
  HelpCircle,
  Zap
} from "lucide-react";

const mainNavItems = [
  { path: "/", label: "Boardroom", icon: LayoutDashboard },
  { path: "/agents", label: "Nano Agents", icon: Users },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/security", label: "Security", icon: Shield },
  { path: "/wallet", label: "UPX Wallet", icon: Wallet },
  { path: "/reports", label: "Reports", icon: FileText },
];

const settingsNavItems = [
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/help", label: "Help & Support", icon: HelpCircle },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-base">UnityPay</span>
            <p className="text-xs text-muted-foreground">2045 Edition</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs font-medium text-primary mb-1">Prime Brain Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
