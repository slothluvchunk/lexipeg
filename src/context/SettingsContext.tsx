import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, ColorMode, loadSettings, saveSettings } from '../storage/settings-store';

interface SettingsContextValue {
  settings: Settings;
  setWordLength: (len: 4 | 5 | 6 | 7) => void;
  setHardMode: (on: boolean) => void;
  setColorMode: (mode: ColorMode) => void;
  setSourceUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
    // Apply color mode to :root
    document.documentElement.setAttribute('data-color-mode', settings.colorMode);
  }, [settings]);

  const setWordLength = (wordLength: 4 | 5 | 6 | 7) =>
    setSettings(s => ({ ...s, wordLength }));
  const setHardMode = (hardMode: boolean) =>
    setSettings(s => ({ ...s, hardMode }));
  const setColorMode = (colorMode: ColorMode) =>
    setSettings(s => ({ ...s, colorMode }));
  const setSourceUrl = (sourceUrl: string) =>
    setSettings(s => ({ ...s, sourceUrl }));

  return (
    <SettingsContext.Provider value={{ settings, setWordLength, setHardMode, setColorMode, setSourceUrl }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
