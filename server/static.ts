import express, { type Express } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Folder build ada di root server
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    console.warn(`[Warning] Build folder not found: ${distPath}`);
    return;
  }

  // Serve file statis
  app.use(express.static(distPath));

  // Semua route non-API diarahkan ke index.html
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}
