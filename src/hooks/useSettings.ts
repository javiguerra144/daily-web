import { useCallback, useEffect, useState } from 'react';
import { cloneDefaults, loadSettings, saveSettings } from '@/services/storage';
import type { Member, Settings } from '@/types';
import { randomId } from '@/utils/random';

/** Settings persisted in localStorage plus the editing helpers the UI needs. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => saveSettings(settings), [settings]);

  const update = useCallback(
    (patch: Partial<Settings>) => setSettings(prev => ({ ...prev, ...patch })),
    [],
  );

  const updateMember = useCallback(
    (id: string, patch: Partial<Member>) =>
      setSettings(prev => ({
        ...prev,
        team: prev.team.map(m => (m.id === id ? { ...m, ...patch } : m)),
      })),
    [],
  );

  const addMember = useCallback(
    () =>
      setSettings(prev => ({
        ...prev,
        team: [...prev.team, { id: randomId(), name: 'New person', role: 'Frontend', img: '' }],
      })),
    [],
  );

  const removeMember = useCallback(
    (id: string) => setSettings(prev => ({ ...prev, team: prev.team.filter(m => m.id !== id) })),
    [],
  );

  /** Restores the example team and options; returns them so callers can restart with them. */
  const resetToDefaults = useCallback((): Settings => {
    const defaults = cloneDefaults();
    setSettings(defaults);
    return defaults;
  }, []);

  return { settings, update, updateMember, addMember, removeMember, resetToDefaults };
}
