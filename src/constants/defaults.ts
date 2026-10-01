import type { Rarity, Settings } from '@/types';

export const STORAGE_KEY = 'daily-pack-v1';

export const DEFAULT_SETTINGS: Settings = {
  minutes: 2,
  seconds: 0,
  warnAt: 20,
  shuffle: true,
  autoNext: false,
  sound: true,
  team: [
    { id: 'a', name: 'Lucía (example)', role: 'Frontend', img: '' },
    { id: 'b', name: 'Marcos (example)', role: 'Backend', img: '' },
    { id: 'c', name: 'Aitana (example)', role: 'Design', img: '' },
    { id: 'd', name: 'Diego (example)', role: 'QA', img: '' },
    { id: 'e', name: 'Nerea (example)', role: 'Product', img: '' },
    { id: 'f', name: 'Pablo (example)', role: 'DevOps', img: '' },
  ],
};

export const MIN_TURN_SECONDS = 5;
export const EXTRA_TIME_SECONDS = 30;
export const TIME_PRESETS = [60, 90, 120, 180] as const;

export const RARITIES: readonly Rarity[] = [
  ['Common', '●', 0.65],
  ['Uncommon', '◆', 0.35],
];
