import { useEffect } from 'react';
import { useEventCallback } from './useEventCallback';

interface Shortcuts {
  /** Space */
  onSpace: () => void;
  /** R */
  onReroll: () => void;
  /** P */
  onPause: () => void;
}

const FORM_CONTROLS = 'input, select, textarea, button';

/** Global stage shortcuts; ignored while `enabled` is false or a form control has focus. */
export function useKeyboardShortcuts(enabled: boolean, { onSpace, onReroll, onPause }: Shortcuts) {
  const handleSpace = useEventCallback(onSpace);
  const handleReroll = useEventCallback(onReroll);
  const handlePause = useEventCallback(onPause);

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.matches(FORM_CONTROLS)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleSpace();
      }
      const key = e.key.toLowerCase();
      if (key === 'r') handleReroll();
      if (key === 'p') handlePause();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, handleSpace, handleReroll, handlePause]);
}
