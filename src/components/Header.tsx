import { useEffect, useState } from 'react';
import { ModeSwitcher } from './ModeSwitcher';
import { WordLengthSelector } from './WordLengthSelector';
import '../styles/components/header.css';

interface HeaderProps {
  onStatsClick: () => void;
  onSettingsClick: () => void;
}

const SHEEP = `  /\\_/\\  ~\n ( o.o )\n  > ^ <\n /|   |\\\n(_|   |_)`;

export function Header({ onStatsClick, onSettingsClick }: HeaderProps) {
  const [sheepAnimated, setSheepAnimated] = useState(false);

  useEffect(() => {
    // Run once per app load
    setSheepAnimated(true);
  }, []);

  return (
    <header className="header">
      <div className="header__logo">
        <div style={{ position: 'relative' }}>
          <pre className={`header__sheep ${sheepAnimated ? 'header__sheep--animating' : ''}`}>
            {SHEEP}
          </pre>
          <pre className="header__sheep header__sheep-glitch" aria-hidden>
            {SHEEP}
          </pre>
        </div>
        <span className="header__title">LexiPeg</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <ModeSwitcher />
        <WordLengthSelector />
      </div>
      <div className="header__controls">
        <button className="header__icon-btn" onClick={onStatsClick} aria-label="Statistics">
          📊
        </button>
        <button className="header__icon-btn" onClick={onSettingsClick} aria-label="Settings">
          ⚙️
        </button>
      </div>
    </header>
  );
}
