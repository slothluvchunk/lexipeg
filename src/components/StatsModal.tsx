import { useSettings } from '../context/SettingsContext';
import { useGame } from '../context/GameContext';
import { loadStats } from '../storage/stats-store';
import { MAX_GUESSES } from '../engine/game-factory';
import '../styles/components/modal.css';
import './StatsModal.css';

interface StatsModalProps {
  onClose: () => void;
}

export function StatsModal({ onClose }: StatsModalProps) {
  const { settings } = useSettings();
  const { mode } = useGame();
  const stats = loadStats(mode, settings.wordLength);
  const maxGuesses = MAX_GUESSES[settings.wordLength];

  const maxBar = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <h2 className="modal__title">Statistics</h2>
        <div className="stats-grid">
          <div className="stats-grid__item">
            <span className="stats-grid__value">{stats.totalGames}</span>
            <span className="stats-grid__label">Played</span>
          </div>
          <div className="stats-grid__item">
            <span className="stats-grid__value">{Math.round(stats.winRate * 100)}%</span>
            <span className="stats-grid__label">Win %</span>
          </div>
          <div className="stats-grid__item">
            <span className="stats-grid__value">{stats.currentStreak}</span>
            <span className="stats-grid__label">Streak</span>
          </div>
          <div className="stats-grid__item">
            <span className="stats-grid__value">{stats.maxStreak}</span>
            <span className="stats-grid__label">Max</span>
          </div>
        </div>

        <div className="guess-distribution">
          <h3 className="guess-distribution__title">Guess Distribution</h3>
          {Array.from({ length: maxGuesses }, (_, i) => {
            const count = stats.guessDistribution[i + 1] ?? 0;
            const pct = Math.round((count / maxBar) * 100);
            return (
              <div key={i} className="guess-distribution__row">
                <span className="guess-distribution__num">{i + 1}</span>
                <div className="guess-distribution__bar-bg">
                  <div
                    className="guess-distribution__bar"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  >
                    {count > 0 && <span>{count}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {stats.averageGuessesOnWin !== null && (
          <p className="stats-avg">
            Avg guesses on win: {stats.averageGuessesOnWin.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
}
