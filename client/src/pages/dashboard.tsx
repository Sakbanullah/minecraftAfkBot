import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StatsCards } from "@/components/stats-cards";
import { BotCard, BotCardSkeleton } from "@/components/bot-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "wouter";
import type { ListBotsResponse, ManagerStats } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();

  const { data, isLoading, refetch, isRefetching } = useQuery<ListBotsResponse>({
    queryKey: ["/api/list"],
    refetchInterval: 5000,
  });

  const removeMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await apiRequest("POST", "/api/remove", { username });
      return res.json();
    },
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ["/api/list"] });
      toast({
        title: "Bot Removed",
        description: `${username} has been disconnected and removed.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/removeAll");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/list"] });
      toast({
        title: "All Bots Removed",
        description: `${data.count} bots have been disconnected.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bots = data?.bots || [];
  const stats: ManagerStats = {
    totalBots: bots.length,
    connectedBots: bots.filter((b) => b.status === "connected").length,
    reconnectingBots: bots.filter((b) => b.status === "reconnecting" || b.status === "connecting").length,
    errorBots: bots.filter((b) => b.status === "error").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your Minecraft AFK bots</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            data-testid="button-refresh"
          >
            {isRefetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          
          {bots.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" data-testid="button-remove-all">
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Remove All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove All Bots?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect and remove all {bots.length} bots. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeAllMutation.mutate()}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {removeAllMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Remove All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <StatsCards stats={stats} isLoading={isLoading} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <BotCardSkeleton key={i} />
          ))}
        </div>
      ) : bots.length === 0 ? (
        <EmptyState onAddBot={() => window.location.href = "/add"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <BotCard
              key={bot.username}
              bot={bot}
              onRemove={(username) => removeMutation.mutate(username)}
              isRemoving={removeMutation.isPending && removeMutation.variables === bot.username}
            />
          ))}
        </div>
      )}
    </div>
  );
}
