import { DEFAULT_SETTINGS, STORAGE_KEY } from '@/constants/defaults';
import type { Settings } from '@/types';

export function cloneDefaults(): Settings {
  return structuredClone(DEFAULT_SETTINGS);
}

/** Reads persisted settings, falling back to the defaults when missing or corrupt. */
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Settings> | null) : null;
    if (parsed && Array.isArray(parsed.team)) return { ...cloneDefaults(), ...parsed };
  } catch {
    // ignore: unavailable or corrupt storage
  }
  return cloneDefaults();
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore: quota exceeded or storage disabled
  }
}
