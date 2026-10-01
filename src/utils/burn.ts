/** Resolution of the burn-field grid (the card is 320×456, scaled down for speed). */
export const BURN_W = 120;
export const BURN_H = 171;
/** Seconds past the warning threshold until the card is almost fully burnt. */
export const BURN_DURATION = 300;

/**
 * Builds a distance-to-corner field perturbed with fractal noise. Thresholding it at a
 * growing radius gives an irregular burn front that creeps in from the corners.
 */
export function makeBurnField(random: () => number = Math.random): Float32Array {
  const grids = [5, 10, 22].map(n => ({
    n,
    v: Array.from({ length: (n + 1) * (n + 1) }, random),
  }));

  const noise = (u: number, v: number) => {
    let total = 0;
    let amp = 0.55;
    let sum = 0;
    for (const g of grids) {
      const x = u * g.n;
      const y = v * g.n;
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const at = (i: number, j: number) => g.v[Math.min(g.n, j) * (g.n + 1) + Math.min(g.n, i)]!;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const top = at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx;
      const bottom = at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx;
      total += (top * (1 - sy) + bottom * sy) * amp;
      sum += amp;
      amp *= 0.5;
    }
    return total / sum;
  };

  const weights = [0, 0, 0, 0].map(() => 0.8 + random() * 0.45) as [number, number, number, number];
  const field = new Float32Array(BURN_W * BURN_H);
  for (let y = 0; y < BURN_H; y++) {
    for (let x = 0; x < BURN_W; x++) {
      const u = x / (BURN_W - 1);
      const v = y / (BURN_H - 1);
      const d = Math.min(
        Math.hypot(u, v) * weights[0],
        Math.hypot(1 - u, v) * weights[1],
        Math.hypot(u, 1 - v) * weights[2],
        Math.hypot(1 - u, 1 - v) * weights[3],
      );
      field[y * BURN_W + x] = d + (noise(u, v) - 0.5) * 0.26;
    }
  }
  return field;
}

/** Burn radius (0.03 → 0.63) for the seconds elapsed past the warning threshold. */
export function burnRadius(secondsPastWarning: number): number {
  return 0.03 + Math.min(1, secondsPastWarning / BURN_DURATION) * 0.6;
}

/** Paints glowing embers and a charred rim just outside the burn radius. */
export function paintEmbers(
  data: Uint8ClampedArray,
  field: Float32Array,
  radius: number,
  flick: number,
) {
  for (let i = 0; i < field.length; i++) {
    const e = field[i]! - radius;
    const o = i * 4;
    if (e < 0) continue;
    if (e < 0.02) {
      const k = 1 - e / 0.02;
      const fl = 0.65 + 0.35 * Math.sin(flick + i * 0.37);
      data[o] = 255;
      data[o + 1] = 110 + 120 * k * fl;
      data[o + 2] = 30 * k;
      data[o + 3] = 255 * Math.min(1, 0.5 + k) * fl;
    } else if (e < 0.1) {
      const k = 1 - (e - 0.02) / 0.08;
      data[o] = 38 + 40 * k;
      data[o + 1] = 18 + 10 * k;
      data[o + 2] = 10;
      data[o + 3] = 235 * k * k;
    }
  }
}

/** Alpha mask: fully transparent where the card has burnt away. */
export function paintBurnMask(data: Uint8ClampedArray, field: Float32Array, radius: number) {
  for (let i = 0; i < field.length; i++) {
    const e = field[i]! - radius;
    const o = i * 4;
    data[o] = data[o + 1] = data[o + 2] = 255;
    data[o + 3] = e <= 0 ? 0 : e < 0.012 ? (255 * e) / 0.012 : 255;
  }
}
