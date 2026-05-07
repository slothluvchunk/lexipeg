import { Guess } from '@slothluvchunk/pegkit';

export type LetterStatus = 'exact' | 'present' | 'absent' | 'unused';

export interface KeyboardState {
  letters: Record<string, LetterStatus>;
  confirmedPositions: Record<string, Set<number>>;
}

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  exact: 3,
  present: 2,
  absent: 1,
  unused: 0,
};

export function deriveKeyboardState(guesses: readonly Guess[]): KeyboardState {
  const letters: Record<string, LetterStatus> = {};
  const confirmedPositions: Record<string, Set<number>> = {};

  for (const guess of guesses) {
    for (const pos of guess.feedback.positions) {
      const { symbol, result, position } = pos;
      const current = letters[symbol] ?? 'unused';
      if (STATUS_PRIORITY[result] > STATUS_PRIORITY[current]) {
        letters[symbol] = result;
      }
      if (result === 'exact') {
        if (!confirmedPositions[symbol]) confirmedPositions[symbol] = new Set();
        confirmedPositions[symbol].add(position);
      }
    }
  }

  return { letters, confirmedPositions };
}
