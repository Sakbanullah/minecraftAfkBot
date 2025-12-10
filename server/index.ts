import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import express from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../client/dist/public");

(async () => {
  await registerRoutes(httpServer, app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  // Tambahkan route dashboard di sini
  app.get("/", (_req, res) => {
    if (!fs.existsSync(path.join(distPath, "index.html"))) {
      return res
        .status(500)
        .send("Dashboard belum dibuild. Jalankan `npm run build` di client.");
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
})();
