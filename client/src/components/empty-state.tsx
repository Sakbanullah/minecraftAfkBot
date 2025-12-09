import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddBot: () => void;
}

export function EmptyState({ onAddBot }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Server className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Bots Running</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Get started by adding your first Minecraft AFK bot. Bots will automatically 
        reconnect and stay active 24/7.
      </p>
      <Button onClick={onAddBot} data-testid="button-empty-add-bot">
        Add Your First Bot
      </Button>
    </div>
  );
}
