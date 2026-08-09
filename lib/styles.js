// lib/styles.js
//
// Bonus challenge #4: Customize the storytelling style.
// Each style maps to a short flavor instruction that gets appended
// to the base system instruction sent to the model.

export const STYLES = {
  default: {
    label: "Default (playful storyteller)",
    flavor: "",
  },
  scifi: {
    label: "Sci-fi",
    flavor:
      "Frame your response in a science-fiction setting — spaceships, AI companions, distant planets, or futuristic tech.",
  },
  fantasy: {
    label: "Fantasy",
    flavor:
      "Frame your response in a fantasy setting — wizards, dragons, enchanted forests, or magical quests.",
  },
  pirate: {
    label: "Pirate voice",
    flavor:
      "Speak like a jolly pirate captain. Use pirate slang (arr, matey, ye, etc.) throughout.",
  },
  hacker90s: {
    label: "90s hacker",
    flavor:
      "Write like a stereotypical 1990s movie hacker — dial-up modems, neon terminals, 'I'm in', floppy disks, dramatic keyboard-mashing energy.",
  },
  superhero: {
    label: "Superhero narrator",
    flavor:
      "Narrate like a bombastic comic-book superhero announcer introducing the next big hero's origin story.",
  },
};

export const DEFAULT_STYLE = "default";

export function isValidStyle(style) {
  return Object.prototype.hasOwnProperty.call(STYLES, style);
}

export function listStyleKeys() {
  return Object.keys(STYLES);
}

export function describeStyles() {
  return Object.entries(STYLES)
    .map(([key, { label }]) => `  - ${key}: ${label}`)
    .join("\n");
}
