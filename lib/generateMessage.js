// lib/generateMessage.js
//
// Shared core logic used by both the CLI (index.js) and the
// Express web app (server.js), so the two don't drift apart.
//
// Bonus challenge #3: friendly, specific error handling —
// missing API key, invalid key, rate limiting, and network errors
// all get distinct, human-readable messages instead of a raw stack trace.

import { GoogleGenAI } from "@google/genai";
import { STYLES, DEFAULT_STYLE, isValidStyle } from "./styles.js";
import { logToHistory } from "./history.js";

const MODEL = "gemini-3-flash-preview";

const BASE_SYSTEM_INSTRUCTION =
  "You are a playful, kind storyteller for software developers. You keep responses short, fun, and encouraging.";

/** A small error class so callers can distinguish "safe to show the user" errors. */
export class FriendlyError extends Error {
  constructor(message, { statusCode = 500, cause } = {}) {
    super(message);
    this.name = "FriendlyError";
    this.statusCode = statusCode;
    this.cause = cause;
  }
}

let cachedClient = null;

function getClient() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_api_key_here") {
    throw new FriendlyError(
      "No Gemini API key found. Add GOOGLE_API_KEY=your_real_key to your .env file " +
        "(get one at https://ai.google.dev/gemini-api/docs/api-key).",
      { statusCode: 401 }
    );
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

/**
 * Generate a fun message for the given name/mood/style.
 * Always logs successful generations to history.json.
 *
 * @param {{name: string, mood: string, style?: string}} params
 * @returns {Promise<{message: string, style: string}>}
 */
export async function generateFunMessage({ name, mood, style = DEFAULT_STYLE }) {
  if (!name || !name.trim()) {
    throw new FriendlyError("Please provide a name.", { statusCode: 400 });
  }
  if (!mood || !mood.trim()) {
    throw new FriendlyError("Please provide a mood.", { statusCode: 400 });
  }

  const styleKey = isValidStyle(style) ? style : DEFAULT_STYLE;
  const styleFlavor = STYLES[styleKey].flavor;

  const client = getClient();

  const systemInstruction = styleFlavor
    ? `${BASE_SYSTEM_INSTRUCTION} ${styleFlavor}`
    : BASE_SYSTEM_INSTRUCTION;

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
      contents: `My name is ${name} and I am feeling ${mood}.
Please respond with either:
- a short, funny programming-themed joke, OR
- a 3-4 sentence mini-story about me learning to code.

Make it positive, encouraging, and friendly for all.`,
    });

    const message = response.text;

    if (!message) {
      throw new FriendlyError(
        "The AI didn't return any text. Try again in a moment.",
        { statusCode: 502 }
      );
    }

    await logToHistory({ name, mood, style: styleKey, message });

    return { message, style: styleKey };
  } catch (err) {
    if (err instanceof FriendlyError) throw err;

    // Try to classify common Gemini API failure modes.
    const status = err?.status ?? err?.response?.status;
    const rawMessage = String(err?.message ?? err);

    if (status === 401 || status === 403 || /API key/i.test(rawMessage)) {
      throw new FriendlyError(
        "Your Gemini API key was rejected. Double-check GOOGLE_API_KEY in your .env file.",
        { statusCode: 401, cause: err }
      );
    }

    if (status === 429 || /RESOURCE_EXHAUSTED|rate limit|quota/i.test(rawMessage)) {
      throw new FriendlyError(
        "You've hit the API rate limit or quota. Wait a bit and try again.",
        { statusCode: 429, cause: err }
      );
    }

    if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network/i.test(rawMessage)) {
      throw new FriendlyError(
        "Couldn't reach the Gemini API — check your internet connection and try again.",
        { statusCode: 503, cause: err }
      );
    }

    throw new FriendlyError(`Something went wrong talking to the AI: ${rawMessage}`, {
      statusCode: 500,
      cause: err,
    });
  }
}
