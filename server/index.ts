import express, { type Express } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  // Dapatkan __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Folder build React (setelah postinstall di Railway)
  const distPath = path.resolve(__dirname, "dist/public");

  if (!fs.existsSync(distPath)) {
    console.warn(`[Warning] Build folder not found: ${distPath}`);
    return;
  }

  // Serve semua file statis
  app.use(express.static(distPath));

  // Semua route non-API diarahkan ke index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, () => console.log(`Server running on port ${port}`));
}
