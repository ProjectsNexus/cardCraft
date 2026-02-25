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

  // Server-side Meta Tag Injection for Social Sharing
  app.get("/view/:id", async (req, res, next) => {
    try {
      const stmt = db.prepare("SELECT data FROM cards WHERE id = ?");
      const row = stmt.get(req.params.id) as { data: string } | undefined;
      
      if (!row) return next();

      const cardData = JSON.parse(row.data);
      const title = `${cardData.name} | Digital Visiting Card`;
      const description = `${cardData.name} - ${cardData.title} at ${cardData.company}. Contact: ${cardData.phone}`;
      const image = cardData.logo || 'https://picsum.photos/seed/cardcraft/1200/630';
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      let html;
      if (process.env.NODE_ENV !== "production") {
        // In dev, we can't easily read the vite-transformed index.html
        // So we just let Vite handle it, client-side Helmet will take over
        return next();
      } else {
        const fs = await import("fs");
        html = fs.readFileSync(path.join(__dirname, "dist", "index.html"), "utf-8");
      }

      // Inject meta tags
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="${url}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${url}">
        <meta property="twitter:title" content="${title}">
        <meta property="twitter:description" content="${description}">
        <meta property="twitter:image" content="${image}">
      `;

      const finalHtml = html.replace('</head>', `${metaTags}</head>`);
      res.send(finalHtml);
    } catch (error) {
      console.error("Meta injection error:", error);
      next();
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
