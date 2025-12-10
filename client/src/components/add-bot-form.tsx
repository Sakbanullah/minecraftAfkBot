import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBotSchema, type AddBotInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface AddBotFormProps {
  onSubmit: (data: AddBotInput) => void;
  isLoading?: boolean;
}

export function AddBotForm({ onSubmit, isLoading }: AddBotFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<AddBotInput>({
    resolver: zodResolver(addBotSchema),
    defaultValues: {
      username: "",
      host: "",
      port: 19176,
      human: false,
      antiAfkInterval: 20000,
      authmePassword: "",
      version: "",
    },
  });

  const handleSubmit = (data: AddBotInput) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Bot
        </CardTitle>
        <CardDescription>
          Create a new Minecraft AFK bot connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BotPlayer123"
                      className="font-mono"
                      data-testid="input-username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        data-testid="input-host"
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
                        data-testid="input-port"
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
              name="human"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">Human-like Movement</FormLabel>
                    <FormDescription>
                      Random movements to appear more natural
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-human"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between" type="button">
                  Advanced Options
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="antiAfkInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anti-AFK Interval: {field.value / 1000}s</FormLabel>
                      <FormControl>
                        <Slider
                          min={1000}
                          max={120000}
                          step={1000}
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          data-testid="slider-antiafk"
                        />
                      </FormControl>
                      <FormDescription>
                        How often the bot performs anti-AFK actions
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authmePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AuthMe Password (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Leave empty if not using AuthMe"
                          data-testid="input-authme"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        For servers with AuthMe login plugin
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minecraft Version (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1.20.1 (auto-detect if empty)"
                          className="font-mono"
                          data-testid="input-version"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-add-bot"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Bot...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bot
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
