import { WordSource, WordSourceResult } from './types';
import { getWordList } from '../engine/dictionary';

type WordLength = 4 | 5 | 6 | 7;

const EPOCH = new Date('2025-01-01').getTime();

function daysSinceEpoch(): number {
  return Math.floor((Date.now() - EPOCH) / (1000 * 60 * 60 * 24));
}

export class StaticSource implements WordSource {
  constructor(private mode: 'daily' | 'freeplay') {}

  async extract(options: { wordLength: number; dictionary: Set<string> }): Promise<WordSourceResult> {
    const list = getWordList(options.wordLength as WordLength);
    if (list.length === 0) throw new Error(`No words available for length ${options.wordLength}`);

    let word: string;
    if (this.mode === 'daily') {
      word = list[daysSinceEpoch() % list.length];
    } else {
      word = list[Math.floor(Math.random() * list.length)];
    }
    return { word };
  }
}
