import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { BulkAddForm } from "@/components/bulk-add-form";
import type { BulkAddInputType } from "@shared/schema";

export default function BulkAdd() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>();

  const bulkMutation = useMutation({
    mutationFn: async (data: BulkAddInputType) => {
      setProgress({ current: 0, total: data.count });
      const res = await apiRequest("POST", "/api/bulk", data);
      return res.json();
    },
    onSuccess: (data) => {
      setProgress(undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/list"] });
      toast({
        title: "Bulk Add Complete",
        description: `Successfully created ${data.created} bots.`,
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      setProgress(undefined);
      toast({
        title: "Bulk Add Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bulk Add Bots</h1>
        <p className="text-muted-foreground">Add multiple bots with sequential usernames</p>
      </div>
      <BulkAddForm
        onSubmit={(data) => bulkMutation.mutate(data)}
        isLoading={bulkMutation.isPending}
        progress={progress}
      />
    </div>
  );
}
