import { STORAGE_KEYS } from './keys';

export interface SerializedGame {
  mode: 'daily' | 'freeplay';
  wordLength: number;
  secretWord: string;
  guesses: { symbols: string[]; submittedAt: number }[];
  hardMode: boolean;
  startedAt: number;
  dailyDate?: string;
}

export function saveGame(game: SerializedGame): void {
  localStorage.setItem(STORAGE_KEYS.currentGame(), JSON.stringify(game));
}

export function loadGame(): SerializedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.currentGame());
    return raw ? (JSON.parse(raw) as SerializedGame) : null;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  localStorage.removeItem(STORAGE_KEYS.currentGame());
}
