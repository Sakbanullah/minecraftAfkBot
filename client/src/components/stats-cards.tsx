import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import type { ManagerStats } from "@shared/schema";

interface StatsCardsProps {
  stats: ManagerStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Bots",
      value: stats.totalBots,
      icon: Server,
      color: "text-foreground",
      bgColor: "bg-muted/50",
    },
    {
      title: "Connected",
      value: stats.connectedBots,
      icon: CheckCircle,
      color: "text-status-online",
      bgColor: "bg-status-online/10",
    },
    {
      title: "Reconnecting",
      value: stats.reconnectingBots,
      icon: RefreshCw,
      color: "text-status-away",
      bgColor: "bg-status-away/10",
    },
    {
      title: "Errors",
      value: stats.errorBots,
      icon: AlertCircle,
      color: "text-status-busy",
      bgColor: "bg-status-busy/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-cards">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <div className={`text-3xl font-bold font-mono ${card.color}`} data-testid={`stat-${card.title.toLowerCase().replace(' ', '-')}`}>
                {card.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
