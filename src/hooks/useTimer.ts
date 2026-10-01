import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventCallback } from './useEventCallback';

interface UseTimerOptions {
  /** Seconds left at which `onWarn` fires. */
  warnAt: number;
  onWarn?: () => void;
  /** Fires once when the countdown reaches zero (the timer keeps counting into overtime). */
  onExpire?: () => void;
}

/** Display state is published every 100 ms; `leftRef` always holds the exact value. */
const PUBLISH_STEP = 0.1;

export function useTimer({ warnAt, onWarn, onExpire }: UseTimerOptions) {
  const [left, setLeft] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);

  const leftRef = useRef(0);
  const published = useRef(0);
  const lastFrame = useRef(0);
  const raf = useRef(0);
  const warned = useRef(false);
  const expired = useRef(false);
  const warnAtRef = useRef(warnAt);
  useEffect(() => {
    warnAtRef.current = warnAt;
  }, [warnAt]);

  const handleWarn = useEventCallback(() => onWarn?.());
  const handleExpire = useEventCallback(() => onExpire?.());

  const publish = useCallback((force = false) => {
    if (force || Math.abs(leftRef.current - published.current) >= PUBLISH_STEP) {
      published.current = leftRef.current;
      setLeft(leftRef.current);
    }
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setRunning(false);
  }, []);

  const resume = useCallback(() => {
    cancelAnimationFrame(raf.current);
    lastFrame.current = performance.now();
    setRunning(true);

    const tick = (now: number) => {
      leftRef.current -= (now - lastFrame.current) / 1000;
      lastFrame.current = now;
      if (!warned.current && leftRef.current <= warnAtRef.current && leftRef.current > 0) {
        warned.current = true;
        handleWarn();
      }
      if (!expired.current && leftRef.current <= 0) {
        expired.current = true;
        handleExpire();
      }
      publish();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [handleExpire, handleWarn, publish]);

  /** Sets a fresh countdown without starting it. */
  const reset = useCallback(
    (seconds: number) => {
      stop();
      leftRef.current = seconds;
      warned.current = false;
      expired.current = false;
      setTotal(seconds);
      publish(true);
    },
    [publish, stop],
  );

  const start = useCallback(
    (seconds: number) => {
      reset(seconds);
      resume();
    },
    [reset, resume],
  );

  const addTime = useCallback(
    (seconds: number) => {
      leftRef.current += seconds;
      setTotal(prev => Math.max(prev, leftRef.current));
      if (leftRef.current > 0) expired.current = false;
      if (leftRef.current > warnAtRef.current) warned.current = false;
      publish(true);
    },
    [publish],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { left, total, running, leftRef, start, reset, stop, resume, addTime };
}
