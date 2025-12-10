import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "dist/public");
  if (!fs.existsSync(distPath)) {
    console.warn(`[Warning] Build folder not found: ${distPath}`);
    return;
  }

  // Serve semua file statis
  app.use(express.static(distPath));

  // Semua route non-API diarahkan ke index.html
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
