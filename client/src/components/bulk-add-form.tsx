import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bulkAddSchema, type BulkAddInputType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";

interface BulkAddFormProps {
  onSubmit: (data: BulkAddInputType) => void;
  isLoading?: boolean;
  progress?: { current: number; total: number };
}

export function BulkAddForm({ onSubmit, isLoading, progress }: BulkAddFormProps) {
  const form = useForm<BulkAddInputType>({
    resolver: zodResolver(bulkAddSchema),
    defaultValues: {
      baseUsername: "",
      host: "",
      port: 25565,
      count: 5,
      delayMs: 2000,
      human: false,
      antiAfkInterval: 20000,
    },
  });

  const handleSubmit = (data: BulkAddInputType) => {
    onSubmit(data);
  };

  const count = form.watch("count");
  const baseUsername = form.watch("baseUsername");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Add Bots
        </CardTitle>
        <CardDescription>
          Add multiple bots with staggered creation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bot"
                        className="font-mono"
                        data-testid="input-bulk-base-username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Will become {baseUsername || "Bot"}1, {baseUsername || "Bot"}2...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Bots: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={50}
                        step={1}
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        data-testid="slider-bulk-count"
                      />
                    </FormControl>
                    <FormDescription>Max: 50 bots</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Server Host</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="mc.example.com"
                        className="font-mono"
                        data-testid="input-bulk-host"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="font-mono"
                        data-testid="input-bulk-port"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 25565)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="delayMs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay Between Bots: {field.value / 1000}s</FormLabel>
                  <FormControl>
                    <Slider
                      min={500}
                      max={30000}
                      step={500}
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                      data-testid="slider-bulk-delay"
                    />
                  </FormControl>
                  <FormDescription>
                    Time between creating each bot (helps avoid rate limits)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="human"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">Human-like Movement</FormLabel>
                    <FormDescription>
                      Enable for all bots
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-bulk-human"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {progress && isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Creating bots...</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <Progress value={(progress.current / progress.total) * 100} />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-bulk-add"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating {count} Bots...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Add {count} Bots
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
