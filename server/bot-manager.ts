import mineflayer from "mineflayer";
import type { Bot } from "mineflayer";
import type { BotState, BotStatus, AddBotInput } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

interface ManagedBot {
  bot: Bot | null;
  config: AddBotInput;
  status: BotStatus;
  connectedAt?: string;
  lastError?: string;
  reconnectCount: number;
  antiAfkTimer?: NodeJS.Timeout;
  humanTimer?: NodeJS.Timeout;
  reconnectTimer?: NodeJS.Timeout;
}

const BOTS_FILE = path.join(process.cwd(), "bots.json");
const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_DELAY = 60000;

class BotManager {
  private bots: Map<string, ManagedBot> = new Map();

  constructor() {
    this.loadBots();
  }

  private saveBots() {
    try {
      const configs = Array.from(this.bots.values()).map((b) => b.config);
      fs.writeFileSync(BOTS_FILE, JSON.stringify(configs, null, 2));
      console.log(`[BotManager] Saved ${configs.length} bot configs to bots.json`);
    } catch (err) {
      console.error("[BotManager] Failed to save bots:", err);
    }
  }

  private loadBots() {
    try {
      if (fs.existsSync(BOTS_FILE)) {
        const data = fs.readFileSync(BOTS_FILE, "utf-8");
        const configs: AddBotInput[] = JSON.parse(data);
        console.log(`[BotManager] Loading ${configs.length} bots from bots.json`);
        for (const config of configs) {
          setTimeout(() => {
            this.addBot(config).catch((err) => {
              console.error(`[BotManager] Failed to restore bot ${config.username}:`, err);
            });
          }, Math.random() * 3000);
        }
      }
    } catch (err) {
      console.error("[BotManager] Failed to load bots:", err);
    }
  }

  async addBot(config: AddBotInput): Promise<BotState> {
    if (this.bots.has(config.username)) {
      throw new Error(`Bot with username "${config.username}" already exists`);
    }

    const managed: ManagedBot = {
      bot: null,
      config,
      status: "connecting",
      reconnectCount: 0,
    };

    this.bots.set(config.username, managed);
    this.saveBots();
    this.connectBot(managed);
    return this.getBotState(managed);
  }

  private connectBot(managed: ManagedBot) {
    const { config } = managed;
    console.log(`[BotManager] Connecting bot ${config.username} to ${config.host}:${config.port}`);
    managed.status = "connecting";

    try {
      const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version || undefined,
        auth: "offline",
        hideErrors: false,
      });

      managed.bot = bot;

      bot.on("spawn", () => {
        console.log(`[${config.username}] Spawned in game`);
        managed.status = "connected";
        managed.connectedAt = new Date().toISOString();
        managed.lastError = undefined;

        if (config.authmePassword) {
          setTimeout(() => bot.chat(`/login ${config.authmePassword}`), 1000);
        }

        this.startAntiAfk(managed);
        if (config.human) this.startHumanBehavior(managed);
      });

      bot.on("error", (err) => {
        console.error(`[${config.username}] Error:`, err.message);
        managed.lastError = err.message;
        managed.status = "error";
      });

      bot.on("end", (reason) => {
        console.log(`[${config.username}] Disconnected:`, reason);
        this.stopTimers(managed);

        if (this.bots.has(config.username) && managed.status !== "disconnected") {
          managed.status = "reconnecting";
          managed.reconnectCount++;
          const delay = Math.min(
            RECONNECT_DELAY * Math.pow(1.5, managed.reconnectCount - 1),
            MAX_RECONNECT_DELAY
          );
          console.log(`[${config.username}] Reconnecting in ${delay / 1000}s...`);
          managed.reconnectTimer = setTimeout(() => {
            if (this.bots.has(config.username)) this.connectBot(managed);
          }, delay);
        }
      });

      bot.on("kicked", (reason) => {
        console.log(`[${config.username}] Kicked:`, reason);
        managed.lastError = `Kicked: ${reason}`;
      });

    } catch (err) {
      console.error(`[${config.username}] Connection failed:`, err);
      managed.status = "error";
      managed.lastError = err instanceof Error ? err.message : "Connection failed";
    }
  }

  private stopTimers(managed: ManagedBot) {
    if (managed.antiAfkTimer) { clearInterval(managed.antiAfkTimer); managed.antiAfkTimer = undefined; }
    if (managed.humanTimer) { clearInterval(managed.humanTimer); managed.humanTimer = undefined; }
    if (managed.reconnectTimer) { clearTimeout(managed.reconnectTimer); managed.reconnectTimer = undefined; }
  }

  private startAntiAfk(managed: ManagedBot) {
    const { bot, config } = managed;
    if (!bot) return;
    managed.antiAfkTimer = setInterval(() => {
      if (bot && managed.status === "connected") {
        const action = Math.random();
        if (action < 0.5) {
          const yaw = (Math.random() - 0.5) * 0.5;
          const pitch = (Math.random() - 0.5) * 0.3;
          bot.look(bot.entity.yaw + yaw, bot.entity.pitch + pitch, false);
        } else {
          bot.setControlState("jump", true);
          setTimeout(() => { if (bot) bot.setControlState("jump", false); }, 100);
        }
      }
    }, config.antiAfkInterval);
  }

  private startHumanBehavior(managed: ManagedBot) {
    const { bot } = managed;
    if (!bot) return;
    const actions = ["forward", "back", "left", "right", "jump", "sneak"] as const;
    managed.humanTimer = setInterval(() => {
      if (bot && managed.status === "connected") {
        const yaw = (Math.random() - 0.5) * 1.0;
        const pitch = (Math.random() - 0.5) * 0.5;
        bot.look(bot.entity.yaw + yaw, bot.entity.pitch + pitch, false);

        if (Math.random() < 0.3) {
          const action = actions[Math.floor(Math.random() * actions.length)];
          bot.setControlState(action, true);
          setTimeout(() => { if (bot) bot.setControlState(action, false); }, 200 + Math.random() * 500);
        }
      }
    }, 3000 + Math.random() * 5000);
  }

  removeBot(username: string): boolean {
    const managed = this.bots.get(username);
    if (!managed) return false;
    this.stopTimers(managed);
    if (managed.bot) try { managed.bot.quit(); } catch {}
    this.bots.delete(username);
    this.saveBots();
    console.log(`[BotManager] Removed bot ${username}`);
    return true;
  }

  removeAllBots(): number {
    const count = this.bots.size;
    for (const username of Array.from(this.bots.keys())) this.removeBot(username);
    return count;
  }

  listBots(): BotState[] {
    return Array.from(this.bots.values()).map((m) => this.getBotState(m));
  }

  private getBotState(managed: ManagedBot): BotState {
    return {
      username: managed.config.username,
      host: managed.config.host,
      port: managed.config.port,
      status: managed.status,
      human: managed.config.human,
      antiAfkInterval: managed.config.antiAfkInterval,
      authmePassword: managed.config.authmePassword ? "***" : undefined,
      version: managed.config.version,
      connectedAt: managed.connectedAt,
      lastError: managed.lastError,
      reconnectCount: managed.reconnectCount,
    };
  }

  hasBot(username: string): boolean { return this.bots.has(username); }
  getCount(): number { return this.bots.size; }

  /** START/STOP MANUAL **/
  startBot(username: string) {
    const managed = this.bots.get(username);
    if (!managed) throw new Error("Bot not found");
    if (managed.status === "connected" || managed.status === "connecting") return;
    this.connectBot(managed);
  }

  stopBot(username: string) {
    const managed = this.bots.get(username);
    if (!managed) throw new Error("Bot not found");
    if (managed.status !== "connected") return;
    this.stopTimers(managed);
    if (managed.bot) try { managed.bot.quit(); } catch {};
    managed.bot = null;
    managed.status = "disconnected";
  }

  shutdown() {
    console.log("[BotManager] Shutting down...");
    this.saveBots();
    for (const [username] of this.bots) {
      const managed = this.bots.get(username);
      if (managed) {
        this.stopTimers(managed);
        if (managed.bot) try { managed.bot.quit(); } catch {};
      }
    }
  }
}

export const botManager = new BotManager();

process.on("SIGINT", () => { botManager.shutdown(); process.exit(0); });
process.on("SIGTERM", () => { botManager.shutdown(); process.exit(0); });
