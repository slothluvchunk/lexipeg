import { useGame } from '../context/GameContext';
import './ModeSwitcher.css';

export function ModeSwitcher() {
  const { mode, setMode } = useGame();

  return (
    <div className="mode-switcher">
      <button
        className={`mode-switcher__btn ${mode === 'daily' ? 'mode-switcher__btn--active' : ''}`}
        onClick={() => setMode('daily')}
      >
        Daily
      </button>
      <button
        className={`mode-switcher__btn ${mode === 'freeplay' ? 'mode-switcher__btn--active' : ''}`}
        onClick={() => setMode('freeplay')}
      >
        Free
      </button>
    </div>
  );
}
