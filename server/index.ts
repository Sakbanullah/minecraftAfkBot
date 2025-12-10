import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

// Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // Daftarkan semua API routes
  await registerRoutes(httpServer, app);

  // Jika production, serve static React build
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    // Jika development, gunakan Vite
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Jalankan server
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
})();
