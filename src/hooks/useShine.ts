import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from 'react';
import { clamp } from '@/utils/format';

const SHINE_VARS = ['--mx', '--my', '--rx', '--ry'];
/** Idle animation resumes this long after the pointer stops moving. */
const POINTER_IDLE_MS = 1500;

function applyShine(card: HTMLElement, mx: number, my: number, strength: number) {
  card.style.setProperty('--mx', `${mx.toFixed(1)}%`);
  card.style.setProperty('--my', `${my.toFixed(1)}%`);
  card.style.setProperty('--ry', `${(((mx - 50) / 50) * 14 * strength).toFixed(2)}deg`);
  card.style.setProperty('--rx', `${((-(my - 50) / 50) * 10 * strength).toFixed(2)}deg`);
}

/**
 * Holographic tilt/glare for a card. Follows the pointer while it moves over the stage and
 * drifts on its own otherwise. Writes CSS variables straight to the element for performance.
 * Returns a pointer-move handler to attach to the stage.
 */
export function useShine(
  cardRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  reducedMotion: boolean,
) {
  const lastPointer = useRef(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!enabled || !card) return;
    lastPointer.current = 0;

    let raf = 0;
    if (reducedMotion) {
      applyShine(card, 35, 25, 0);
    } else {
      const tick = (now: number) => {
        if (now - lastPointer.current > POINTER_IDLE_MS) {
          const t = now / 1000;
          applyShine(card, 50 + Math.sin(t * 0.8) * 42, 40 + Math.cos(t * 0.6) * 28, 0.45);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      SHINE_VARS.forEach(name => card.style.removeProperty(name));
    };
  }, [cardRef, enabled, reducedMotion]);

  return useCallback(
    (e: PointerEvent) => {
      const card = cardRef.current;
      if (!enabled || !card) return;
      const rect = card.getBoundingClientRect();
      const mx = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
      const my = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
      lastPointer.current = performance.now();
      applyShine(card, mx, my, 1);
    },
    [cardRef, enabled],
  );
}
