import { GameSession, Statistics, type StatisticsSummary, type GameStatus } from '@slothluvchunk/pegkit';
import { STORAGE_KEYS } from './keys';

type CompletedSession = GameSession & { status: Exclude<GameStatus, 'in-progress'> };

const DEFAULT_SUMMARY: StatisticsSummary = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
  averageGuessesOnWin: null,
};

export function loadStats(mode: 'daily' | 'freeplay', length: number): StatisticsSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.stats(mode, length));
    return raw ? (JSON.parse(raw) as StatisticsSummary) : { ...DEFAULT_SUMMARY };
  } catch {
    return { ...DEFAULT_SUMMARY };
  }
}

export function saveStats(mode: 'daily' | 'freeplay', length: number, summary: StatisticsSummary): void {
  localStorage.setItem(STORAGE_KEYS.stats(mode, length), JSON.stringify(summary));
}

export function recordGame(
  mode: 'daily' | 'freeplay',
  length: number,
  session: GameSession
): StatisticsSummary {
  const current = loadStats(mode, length);
  const updated = Statistics.update(current, session as CompletedSession);
  saveStats(mode, length, updated);
  return updated;
}
