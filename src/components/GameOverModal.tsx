import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';
import { loadStats } from '../storage/stats-store';
import { ShareButton } from './ShareButton';
import '../styles/components/modal.css';
import './GameOverModal.css';

export function GameOverModal() {
  const { showGameOverModal, dismissGameOverModal, status, word, newGame, mode } = useGame();
  const { settings } = useSettings();

  if (!showGameOverModal) return null;

  const stats = loadStats(mode, settings.wordLength);
  const won = status === 'won';

  return (
    <div className="modal-overlay" onClick={dismissGameOverModal}>
      <div className="modal game-over-modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={dismissGameOverModal}>✕</button>
        <h2 className={`modal__title ${won ? 'modal__title--win' : 'modal__title--loss'}`}>
          {won ? '[ ACCESS GRANTED ]' : '[ ACCESS DENIED ]'}
        </h2>
        {!won && (
          <p className="game-over-word">
            The word was: <span className="game-over-word__reveal">{word.toUpperCase()}</span>
          </p>
        )}
        <div className="game-over-stats">
          <span>{stats.currentStreak} streak</span>
          <span>{stats.wins} wins</span>
          <span>{Math.round(stats.winRate * 100)}% rate</span>
        </div>
        <div className="game-over-actions">
          <ShareButton />
          {mode === 'freeplay' && (
            <button className="game-over-new-btn" onClick={() => { dismissGameOverModal(); newGame(); }}>
              New Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
