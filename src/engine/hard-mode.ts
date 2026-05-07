import { Guess } from '@slothluvchunk/pegkit';

export interface HardModeViolation {
  message: string;
}

export function checkHardModeViolation(
  symbols: readonly string[],
  guesses: readonly Guess[]
): HardModeViolation | null {
  for (const guess of guesses) {
    for (const pos of guess.feedback.positions) {
      if (pos.result === 'exact' && symbols[pos.position] !== pos.symbol) {
        return { message: `Letter ${pos.position + 1} must be ${pos.symbol.toUpperCase()}` };
      }
    }
  }

  // Collect all present letters (must appear somewhere)
  const presentLetters = new Map<string, number>(); // letter -> min count required
  for (const guess of guesses) {
    const counts = new Map<string, number>();
    for (const pos of guess.feedback.positions) {
      if (pos.result === 'present' || pos.result === 'exact') {
        counts.set(pos.symbol, (counts.get(pos.symbol) ?? 0) + 1);
      }
    }
    for (const [sym, count] of counts) {
      presentLetters.set(sym, Math.max(presentLetters.get(sym) ?? 0, count));
    }
  }

  for (const [sym, minCount] of presentLetters) {
    const actualCount = symbols.filter(s => s === sym).length;
    if (actualCount < minCount) {
      return { message: `Guess must contain ${sym.toUpperCase()}` };
    }
  }

  return null;
}

export function createHardModeValidator(
  guesses: readonly Guess[],
  dictionaryValidator: (symbols: readonly string[]) => boolean
): (symbols: readonly string[]) => boolean {
  return (symbols) => {
    if (checkHardModeViolation(symbols, guesses) !== null) return false;
    return dictionaryValidator(symbols);
  };
}
