import { useGame } from '../context/GameContext';
import './LossReveal.css';

export function LossReveal() {
  const { showLossReveal, word } = useGame();
  if (!showLossReveal) return null;

  return (
    <div className="loss-reveal" aria-live="polite">
      <div className="loss-reveal__label">The word was</div>
      <div className="loss-reveal__word">
        {word.toUpperCase().split('').map((letter, i) => (
          <span
            key={i}
            className="loss-reveal__letter"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
