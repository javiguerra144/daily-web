import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

/** Native size of the stage contents (pack + card), in px. */
const STAGE_WIDTH = 420;
const STAGE_HEIGHT = 760;

/**
 * Scales the fixed-size stage contents to fit the stage element and the viewport height.
 * Re-measures on window resize and whenever `active` becomes true (e.g. un-hidden).
 */
export function useStageScale(stageRef: RefObject<HTMLElement | null>, active: boolean) {
  const [fit, setFit] = useState({ scale: 1, minHeight: 600 });

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const width = stage?.clientWidth;
    if (!stage || !width) return;
    const available = Math.max(
      480,
      window.innerHeight - (stage.getBoundingClientRect().top + window.scrollY) - 36,
    );
    const scale = Math.min(1.7, (width - 24) / STAGE_WIDTH, available / STAGE_HEIGHT);
    setFit({ scale, minHeight: Math.max(460, STAGE_HEIGHT * scale) });
  }, [stageRef]);

  useLayoutEffect(() => {
    if (!active) return;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, measure]);

  return fit;
}
