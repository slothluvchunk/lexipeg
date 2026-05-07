import { STORAGE_KEYS } from './keys';

export type ColorMode = 'default' | 'deuteranopia' | 'protanopia' | 'high-contrast';

export interface Settings {
  wordLength: 4 | 5 | 6 | 7;
  hardMode: boolean;
  colorMode: ColorMode;
  sourceUrl: string;
}

const DEFAULTS: Settings = {
  wordLength: 5,
  hardMode: false,
  colorMode: 'default',
  sourceUrl: '',
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings());
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.settings(), JSON.stringify(settings));
}
