import { useEffect, useState } from 'react';
import '../styles/components/tile.css';

type TileState = 'empty' | 'filled' | 'exact' | 'present' | 'absent';

interface TileProps {
  letter?: string;
  state: TileState;
  flipDelay?: number;
  isRevealing?: boolean;
}

const INDICATORS: Record<string, string> = {
  exact: '✓',
  present: '○',
  absent: '✕',
};

export function Tile({ letter, state, flipDelay = 0, isRevealing = false }: TileProps) {
  const [displayState, setDisplayState] = useState<TileState>(
    state === 'exact' || state === 'present' || state === 'absent' ? 'filled' : state
  );
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if ((state === 'exact' || state === 'present' || state === 'absent') && isRevealing) {
      const t = setTimeout(() => {
        setFlipping(true);
        setTimeout(() => {
          setDisplayState(state);
          setFlipping(false);
        }, 250);
      }, flipDelay);
      return () => clearTimeout(t);
    } else if (!isRevealing) {
      setDisplayState(state);
    }
  }, [state, flipDelay, isRevealing]);

  const classes = [
    'tile',
    `tile--${displayState}`,
    flipping ? 'tile--flipping' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {letter?.toUpperCase()}
      {(displayState === 'exact' || displayState === 'present' || displayState === 'absent') && (
        <span className="tile__indicator">{INDICATORS[displayState]}</span>
      )}
    </div>
  );
}
