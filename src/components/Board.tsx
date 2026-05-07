import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';
import { TileRow } from './TileRow';
import '../styles/components/board.css';

export function Board() {
  const { guesses, currentGuess, status, session } = useGame();
  const { settings } = useSettings();
  const [shakingRow, setShakingRow] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);

  const maxGuesses = session?.config.maxGuesses ?? 6;
  const wordLength = settings.wordLength;

  // Listen for invalid guesses to trigger shake
  useEffect(() => {
    const handler = () => {
      setShakingRow(true);
      setTimeout(() => setShakingRow(false), 500);
    };
    window.addEventListener('lexipeg:invalid-guess', handler);
    return () => window.removeEventListener('lexipeg:invalid-guess', handler);
  }, []);

  // Track which row is currently revealing
  useEffect(() => {
    if (guesses.length > 0) {
      const idx = guesses.length - 1;
      setRevealingRow(idx);
      setTimeout(() => setRevealingRow(null), wordLength * 150 + 350);
    }
  }, [guesses.length, wordLength]);

  const rows = [];
  for (let i = 0; i < maxGuesses; i++) {
    if (i < guesses.length) {
      rows.push(
        <TileRow
          key={i}
          guess={guesses[i]}
          wordLength={wordLength}
          isRevealing={revealingRow === i}
        />
      );
    } else if (i === guesses.length && status === 'in-progress') {
      rows.push(
        <TileRow
          key={i}
          currentInput={currentGuess}
          wordLength={wordLength}
          isActive
          isShaking={shakingRow}
        />
      );
    } else {
      rows.push(<TileRow key={i} wordLength={wordLength} />);
    }
  }

  return <div className="board-container">{rows}</div>;
}
