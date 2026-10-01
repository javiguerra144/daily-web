import { act, renderHook } from '@testing-library/react';
import { useTimer } from './useTimer';

const advance = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });
  afterEach(() => vi.useRealTimers());

  it('counts down once started', async () => {
    const { result } = renderHook(() => useTimer({ warnAt: 5 }));
    act(() => result.current.start(30));
    await advance(10_000);
    expect(result.current.running).toBe(true);
    expect(result.current.left).toBeCloseTo(20, 0);
  });

  it('fires onWarn once when crossing the threshold', async () => {
    const onWarn = vi.fn();
    const { result } = renderHook(() => useTimer({ warnAt: 5, onWarn }));
    act(() => result.current.start(10));
    await advance(7000);
    expect(onWarn).toHaveBeenCalledTimes(1);
  });

  it('fires onExpire once and keeps counting into overtime', async () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useTimer({ warnAt: 2, onExpire }));
    act(() => result.current.start(3));
    await advance(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(result.current.left).toBeLessThan(0);
  });

  it('stops and resumes without losing time', async () => {
    const { result } = renderHook(() => useTimer({ warnAt: 5 }));
    act(() => result.current.start(30));
    await advance(5000);
    act(() => result.current.stop());
    const frozen = result.current.leftRef.current;
    await advance(5000);
    expect(result.current.leftRef.current).toBe(frozen);

    act(() => result.current.resume());
    await advance(1000);
    expect(result.current.leftRef.current).toBeLessThan(frozen);
  });

  it('extends the countdown and re-arms the alerts', async () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useTimer({ warnAt: 2, onExpire }));
    act(() => result.current.start(3));
    await advance(4000);
    act(() => result.current.addTime(30));
    expect(result.current.left).toBeGreaterThan(25);
    expect(result.current.total).toBeGreaterThanOrEqual(result.current.left);
    await advance(40_000);
    expect(onExpire).toHaveBeenCalledTimes(2);
  });

  it('resets to a fresh stopped countdown', () => {
    const { result } = renderHook(() => useTimer({ warnAt: 5 }));
    act(() => result.current.start(30));
    act(() => result.current.reset(60));
    expect(result.current).toMatchObject({ left: 60, total: 60, running: false });
  });
});
