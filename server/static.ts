import express, { type Express } from "express";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../client/dist"); // folder build
  app.use(express.static(distPath));

  // fallback semua route yang tidak cocok ke index.html
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
