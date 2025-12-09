import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AddBot from "@/pages/add-bot";
import BulkAdd from "@/pages/bulk-add";
import ApiGuide from "@/pages/api-guide";
import type { ListBotsResponse } from "@shared/schema";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/add" component={AddBot} />
      <Route path="/bulk" component={BulkAdd} />
      <Route path="/api-guide" component={ApiGuide} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data } = useQuery<ListBotsResponse>({
    queryKey: ["/api/list"],
    refetchInterval: 5000,
  });

  const botCount = data?.count || 0;

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar botCount={botCount} />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
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
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
