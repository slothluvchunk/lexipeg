import words4 from '../words/word-lists/words-4.json';
import words5 from '../words/word-lists/words-5.json';
import words6 from '../words/word-lists/words-6.json';
import words7 from '../words/word-lists/words-7.json';

type WordLength = 4 | 5 | 6 | 7;

const dictionaries = new Map<WordLength, Set<string>>();

function getDict(length: WordLength): Set<string> {
  if (!dictionaries.has(length)) {
    const lists: Record<WordLength, string[]> = { 4: words4, 5: words5, 6: words6, 7: words7 };
    dictionaries.set(length, new Set(lists[length]));
  }
  return dictionaries.get(length)!;
}

export function has(word: string): boolean {
  const len = word.length as WordLength;
  if (len < 4 || len > 7) return false;
  return getDict(len).has(word.toLowerCase());
}

export function getWordList(length: WordLength): string[] {
  return [...getDict(length)];
}
