import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GameSession, Guess } from '@slothluvchunk/pegkit';
import { createGame, GameSetup } from '../engine/game-factory';
import { deriveKeyboardState, KeyboardState } from '../engine/keyboard-state';
import { checkHardModeViolation } from '../engine/hard-mode';
import { recordGame } from '../storage/stats-store';
import { saveGame, loadGame, clearGame } from '../storage/game-store';
import { STORAGE_KEYS } from '../storage/keys';
import { useSettings } from './SettingsContext';

export type GameStatus = 'in-progress' | 'won' | 'lost';

export interface ToastMessage {
  id: number;
  text: string;
}

interface GameContextValue {
  session: GameSession | null;
  guesses: Guess[];
  currentGuess: string[];
  status: GameStatus;
  keyboardState: KeyboardState;
  mode: 'daily' | 'freeplay';
  word: string;
  isLoading: boolean;
  toasts: ToastMessage[];
  showWinCelebration: boolean;
  showLossReveal: boolean;
  showGameOverModal: boolean;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  newGame: (mode?: 'daily' | 'freeplay') => void;
  setMode: (mode: 'daily' | 'freeplay') => void;
  dismissGameOverModal: () => void;
  dismissToast: (id: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

let toastIdCounter = 0;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [setup, setSetup] = useState<GameSetup | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>('in-progress');
  const [mode, setModeState] = useState<'daily' | 'freeplay'>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [showLossReveal, setShowLossReveal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const keyboardState = deriveKeyboardState(guesses);

  const addToast = useCallback((text: string) => {
    const id = ++toastIdCounter;
    setToasts(ts => [...ts, { id, text }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 2200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  const startGame = useCallback(async (m: 'daily' | 'freeplay', wLen?: 4 | 5 | 6 | 7) => {
    setIsLoading(true);
    try {
      const wordLength = wLen ?? settings.wordLength;

      // Check if daily already completed
      if (m === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        const completedRaw = localStorage.getItem(STORAGE_KEYS.dailyCompleted(today, wordLength));
        if (completedRaw) {
          // Restore completed daily
          const saved = loadGame();
          if (saved && saved.mode === 'daily' && saved.wordLength === wordLength) {
            // Re-create session in completed state
            const gs = await createGame({ wordLength, mode: 'daily' });
            // Replay guesses
            for (const g of saved.guesses) {
              gs.session.submitGuess(g.symbols);
            }
            setSetup(gs);
            setGuesses([...gs.session.guesses]);
            setStatus(gs.session.status as GameStatus);
            setCurrentGuess([]);
            setIsLoading(false);
            return;
          }
        }
      }

      const sourceUrl = settings.sourceUrl || undefined;
      const gs = await createGame({ wordLength, mode: m, sourceUrl });
      setSetup(gs);
      setGuesses([]);
      setCurrentGuess([]);
      setStatus('in-progress');
      setShowWinCelebration(false);
      setShowLossReveal(false);
      setShowGameOverModal(false);
      clearGame();
    } finally {
      setIsLoading(false);
    }
  }, [settings.wordLength, settings.sourceUrl]);

  // Init on mount
  useEffect(() => {
    startGame(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restart when word length changes
  const prevWordLength = useRef(settings.wordLength);
  useEffect(() => {
    if (prevWordLength.current !== settings.wordLength) {
      prevWordLength.current = settings.wordLength;
      startGame(mode);
    }
  }, [settings.wordLength, mode, startGame]);

  const addLetter = useCallback((letter: string) => {
    if (status !== 'in-progress' || !setup || isRevealing) return;
    if (currentGuess.length >= settings.wordLength) return;
    setCurrentGuess(cg => [...cg, letter.toLowerCase()]);
  }, [status, setup, isRevealing, currentGuess.length, settings.wordLength]);

  const removeLetter = useCallback(() => {
    if (status !== 'in-progress' || isRevealing) return;
    setCurrentGuess(cg => cg.slice(0, -1));
  }, [status, isRevealing]);

  const submitGuess = useCallback(() => {
    if (!setup || status !== 'in-progress' || isRevealing) return;
    if (currentGuess.length !== settings.wordLength) {
      addToast('Not enough letters');
      return;
    }

    // Hard mode check before PegKit
    if (settings.hardMode && guesses.length > 0) {
      const violation = checkHardModeViolation(currentGuess, guesses);
      if (violation) {
        addToast(`Hard mode: ${violation.message}`);
        return;
      }
    }

    const result = setup.session.submitGuess(currentGuess);
    if (typeof result === 'string') {
      // InvalidGuessReason
      if (result === 'validation-failed') addToast('Not in word list');
      else if (result === 'wrong-length') addToast('Not enough letters');
      else if (result === 'duplicate-not-allowed') addToast('No duplicate letters');
      else if (result === 'game-over') addToast('Game is over');
      else addToast('Invalid guess');
      return;
    }

    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    // Save progress
    saveGame({
      mode,
      wordLength: settings.wordLength,
      secretWord: setup.word,
      guesses: newGuesses.map(g => ({ symbols: [...g.symbols], submittedAt: g.submittedAt })),
      hardMode: settings.hardMode,
      startedAt: Date.now(),
    });

    // Staggered reveal — keyboard updates after full row animation
    const revealDuration = settings.wordLength * 150 + 300;
    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealing(false);

      const newStatus = setup.session.status as GameStatus;
      if (newStatus !== 'in-progress') {
        setStatus(newStatus);
        recordGame(mode, settings.wordLength, setup.session);
        clearGame();

        if (mode === 'daily') {
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem(STORAGE_KEYS.dailyCompleted(today, settings.wordLength), '1');
        }

        if (newStatus === 'won') {
          setShowWinCelebration(true);
          setTimeout(() => {
            setShowWinCelebration(false);
            setShowGameOverModal(true);
          }, 2500);
        } else {
          setShowLossReveal(true);
          setTimeout(() => {
            setShowLossReveal(false);
            setShowGameOverModal(true);
          }, 2500);
        }
      }
    }, revealDuration);
  }, [setup, status, isRevealing, currentGuess, settings, guesses, mode, addToast]);

  const newGame = useCallback((m?: 'daily' | 'freeplay') => {
    const newMode = m ?? mode;
    setModeState(newMode);
    startGame(newMode);
  }, [mode, startGame]);

  const setMode = useCallback((m: 'daily' | 'freeplay') => {
    setModeState(m);
    startGame(m);
  }, [startGame]);

  const dismissGameOverModal = useCallback(() => setShowGameOverModal(false), []);

  return (
    <GameContext.Provider value={{
      session: setup?.session ?? null,
      guesses,
      currentGuess,
      status,
      keyboardState,
      mode,
      word: setup?.word ?? '',
      isLoading,
      toasts,
      showWinCelebration,
      showLossReveal,
      showGameOverModal,
      addLetter,
      removeLetter,
      submitGuess,
      newGame,
      setMode,
      dismissGameOverModal,
      dismissToast,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
