import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { KeyboardKey } from './KeyboardKey';
import '../styles/components/keyboard.css';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

export function Keyboard() {
  const { addLetter, removeLetter, submitGuess, keyboardState, status } = useGame();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (status !== 'in-progress') return;
      if (e.key === 'Enter') { submitGuess(); return; }
      if (e.key === 'Backspace') { removeLetter(); return; }
      if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addLetter, removeLetter, submitGuess, status]);

  return (
    <div className="keyboard" role="group" aria-label="On-screen keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="keyboard__row">
          {row.map(key => {
            if (key === 'Enter') return (
              <KeyboardKey key="enter" label="Enter" wide onPress={submitGuess} />
            );
            if (key === 'Backspace') return (
              <KeyboardKey key="backspace" label="⌫" wide onPress={removeLetter} />
            );
            return (
              <KeyboardKey
                key={key}
                label={key}
                status={keyboardState.letters[key]}
                onPress={() => addLetter(key)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
