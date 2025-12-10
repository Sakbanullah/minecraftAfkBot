import express, { type Express } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Dapatkan __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Folder build di server/dist/public
  const distPath = path.resolve(__dirname, "/../client/public");

  if (!fs.existsSync(distPath)) {
    console.warn(`[Warning] Build folder not found: ${distPath}`);
    return;
  }

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
