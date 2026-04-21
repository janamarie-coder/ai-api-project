# **AI Joke & Story Bot 🤖🎉**

*In this project, you will use Node.js to connect to an AI API and generate creative responses.*

---

## **✨ What You’ll Build**

You will create a small Node.js application that:

* Asks the user for their **name**
* Asks for their **current mood**
* Sends that information to an **AI model**
* Returns a short, fun, encouraging message (a joke or a mini-story)

Learning Objectives:

* How to make API calls in Node
* How to use environment variables
* How to work with async/await
* How to interact with an LLM (Large Language Model)

---

## **📦 Project Setup**

### 1. Create your project folder. This should be in your dev folder on your computer.

```bash
mkdir ai-joke-bot
cd ai-joke-bot
npm init -y
```

---

## **📚 Install Dependencies**

We will install two packages:

* **@google/genai** – lets you connect to the AI model
* **dotenv** – loads your API key from a secure file

Run:

```bash
npm install @google/genai dotenv
```

---

## **🔑 Add Your API Key**

Create a file called `.env`:

```bash
touch .env
```

Inside `.env`, add:

```env
GOOGLE_API_KEY=your_api_key_here
```

Go to https://ai.google.dev/gemini-api/docs/api-key to get an API key. You can call your API Key "StoryJokeAPI". Copy key and add to your env file.

**Important:** Never share your API key or upload it to GitHub.

---

## **🧠 Create the Application File**

Make the main JavaScript file:

```bash
touch index.js
```
Let's look at the docs! https://ai.google.dev/gemini-api/docs

Paste this code inside:

```js
// index.js

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import readline from "readline";

  // 1. Create AI client using your API key
  const client = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
  });

  // 2. Simple helper for CLI input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Wrap readline in a Promise so we can use async/await
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

      console.log("\nThinking of something fun for you...\n");

      // 3. Call the AI API
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a playful, kind storyteller for software developers. You keep responses short, fun, and encouraging.",
          temperature: 0.9,
          // maxOutputTokens: 200,
        },
        contents: `My name is ${name} and I am feeling ${mood}. 
            Please respond with either:
            - a short, funny programming-themed joke, OR
            - a 3–4 sentence mini-story about me learning to code.
            
            Make it positive, encouraging, and friendly for all.`,
      });

      let aiMessage = response.text;

      console.log("✨ Here’s your custom AI message:\n");
      console.log(aiMessage);
    } catch (err) {
      console.error("Oops! Something went wrong:", err.message);
    } finally {
      rl.close();
    }
}

main();
```
---

## **▶️ Run the App**

Add a start script in `package.json`:

```json
"scripts": {
  "start": "node index.js"
}
```

Now run the app:

```bash
npm start
```

You should see something like:

```
🤖 Welcome to the AI Joke & Story Bot!

What is your name? Jordan
How are you feeling today? Curious

Thinking of something fun for you...

✨ Here’s your custom AI message:
```

---

## **🚀 Bonus Challenges**

Try these extensions to level up your skills:

### **1. Log responses to a JSON file**

Create a “history” of all generated messages.

### **2. Turn it into a web app**

Use Express.js to build:

```
GET /fun-message
```

### **3. Add error handling**

Show friendly errors if the API key is missing, rate limits happen, etc.

### **4. Customize the storytelling style**

Let the user choose:

* Sci-fi
* Fantasy
* Pirate voice
* 90s hacker
* Superhero narrator

---

## **🎉 Congratulations!**
