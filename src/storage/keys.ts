export const STORAGE_KEYS = {
  stats: (mode: 'daily' | 'freeplay', length: number) =>
    `lexipeg:stats:${mode}:${length}`,
  currentGame: () => 'lexipeg:state:current',
  settings: () => 'lexipeg:settings',
  dailyCompleted: (date: string, length: number) =>
    `lexipeg:daily:${date}:${length}`,
  tutorialShown: () => 'lexipeg:tutorial-shown',
} as const;
