import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { botManager } from "./bot-manager";
import { addBotSchema, bulkAddSchema } from "@shared/schema";

const API_TOKEN = process.env.API_TOKEN;

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!API_TOKEN) {
    return next();
  }

  const token = req.headers["x-api-key"];
  if (token !== API_TOKEN) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

const addBotLimiter = rateLimit({
  windowMs: 10000,
  max: 5,
  message: { ok: false, error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      message: "AFK Bot Manager is running",
      bots: botManager.getCount(),
    });
  });

  app.get("/api/list", authMiddleware, (_req: Request, res: Response) => {
    const bots = botManager.listBots();
    res.json({
      ok: true,
      bots,
      count: bots.length,
    });
  });

  // Start bot
app.post("/api/start", authMiddleware, (req: Request, res: Response) => {
  const { username } = req.body;
  if (!botManager.hasBot(username)) return res.status(404).json({ ok: false, error: "Bot not found" });

  try {
    botManager.startBot(username);
    res.json({ ok: true, username, action: "started" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "Failed to start bot" });
  }
});

// Stop bot
app.post("/api/stop", authMiddleware, (req: Request, res: Response) => {
  const { username } = req.body;
  if (!botManager.hasBot(username)) return res.status(404).json({ ok: false, error: "Bot not found" });

  try {
    botManager.stopBot(username);
    res.json({ ok: true, username, action: "stopped" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "Failed to stop bot" });
  }
});

app.post("/api/add", authMiddleware, addBotLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = addBotSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: parsed.error.errors.map(e => e.message).join(", "),
      });
    }

    const botState = await botManager.addBot(parsed.data);
    res.json({
      ok: true,
      username: botState.username,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add bot",
    });
  }
});


  app.post("/api/remove", authMiddleware, (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username || typeof username !== "string") {
      return res.status(400).json({ ok: false, error: "Username is required" });
    }

    const removed = botManager.removeBot(username);
    if (!removed) {
      return res.status(404).json({ ok: false, error: `Bot "${username}" not found` });
    }

    res.json({ ok: true, username });
  });

  app.post("/api/removeAll", authMiddleware, (_req: Request, res: Response) => {
    const count = botManager.removeAllBots();
    res.json({ ok: true, count });
  });

  app.post("/api/bulk", authMiddleware, addBotLimiter, async (req: Request, res: Response) => {
    try {
      const parsed = bulkAddSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: parsed.error.errors.map((e) => e.message).join(", "),
        });
      }

      const { baseUsername, host, port, count, delayMs, human, antiAfkInterval } = parsed.data;
      
      let created = 0;
      const errors: string[] = [];

      for (let i = 1; i <= count; i++) {
        const username = `${baseUsername}${i}`;
        
        if (botManager.hasBot(username)) {
          errors.push(`${username} already exists`);
          continue;
        }

        try {
          await botManager.addBot({
            username,
            host,
            port,
            human,
            antiAfkInterval,
          });
          created++;
          
          if (i < count) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        } catch (err) {
          errors.push(`${username}: ${err instanceof Error ? err.message : "Failed"}`);
        }
      }

      res.json({
        ok: true,
        created,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        error: err instanceof Error ? err.message : "Failed to bulk add bots",
      });
    }
  });

  return httpServer;
}
