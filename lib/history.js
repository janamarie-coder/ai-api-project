// lib/history.js
//
// Bonus challenge #1: Log responses to a JSON file.
// Keeps a running history of every generated message so you can
// look back at past jokes/stories.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_PATH = path.join(__dirname, "..", "history.json");

async function readHistory() {
  try {
    const raw = await fs.readFile(HISTORY_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      return []; // no history yet — that's fine
    }
    // Corrupt or unreadable history file — don't crash the app over it.
    console.warn("⚠️  Could not read history.json, starting fresh:", err.message);
    return [];
  }
}

/**
 * Append a new entry to history.json.
 * Never throws — logging failures shouldn't break the main feature.
 */
export async function logToHistory({ name, mood, style, message }) {
  try {
    const history = await readHistory();
    history.push({
      timestamp: new Date().toISOString(),
      name,
      mood,
      style,
      message,
    });
    await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2), "utf-8");
  } catch (err) {
    console.warn("⚠️  Could not write to history.json:", err.message);
  }
}

export async function getHistory() {
  return readHistory();
}

export { HISTORY_PATH };
