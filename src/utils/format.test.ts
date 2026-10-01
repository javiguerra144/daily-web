import { clamp, formatTime, pad2 } from './format';

describe('formatTime', () => {
  it('formats minutes and zero-padded seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(120)).toBe('2:00');
  });

  it('prefixes overtime with a plus sign', () => {
    expect(formatTime(-5)).toBe('+0:05');
    expect(formatTime(-61)).toBe('+1:01');
  });

  it('rounds to the nearest second', () => {
    expect(formatTime(59.6)).toBe('1:00');
  });
});

describe('pad2', () => {
  it('pads single digits', () => {
    expect(pad2(3)).toBe('03');
    expect(pad2(12)).toBe('12');
  });
});

describe('clamp', () => {
  it('keeps values inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});
