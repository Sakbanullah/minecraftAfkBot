import { z } from "zod";

// Bot configuration schema for adding bots
export const addBotSchema = z.object({
  username: z.string().min(1, "Username is required").max(32, "Username too long"),
  host: z.string().min(1, "Host is required"),
  port: z.number().int().min(1).max(65535).default(25565),
  human: z.boolean().default(false),
  antiAfkInterval: z.number().int().min(1000).max(120000).default(20000),
  authmePassword: z.string().optional(),
  version: z.string().optional(),
});

export type AddBotInput = z.infer<typeof addBotSchema>;

// Bot status enum
export type BotStatus = "connecting" | "connected" | "reconnecting" | "error" | "offline";

// Bot state for frontend display
export interface BotState {
  username: string;
  host: string;
  port: number;
  status: BotStatus;
  human: boolean;
  antiAfkInterval: number;
  authmePassword?: string;
  version?: string;
  connectedAt?: string;
  lastError?: string;
  reconnectCount: number;
}

// API responses
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface ListBotsResponse {
  ok: boolean;
  bots: BotState[];
  count: number;
}

export interface AddBotResponse {
  ok: boolean;
  username: string;
}

export interface RemoveBotResponse {
  ok: boolean;
  username: string;
}

export interface RemoveAllResponse {
  ok: boolean;
  count: number;
}

export interface BulkAddInput {
  baseUsername: string;
  host: string;
  port?: number;
  count: number;
  delayMs?: number;
  human?: boolean;
  antiAfkInterval?: number;
}

export const bulkAddSchema = z.object({
  baseUsername: z.string().min(1, "Base username is required"),
  host: z.string().min(1, "Host is required"),
  port: z.number().int().min(1).max(65535).default(25565),
  count: z.number().int().min(1).max(50).default(5),
  delayMs: z.number().int().min(500).max(30000).default(2000),
  human: z.boolean().default(false),
  antiAfkInterval: z.number().int().min(1000).max(120000).default(20000),
});

export type BulkAddInputType = z.infer<typeof bulkAddSchema>;

// Stats for dashboard
export interface ManagerStats {
  totalBots: number;
  connectedBots: number;
  reconnectingBots: number;
  errorBots: number;
}
