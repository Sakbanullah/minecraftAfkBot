import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve("dist/public"); // folder hasil build
  if (!fs.existsSync(distPath)) {
    console.warn(`[Warning] Build folder not found: ${distPath}`);
    return;
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
