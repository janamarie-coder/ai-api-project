// server.js — Bonus challenge #2: turn it into a web app.
//
// Run with: npm run server
// Then visit: http://localhost:3000/fun-message?name=Jordan&mood=curious&style=pirate

import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { generateFunMessage, FriendlyError } from "./lib/generateMessage.js";
import { getHistory } from "./lib/history.js";
import { STYLES } from "./lib/styles.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "AI Joke & Story Bot API",
    endpoints: {
      "GET /fun-message": "?name=<name>&mood=<mood>&style=<style optional>",
      "GET /history": "returns past generated messages",
      "GET /styles": "lists available styles",
    },
  });
});

app.get("/styles", (req, res) => {
  res.json(
    Object.fromEntries(
      Object.entries(STYLES).map(([key, { label }]) => [key, label])
    )
  );
});

app.get("/history", async (req, res) => {
  const history = await getHistory();
  res.json(history);
});

app.get("/fun-message", async (req, res) => {
  const { name, mood, style } = req.query;

  try {
    const { message, style: usedStyle } = await generateFunMessage({
      name,
      mood,
      style,
    });
    res.json({ name, mood, style: usedStyle, message });
  } catch (err) {
    if (err instanceof FriendlyError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: "Something went wrong on the server." });
    }
  }
});

// Friendly 404 for anything else
app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`🤖 AI Joke & Story Bot server running at http://localhost:${PORT}`);
  console.log(`   Try: http://localhost:${PORT}/fun-message?name=Jordan&mood=curious`);
});
