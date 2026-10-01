import { RARITIES } from '@/constants/defaults';
import { hash, pickRarity, seededRandom, shuffled, shuffledDifferent } from './random';

describe('seededRandom', () => {
  it('is deterministic for a given seed', () => {
    const a = seededRandom(hash('Lucía|Frontend'));
    const b = seededRandom(hash('Lucía|Frontend'));
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('returns values in [0, 1)', () => {
    const r = seededRandom(42);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('shuffled', () => {
  it('returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffled(input, seededRandom(1));
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual(input);
  });
});

describe('shuffledDifferent', () => {
  it('retries when the shuffle leaves the order untouched', () => {
    const input = [1, 2, 3];
    // 0.999 keeps every element in place; the retry draws 0 and rotates them.
    const values = [0.999, 0.999, 0, 0];
    const random = () => values.shift() ?? 0;
    expect(shuffledDifferent(input, random)).not.toEqual(input);
  });
});

describe('pickRarity', () => {
  it('maps the roll onto cumulative probabilities', () => {
    expect(pickRarity(RARITIES, 0.1)[0]).toBe('Common');
    expect(pickRarity(RARITIES, 0.65)[0]).toBe('Common');
    expect(pickRarity(RARITIES, 0.9)[0]).toBe('Uncommon');
  });
});
