import { useGame } from '../context/GameContext';
import './WinCelebration.css';

export function WinCelebration() {
  const { showWinCelebration } = useGame();
  if (!showWinCelebration) return null;

  return (
    <div className="win-celebration" aria-hidden>
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="win-celebration__particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            '--hue': `${Math.random() > 0.5 ? 180 : 310}deg`,
          } as React.CSSProperties}
        />
      ))}
      <div className="win-celebration__glitch-text">ACCESS GRANTED</div>
    </div>
  );
}
