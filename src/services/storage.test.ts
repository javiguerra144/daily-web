import { DEFAULT_SETTINGS, STORAGE_KEY } from '@/constants/defaults';
import { loadSettings, saveSettings } from './storage';

describe('storage', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips settings', () => {
    const settings = { ...DEFAULT_SETTINGS, minutes: 5, warnAt: 45 };
    saveSettings(settings);
    expect(loadSettings()).toEqual(settings);
  });

  it('falls back to defaults on corrupt data', () => {
    localStorage.setItem(STORAGE_KEY, '{nope');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('falls back to defaults when the team is missing', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ minutes: 9 }));
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('fills options missing from older saves', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ team: [], minutes: 9 }));
    expect(loadSettings()).toMatchObject({ minutes: 9, team: [], sound: true });
  });

  it('returns a copy, not the shared defaults', () => {
    loadSettings().team.pop();
    expect(DEFAULT_SETTINGS.team).toHaveLength(6);
  });
});
