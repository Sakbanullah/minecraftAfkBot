import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AddBotForm } from "@/components/add-bot-form";
import type { AddBotInput } from "@shared/schema";

export default function AddBot() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const addMutation = useMutation({
    mutationFn: async (data: AddBotInput) => {
      const res = await apiRequest("POST", "/api/add", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/list"] });
      toast({
        title: "Bot Added",
        description: `${data.username} is now connecting to the server.`,
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Bot</h1>
        <p className="text-muted-foreground">Configure a new Minecraft AFK bot</p>
      </div>
      <AddBotForm
        onSubmit={(data) => addMutation.mutate(data)}
        isLoading={addMutation.isPending}
      />
    </div>
  );
}
