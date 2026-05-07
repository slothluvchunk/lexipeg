import { GameConfig, SecretSequence, GameSession } from '@slothluvchunk/pegkit';
import { WordSourceResult } from '../words/types';
import { StaticSource } from '../words/static-source';
import { UrlSource } from './url-source';

export const MAX_GUESSES: Record<number, number> = { 4: 5, 5: 6, 6: 7, 7: 7 };

export interface GameSetup {
  session: GameSession;
  word: string;
  source: WordSourceResult;
}

export async function createGame(options: {
  wordLength: 4 | 5 | 6 | 7;
  mode: 'daily' | 'freeplay';
  sourceUrl?: string;
  validator?: (symbols: readonly string[]) => boolean;
}): Promise<GameSetup> {
  const { wordLength, mode, sourceUrl, validator } = options;
  const wordSource = sourceUrl ? new UrlSource(sourceUrl) : new StaticSource(mode);
  const source = await wordSource.extract({ wordLength, dictionary: new Set() });

  const config = new GameConfig({
    sequenceLength: wordLength,
    maxGuesses: MAX_GUESSES[wordLength],
    symbolPool: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    allowDuplicates: true,
    validator: validator ?? (() => true),
  });

  const secret = new SecretSequence(source.word.split(''), config);
  const session = new GameSession(config, secret);

  return { session, word: source.word, source };
}
