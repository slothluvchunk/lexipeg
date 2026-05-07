import { Guess } from '@slothluvchunk/pegkit';
import { Tile } from './Tile';

interface TileRowProps {
  guess?: Guess;
  currentInput?: string[];
  wordLength: number;
  isActive?: boolean;
  isRevealing?: boolean;
  isShaking?: boolean;
}

export function TileRow({ guess, currentInput, wordLength, isActive, isRevealing, isShaking }: TileRowProps) {
  const classes = [
    'tile-row',
    isActive ? 'tile-row--active' : '',
    isShaking ? 'tile-row--shake' : '',
  ].filter(Boolean).join(' ');

  if (guess) {
    return (
      <div className={classes}>
        {guess.feedback.positions.map((pos, i) => (
          <Tile
            key={i}
            letter={pos.symbol}
            state={pos.result}
            flipDelay={i * 150}
            isRevealing={isRevealing}
          />
        ))}
      </div>
    );
  }

  if (currentInput !== undefined) {
    return (
      <div className={classes}>
        {Array.from({ length: wordLength }, (_, i) => (
          <Tile
            key={i}
            letter={currentInput[i]}
            state={currentInput[i] ? 'filled' : 'empty'}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={classes}>
      {Array.from({ length: wordLength }, (_, i) => (
        <Tile key={i} state="empty" />
      ))}
    </div>
  );
}
