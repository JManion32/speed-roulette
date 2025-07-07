import { Filter as BadWordsFilter } from "bad-words";
import leoProfanity from "leo-profanity";

const badWordsFilter = new BadWordsFilter();
leoProfanity.loadDictionary("en");

const leoWords = (leoProfanity as any).getDictionary() as string[];

// Merge all to lowercase set
const allBannedWords = new Set([
  ...badWordsFilter.list.map(w => w.toLowerCase()),
  ...leoWords.map(w => w.toLowerCase()),
]);

function normalize(nickname: string): string {
  return nickname.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function checkName(nickname: string): boolean {
  const cleaned = normalize(nickname);
  for (const word of allBannedWords) {
    if (cleaned.includes(word)) return true;
  }
  return false;
}
