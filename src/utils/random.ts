import type { Rarity } from '@/types';

/** FNV-1a string hash. */
export function hash(str: string): number {
  let h = 2166136261;
  for (const c of str) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 seeded PRNG returning floats in [0, 1). */
export function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

/** Shuffles trying (a few times) to return an order different from the input. */
export function shuffledDifferent<T>(items: readonly T[], random: () => number = Math.random): T[] {
  let next = shuffled(items, random);
  for (let k = 0; k < 5 && next.every((m, i) => m === items[i]); k++) {
    next = shuffled(items, random);
  }
  return next;
}

export function pickRarity(rarities: readonly Rarity[], roll: number): Rarity {
  let acc = 0;
  for (const rarity of rarities) {
    acc += rarity[2];
    if (roll <= acc) return rarity;
  }
  return rarities[0] as Rarity;
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 8);
}
