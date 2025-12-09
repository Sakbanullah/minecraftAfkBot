import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, User, Server as ServerIcon, Clock, RefreshCw, AlertCircle, CheckCircle, Minus, Loader2 } from "lucide-react";
import type { BotState, BotStatus } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface BotCardProps {
  bot: BotState;
  onRemove: (username: string) => void;
  isRemoving?: boolean;
}

const statusConfig: Record<BotStatus, { icon: typeof CheckCircle; label: string; className: string }> = {
  connected: {
    icon: CheckCircle,
    label: "Connected",
    className: "bg-status-online/10 text-status-online border-status-online/20",
  },
  connecting: {
    icon: Loader2,
    label: "Connecting",
    className: "bg-status-away/10 text-status-away border-status-away/20",
  },
  reconnecting: {
    icon: RefreshCw,
    label: "Reconnecting",
    className: "bg-status-away/10 text-status-away border-status-away/20",
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    className: "bg-status-busy/10 text-status-busy border-status-busy/20",
  },
  offline: {
    icon: Minus,
    label: "Offline",
    className: "bg-status-offline/10 text-status-offline border-status-offline/20",
  },
};

export function BotCard({ bot, onRemove, isRemoving }: BotCardProps) {
  const status = statusConfig[bot.status];
  const StatusIcon = status.icon;

  return (
    <Card className="group relative" data-testid={`card-bot-${bot.username}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 rounded-md bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-mono font-semibold text-lg truncate" data-testid={`text-username-${bot.username}`}>
              {bot.username}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ServerIcon className="h-3.5 w-3.5" />
              <span className="font-mono truncate">{bot.host}:{bot.port}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(bot.username)}
          disabled={isRemoving}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid={`button-remove-${bot.username}`}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={`${status.className} border`}>
            <StatusIcon className={`h-3 w-3 mr-1.5 ${bot.status === "connecting" || bot.status === "reconnecting" ? "animate-spin" : ""}`} />
            {status.label}
          </Badge>
          {bot.human && (
            <Badge variant="secondary" className="text-xs">
              Human-like
            </Badge>
          )}
          {bot.reconnectCount > 0 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Reconnects: {bot.reconnectCount}
            </Badge>
          )}
        </div>

        {bot.connectedAt && bot.status === "connected" && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Uptime: {formatDistanceToNow(new Date(bot.connectedAt))}</span>
          </div>
        )}

        {bot.lastError && bot.status === "error" && (
          <div className="text-xs text-status-busy bg-status-busy/10 p-2 rounded-md truncate">
            {bot.lastError}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Anti-AFK: every {bot.antiAfkInterval / 1000}s
        </div>
      </CardContent>
    </Card>
  );
}

export function BotCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-md bg-muted animate-pulse">
            <div className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
        <div className="h-4 w-28 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}
