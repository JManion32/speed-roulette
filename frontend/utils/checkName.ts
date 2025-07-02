import { Filter as BadWordsFilter } from "bad-words";
import leoProfanity from "leo-profanity";

// Initialize both filters
const badWordsFilter = new BadWordsFilter();
leoProfanity.loadDictionary(); // Loads default dictionary

// Merge both dictionaries into one Set
const allBannedWords = new Set([
    ...badWordsFilter.list,
    ...leoProfanity.getDictionary(),
]);

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
    for (const word of allBannedWords) {
        if (cleaned.includes(word)) {
            return true;
        }
    }

    return false;
}
