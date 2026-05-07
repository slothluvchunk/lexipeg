import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../storage/keys';
import './Tutorial.css';

export function Tutorial() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem(STORAGE_KEYS.tutorialShown());
    if (!shown) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEYS.tutorialShown(), '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial">
        <h2 className="tutorial__title">How to Play</h2>
        <p className="tutorial__subtitle">Guess the hidden word. Each guess must be a valid word.</p>
        <div className="tutorial__examples">
          <div className="tutorial__example">
            <div className="tutorial__tile tutorial__tile--exact">W<span className="tutorial__indicator">✓</span></div>
            <span className="tutorial__desc"><strong>Exact</strong> — right letter, right spot</span>
          </div>
          <div className="tutorial__example">
            <div className="tutorial__tile tutorial__tile--present">A<span className="tutorial__indicator">○</span></div>
            <span className="tutorial__desc"><strong>Present</strong> — right letter, wrong spot</span>
          </div>
          <div className="tutorial__example">
            <div className="tutorial__tile tutorial__tile--absent">Z<span className="tutorial__indicator">✕</span></div>
            <span className="tutorial__desc"><strong>Absent</strong> — not in the word</span>
          </div>
        </div>
        <button className="tutorial__btn" onClick={dismiss}>Start Playing</button>
      </div>
    </div>
  );
}
