import { BURN_H, BURN_W, burnRadius, makeBurnField, paintBurnMask, paintEmbers } from './burn';
import { seededRandom } from './random';

describe('burnRadius', () => {
  it('starts small and caps at 0.63', () => {
    expect(burnRadius(0)).toBeCloseTo(0.03);
    expect(burnRadius(150)).toBeCloseTo(0.33);
    expect(burnRadius(10_000)).toBeCloseTo(0.63);
  });
});

describe('makeBurnField', () => {
  const field = makeBurnField(seededRandom(7));

  it('covers the whole grid', () => expect(field).toHaveLength(BURN_W * BURN_H));

  it('is lowest near the corners', () => {
    const corner = field[0]!;
    const centre = field[Math.floor(BURN_H / 2) * BURN_W + Math.floor(BURN_W / 2)]!;
    expect(corner).toBeLessThan(centre);
  });
});

describe('burn painting', () => {
  const field = makeBurnField(seededRandom(7));

  it('makes burnt pixels fully transparent in the mask', () => {
    const data = new Uint8ClampedArray(field.length * 4);
    paintBurnMask(data, field, 0.3);
    const burntIndex = field.findIndex(v => v - 0.3 <= 0);
    const intactIndex = field.findIndex(v => v - 0.3 > 0.012);
    expect(data[burntIndex * 4 + 3]).toBe(0);
    expect(data[intactIndex * 4 + 3]).toBe(255);
  });

  it('draws embers only outside the burn radius', () => {
    const data = new Uint8ClampedArray(field.length * 4);
    paintEmbers(data, field, 0.3, 0);
    const burntIndex = field.findIndex(v => v - 0.3 < 0);
    expect(data[burntIndex * 4 + 3]).toBe(0);
    expect(data.some((v, i) => i % 4 === 3 && v > 0)).toBe(true);
  });
});
