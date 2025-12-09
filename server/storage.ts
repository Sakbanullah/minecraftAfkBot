import type { AddBotInput, BotState } from "@shared/schema";

export interface IStorage {
  getBots(): Promise<BotState[]>;
  getBot(username: string): Promise<BotState | undefined>;
  addBot(config: AddBotInput): Promise<BotState>;
  removeBot(username: string): Promise<boolean>;
  removeAllBots(): Promise<number>;
}

export class MemStorage implements IStorage {
  async getBots(): Promise<BotState[]> {
    return [];
  }

  async getBot(_username: string): Promise<BotState | undefined> {
    return undefined;
  }

  async addBot(config: AddBotInput): Promise<BotState> {
    return {
      username: config.username,
      host: config.host,
      port: config.port,
      status: "connecting",
      human: config.human,
      antiAfkInterval: config.antiAfkInterval,
      reconnectCount: 0,
    };
  }

  async removeBot(_username: string): Promise<boolean> {
    return false;
  }

  async removeAllBots(): Promise<number> {
    return 0;
  }
}

export const storage = new MemStorage();
