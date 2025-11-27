import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Boardroom from "@/pages/Boardroom";
import Agents from "@/pages/Agents";
import Analytics from "@/pages/Analytics";
import Dashboard from "@/pages/Dashboard";
import Wallet from "@/pages/Wallet";
import Purchase from "@/pages/Purchase";
import PurchaseSuccess from "@/pages/PurchaseSuccess";
import CryptoPayment from "@/pages/CryptoPayment";
import Placeholder from "@/pages/Placeholder";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Boardroom} />
      <Route path="/agents" component={Agents} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/security">
        <Placeholder 
          title="Security Center" 
          description="Quantum-resistant encryption and security protocols"
        />
      </Route>
      <Route path="/wallet" component={Wallet} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/purchase" component={Purchase} />
      <Route path="/purchase/crypto" component={CryptoPayment} />
      <Route path="/purchase/success" component={PurchaseSuccess} />
      <Route path="/reports">
        <Placeholder 
          title="Reports Archive" 
          description="Historical meeting reports and analytics"
        />
      </Route>
      <Route path="/settings">
        <Placeholder 
          title="Settings" 
          description="Configure your UnityPay preferences"
        />
      </Route>
      <Route path="/help">
        <Placeholder 
          title="Help & Support" 
          description="Documentation and support resources"
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}

function AppLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="h-14 flex items-center justify-between gap-4 px-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <ThemeToggle />
              <Avatar className="w-8 h-8 border border-border" data-testid="avatar-user">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  UP
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AppLayout />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
