import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  const db = new Database("cards.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/cards", (req, res) => {
    try {
      const id = uuidv4();
      const data = JSON.stringify(req.body);
      const stmt = db.prepare("INSERT INTO cards (id, data) VALUES (?, ?)");
      stmt.run(id, data);
      res.json({ id });
    } catch (error) {
      console.error("Failed to save card:", error);
      res.status(500).json({ error: "Failed to save card" });
    }
  });

  app.get("/api/cards/:id", (req, res) => {
    try {
      const stmt = db.prepare("SELECT data FROM cards WHERE id = ?");
      const row = stmt.get(req.params.id) as { data: string } | undefined;
      if (row) {
        res.json(JSON.parse(row.data));
      } else {
        res.status(404).json({ error: "Card not found" });
      }
    } catch (error) {
      console.error("Failed to get card:", error);
      res.status(500).json({ error: "Failed to get card" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
