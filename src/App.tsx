import { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { GameProvider } from './context/GameContext';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { Toast } from './components/Toast';
import { Tutorial } from './components/Tutorial';
import { WinCelebration } from './components/WinCelebration';
import { LossReveal } from './components/LossReveal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import './App.css';

function AppInner() {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="app">
      <Tutorial />
      <Header onStatsClick={() => setShowStats(true)} onSettingsClick={() => setShowSettings(true)} />
      <main className="app__main">
        <Board />
        <Keyboard />
      </main>
      <Toast />
      <WinCelebration />
      <LossReveal />
      <GameOverModal />
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </SettingsProvider>
  );
}
