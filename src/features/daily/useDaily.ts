import { useEffect, useReducer, useRef, useState } from 'react';
import { MIN_TURN_SECONDS, EXTRA_TIME_SECONDS, RARITIES } from '@/constants/defaults';
import { useEventCallback } from '@/hooks/useEventCallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTimer } from '@/hooks/useTimer';
import { beep, requestWakeLock, sparkle } from '@/services/audio';
import type { Rarity, Settings, StagePhase, TurnResult } from '@/types';
import { pickRarity, shuffled, shuffledDifferent } from '@/utils/random';
import {
  createSession,
  remainingTurns,
  rerolledOrder,
  sessionReducer,
  totalUsed,
} from './sessionReducer';

const initialOrder = (s: Settings) => (s.shuffle ? shuffled(s.team) : s.team.slice());

/** Seconds each person gets, never below a sane minimum. */
export const turnLength = (s: Pick<Settings, 'minutes' | 'seconds'>) =>
  Math.max(MIN_TURN_SECONDS, (+s.minutes || 0) * 60 + (+s.seconds || 0));

/**
 * Runs a daily: owns the session (order, results), the countdown timer and the sequencing of
 * the pack-opening animation, and exposes intent-level actions for the UI.
 */
export function useDaily(settings: Settings) {
  const reducedMotion = useReducedMotion();
  const [session, dispatch] = useReducer(sessionReducer, settings, s =>
    createSession(initialOrder(s)),
  );
  const [phase, setPhase] = useState<StagePhase>('idle');
  const [rarity, setRarity] = useState<Rarity | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const [rerollNonce, setRerollNonce] = useState(0);
  /** Bumped to abandon an in-flight opening animation (restart / unmount). */
  const generation = useRef(0);

  const turnSeconds = turnLength(settings);
  const play = (frequency: number, duration: number) => settings.sound && beep(frequency, duration);

  const timer = useTimer({
    warnAt: settings.warnAt,
    onWarn: () => play(660, 0.12),
    onExpire: () => {
      play(440, 0.18);
      setTimeout(() => play(440, 0.18), 260);
      if (settings.autoNext) main();
    },
  });

  const finishTurn = (absent: boolean) => {
    if (!session.current) return;
    timer.stop();
    const result: TurnResult = absent
      ? { absent: true }
      : { used: timer.total - timer.leftRef.current, limit: timer.total };
    dispatch({ type: 'finish', result });
  };

  const showEnd = () => {
    setPhase('ended');
    dispatch({ type: 'end' });
  };

  const openNext = async () => {
    const gen = ++generation.current;
    /** Moves the animation forward; false means it was abandoned meanwhile. */
    const step = async (next: StagePhase, ms: number) => {
      setPhase(next);
      await new Promise(resolve => setTimeout(resolve, reducedMotion ? 0 : ms));
      return gen === generation.current;
    };

    dispatch({ type: 'open' });
    setRarity(pickRarity(RARITIES, Math.random()));

    if (!(await step('entering', 460))) return;
    if (!(await step('shaking', 520))) return;
    setFlashKey(k => k + 1);
    play(300, 0.08);
    if (!(await step('tearing', 300))) return;
    if (!(await step('rising', 560))) return;
    if (!(await step('leaving', 380))) return;
    if (!(await step('lowering', 320))) return;
    if (settings.sound) sparkle();
    if (!(await step('flipping', 800))) return;

    timer.start(turnSeconds);
    dispatch({ type: 'reveal' });
    setPhase('revealed');
  };

  const main = useEventCallback(() => {
    if (session.busy || session.ended || session.order.length === 0) return;
    if (!session.started) {
      requestWakeLock();
      void openNext();
      return;
    }
    finishTurn(false);
    if (remainingTurns(session) > 0) void openNext();
    else showEnd();
  });

  const skip = () => {
    if (!session.current) return;
    finishTurn(true);
    if (remainingTurns(session) > 0) void openNext();
    else showEnd();
  };

  const restart = useEventCallback((next: Settings = settings) => {
    generation.current++;
    timer.reset(turnLength(next));
    dispatch({ type: 'reset', order: initialOrder(next) });
    setPhase('idle');
    setRarity(null);
  });

  const reroll = () => {
    if (session.busy) return;
    const order = rerolledOrder(session, shuffledDifferent);
    if (!order) return;
    dispatch({ type: 'reroll', order });
    setRerollNonce(n => n + 1);
    play(520, 0.06);
  };

  const togglePause = () => {
    if (!session.current) return;
    if (timer.running) timer.stop();
    else timer.resume();
  };

  const addTime = () => timer.addTime(EXTRA_TIME_SECONDS);

  /** Applies edited settings: refreshes members of a running daily, or restarts an idle one. */
  const syncTeam = () => {
    if (session.started) dispatch({ type: 'syncMembers', team: settings.team });
    else restart();
  };

  // Keep the idle clock in sync with the configured turn length.
  const resetClock = useEventCallback(() => {
    if (!session.current) timer.reset(turnSeconds);
  });
  useEffect(() => resetClock(), [turnSeconds, resetClock]);

  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );

  return {
    session,
    phase,
    rarity,
    flashKey,
    rerollNonce,
    turnSeconds,
    timer,
    usedTotal: totalUsed(session.results),
    actions: {
      main,
      skip,
      restart,
      reroll,
      togglePause,
      addTime,
      syncTeam,
    },
  };
}
