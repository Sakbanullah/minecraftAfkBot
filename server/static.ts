import express, { type Express } from "express";
import path from "path";
import fs from "fs";

// Dapatkan __dirname di ES module
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Folder React public
  const publicPath = path.resolve(__dirname, "../client");

  if (!fs.existsSync(publicPath)) {
    console.warn(`[Warning] Public folder not found: ${publicPath}`);
    return;
  }

  // Serve file statis
  app.use(express.static(publicPath));

  // Semua route non-API diarahkan ke index.html
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next(); // biarkan API jalan
    res.sendFile(path.join(publicPath, "index.html"));
  });
}
