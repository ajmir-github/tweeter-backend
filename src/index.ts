import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route - HTML
app.get("/", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `);
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "components", "about.htm"));
});

// Example API endpoint - JSON
app.get("/api/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/api/user", async (req, res) => {
  const { email, name } = req.body;
  if (email || name)
    return res.json({
      message: "Email and name is needed!",
    });
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    res.json(newUser);
  } catch (error: any) {
    res.json({ message: error.message });
  }
});

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
