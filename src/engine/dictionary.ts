import words4 from '../words/word-lists/words-4.json';
import words5 from '../words/word-lists/words-5.json';
import words6 from '../words/word-lists/words-6.json';
import words7 from '../words/word-lists/words-7.json';
import validGuesses4 from '../words/word-lists/valid-guesses-4.json';
import validGuesses5 from '../words/word-lists/valid-guesses-5.json';
import validGuesses6 from '../words/word-lists/valid-guesses-6.json';
import validGuesses7 from '../words/word-lists/valid-guesses-7.json';

type WordLength = 4 | 5 | 6 | 7;

const answerDicts = new Map<WordLength, Set<string>>();
const guessDicts = new Map<WordLength, Set<string>>();

function getAnswerDict(length: WordLength): Set<string> {
  if (!answerDicts.has(length)) {
    const lists: Record<WordLength, string[]> = { 4: words4, 5: words5, 6: words6, 7: words7 };
    answerDicts.set(length, new Set(lists[length]));
  }
  return answerDicts.get(length)!;
}

function getGuessDict(length: WordLength): Set<string> {
  if (!guessDicts.has(length)) {
    const lists: Record<WordLength, string[]> = {
      4: validGuesses4,
      5: validGuesses5,
      6: validGuesses6,
      7: validGuesses7,
    };
    guessDicts.set(length, new Set(lists[length]));
  }
  return guessDicts.get(length)!;
}

export function isValidGuess(word: string): boolean {
  const len = word.length as WordLength;
  if (len < 4 || len > 7) return false;
  return getGuessDict(len).has(word.toLowerCase());
}

export function getAnswerList(length: WordLength): string[] {
  return [...getAnswerDict(length)];
}

export function has(word: string): boolean {
  return isValidGuess(word);
}

export function getWordList(length: WordLength): string[] {
  return getAnswerList(length);
}
