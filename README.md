# 🤖 AI Joke & Story Bot

A small Node.js app that asks for your name and mood, then uses Google's Gemini API
to generate a short, encouraging programming joke or mini-story.

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and replace `your_api_key_here` with a real key from
https://ai.google.dev/gemini-api/docs/api-key.

```
GOOGLE_API_KEY=your_real_key
```

Never commit `.env` — it's already in `.gitignore`.

## Run the CLI

```bash
npm start
```

You'll be asked for your name, mood, and (optionally) a storytelling style.

## Run the web app (bonus)

```bash
npm run server
```

Then visit:

- `GET /fun-message?name=Jordan&mood=curious&style=pirate` — generate a message
- `GET /styles` — list available styles
- `GET /history` — see every message generated so far

`style` is optional; omit it for the default playful tone.

## Bonus features included

1. **History logging** — every generated message is appended to `history.json`
   with a timestamp, name, mood, and style (`lib/history.js`).
2. **Web app** — `server.js` exposes the same generation logic over HTTP with
   Express, including `GET /fun-message`.
3. **Error handling** — `lib/generateMessage.js` gives friendly, specific
   messages for a missing/invalid API key, rate limits, network issues, or
   missing input, instead of a raw stack trace.
4. **Style customization** — choose from `default`, `scifi`, `fantasy`,
   `pirate`, `hacker90s`, or `superhero` (`lib/styles.js`).


## Project structure

The folder contains two programs that share the same logic, plus a few helper files.

`index.js` is the command-line version: it asks you for your name and mood in the terminal. `server.js` is the same functionality as a small web server version, which you can call via a URL in your browser.

Both rely on the `lib` folder, where the actual core logic lives: `generateMessage.js` makes the Google call and handles errors, `history.js` saves every response to `history.json`, and `styles.js` contains the different styles (pirate, sci-fi, etc.).

There are also `package.json` (list of required packages), `.env.example` (template for your API key), and `.gitignore` (prevents your real key or `node_modules` from accidentally being uploaded).
