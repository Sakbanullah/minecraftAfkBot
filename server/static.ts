import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export function serveStatic(app: Express) {
  // buat __dirname manual di Node ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // kalau ingin pakai build nanti, bisa arah ke folder dist
  // const distPath = path.resolve(__dirname, "../client/dist");

  // TANPA DIST → frontend TSX akan jalan via Vite dev server
  // jadi backend hanya serve API, tidak perlu static files
  // tapi kalau kamu mau tetap fallback index.html (misal frontend sudah di build), bisa pakai ini:
  /*
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  */
}
