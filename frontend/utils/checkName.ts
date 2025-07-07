import { Filter as BadWordsFilter } from "bad-words";
import leoProfanity from "leo-profanity";

// Initialize both filters
const badWordsFilter = new BadWordsFilter();
leoProfanity.loadDictionary('en'); // Loads default dictionary

/**
 * Normalize input by removing non-alphanumerics and lowering case
 */
function normalize(nickname: string): string {
  return nickname.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/**
 * Returns true if nickname contains a profane substring
 */
export function checkName(nickname: string): boolean {
  const cleaned = normalize(nickname);
  return (
    badWordsFilter.isProfane(cleaned) || 
    leoProfanity.check(cleaned)
  );
}

