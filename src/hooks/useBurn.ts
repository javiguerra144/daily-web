import { useEffect, type RefObject } from 'react';
import {
  BURN_H,
  BURN_W,
  burnRadius,
  makeBurnField,
  paintBurnMask,
  paintEmbers,
} from '@/utils/burn';

const TICK_MS = 100;
/** Radius changes smaller than this don't justify rebuilding the mask. */
const MASK_EPSILON = 0.002;

interface UseBurnOptions {
  /** Burn effect is armed (card revealed and its turn running). */
  enabled: boolean;
  warnAt: number;
  leftRef: RefObject<number>;
  cardRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

/**
 * Once the warning threshold is crossed the card slowly burns away from its corners:
 * embers are painted on `canvasRef` and an alpha mask erodes `cardRef`.
 */
export function useBurn({ enabled, warnAt, leftRef, cardRef, canvasRef }: UseBurnOptions) {
  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!enabled || !card || !canvas) return;
    const ctx = canvas.getContext('2d');
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = BURN_W;
    maskCanvas.height = BURN_H;
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    let field: Float32Array | null = null;
    let lastRadius = -1;

    const reset = () => {
      field = null;
      lastRadius = -1;
      card.style.maskImage = card.style.webkitMaskImage = '';
      ctx.clearRect(0, 0, BURN_W, BURN_H);
    };

    const tick = () => {
      const left = leftRef.current;
      if (left > warnAt) {
        if (lastRadius >= 0) reset();
        return;
      }
      field ??= makeBurnField();
      const radius = burnRadius(warnAt - left);

      const embers = ctx.createImageData(BURN_W, BURN_H);
      paintEmbers(embers.data, field, radius, performance.now() / 140);
      ctx.putImageData(embers, 0, 0);

      if (Math.abs(radius - lastRadius) > MASK_EPSILON) {
        lastRadius = radius;
        const mask = maskCtx.createImageData(BURN_W, BURN_H);
        paintBurnMask(mask.data, field, radius);
        maskCtx.putImageData(mask, 0, 0);
        card.style.maskImage = card.style.webkitMaskImage = `url(${maskCanvas.toDataURL()})`;
        card.style.maskSize = card.style.webkitMaskSize = '100% 100%';
      }
    };

    const id = setInterval(tick, TICK_MS);
    return () => {
      clearInterval(id);
      reset();
    };
  }, [enabled, warnAt, leftRef, cardRef, canvasRef]);
}
