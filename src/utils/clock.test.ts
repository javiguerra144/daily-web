import { barRatio, clockStatus, displaySeconds } from './clock';

describe('clockStatus', () => {
  it('is ok above the warning threshold', () => expect(clockStatus(60, 20)).toBe('ok'));
  it('warns at or below the threshold', () => expect(clockStatus(20, 20)).toBe('warn'));
  it('is over once time is up', () => {
    expect(clockStatus(0, 20)).toBe('over');
    expect(clockStatus(-3, 20)).toBe('over');
  });
});

describe('displaySeconds', () => {
  it('rounds up while counting down', () => expect(displaySeconds(9.1)).toBe(10));
  it('keeps overtime untouched', () => expect(displaySeconds(-2.5)).toBe(-2.5));
});

describe('barRatio', () => {
  it('is proportional to the remaining time', () => expect(barRatio(30, 120)).toBe(0.25));
  it('stays full in overtime', () => expect(barRatio(-1, 120)).toBe(1));
  it('never exceeds 1 after adding time', () => expect(barRatio(150, 120)).toBe(1));
});
