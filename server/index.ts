import path from "path";
import fs from "fs";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dapatkan __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  await registerRoutes(httpServer, app);

  // Route dashboard default
  app.get("/", (_req, res) => {
    const distPath = path.resolve(__dirname, "dist/public");
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
