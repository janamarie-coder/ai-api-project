// index.js — CLI version of the AI Joke & Story Bot

import dotenv from "dotenv";
dotenv.config();
import readline from "readline";

import { generateFunMessage, FriendlyError } from "./lib/generateMessage.js";
import { DEFAULT_STYLE, describeStyles, isValidStyle } from "./lib/styles.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(questionText) {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => resolve(answer));
  });
}

async function main() {
  try {
    console.log("🤖 Welcome to the AI Joke & Story Bot!\n");

    const name = await askQuestion("What is your name? ");
    const mood = await askQuestion("How are you feeling today? ");

    console.log(`\nAvailable styles:\n${describeStyles()}\n`);
    const styleInput = (
      await askQuestion(`Pick a style (press Enter for default): `)
    ).trim();
    const style = isValidStyle(styleInput) ? styleInput : DEFAULT_STYLE;

    console.log("\nThinking of something fun for you...\n");

    const { message } = await generateFunMessage({ name, mood, style });

    console.log("✨ Here's your custom AI message:\n");
    console.log(message);
    console.log("\n(Saved to history.json)");
  } catch (err) {
    if (err instanceof FriendlyError) {
      console.error(`\n😬 ${err.message}`);
    } else {
      console.error("\n😬 Oops! Something unexpected went wrong:", err.message);
    }
  } finally {
    rl.close();
  }
}

main();
