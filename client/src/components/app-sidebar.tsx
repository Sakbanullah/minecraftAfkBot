import { Link, useLocation } from "wouter";
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
} from "@/components/ui/sidebar";
import { LayoutDashboard, Plus, Users, Settings, Server, Info, ListCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  botCount?: number;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Add Bot",
    url: "/add",
    icon: Plus,
  },
  {
    title: "Bulk Add",
    url: "/bulk",
    icon: Users,
  },
  {
    title: "Bot List",
    url: "/bots",
    icon: ListCheck, 
  }
];

export function AppSidebar({ botCount = 0 }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-3 hover-elevate rounded-md p-2 -m-2 cursor-pointer">
            <div className="p-2 rounded-md bg-primary/10">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Bot Manager</h1>
              <p className="text-xs text-muted-foreground">Minecraft AFK Control</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.title === "Dashboard" && botCount > 0 && (
                        <Badge variant="secondary" className="ml-auto" data-testid="badge-bot-count">
                          {botCount}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span>v1.0.4 - AFK Bot Manager</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
