import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { BulkAddForm } from "@/components/bulk-add-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
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

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Adding many bots at once may consume significant resources. For Replit free tier, 
          we recommend staying under 10 bots. Use a VPS for larger bot counts.
        </AlertDescription>
      </Alert>

      <BulkAddForm
        onSubmit={(data) => bulkMutation.mutate(data)}
        isLoading={bulkMutation.isPending}
        progress={progress}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resource Guidelines</CardTitle>
          <CardDescription>Recommended bot limits by hosting environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Replit (Free)</span>
              <span className="text-muted-foreground">5-10 bots</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Replit (Hacker/Pro)</span>
              <span className="text-muted-foreground">15-25 bots</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">VPS (1GB RAM)</span>
              <span className="text-muted-foreground">20-30 bots</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">VPS (2GB+ RAM)</span>
              <span className="text-muted-foreground">50+ bots</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
