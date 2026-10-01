import { DEFAULT_SETTINGS } from '@/constants/defaults';
import {
  createSession,
  isMainDisabled,
  mainButtonLabel,
  remainingTurns,
  rerolledOrder,
  sessionReducer,
  totalUsed,
  type SessionState,
} from './sessionReducer';

const team = DEFAULT_SETTINGS.team;
const fresh = () => createSession(team.slice());
const [first, second, third] = team;

function reveal(state: SessionState): SessionState {
  return sessionReducer(sessionReducer(state, { type: 'open' }), { type: 'reveal' });
}

describe('sessionReducer', () => {
  it('opens the first turn and reveals the speaker', () => {
    const opening = sessionReducer(fresh(), { type: 'open' });
    expect(opening).toMatchObject({ started: true, busy: true, idx: 0, current: null });

    const revealed = sessionReducer(opening, { type: 'reveal' });
    expect(revealed).toMatchObject({ busy: false, current: first });
  });

  it('records the result of a finished turn', () => {
    const state = sessionReducer(reveal(fresh()), {
      type: 'finish',
      result: { used: 90, limit: 120 },
    });
    expect(state.current).toBeNull();
    expect(state.results[first!.id]).toEqual({ used: 90, limit: 120 });
  });

  it('ignores finish when nobody is speaking', () => {
    const state = fresh();
    expect(sessionReducer(state, { type: 'finish', result: { absent: true } })).toBe(state);
  });

  it('replaces the order on reroll', () => {
    const order = team.slice().reverse();
    expect(sessionReducer(fresh(), { type: 'reroll', order }).order).toEqual(order);
  });

  it('swaps in updated members by id', () => {
    const started = reveal(fresh());
    const renamed = team.map(m => (m.id === first!.id ? { ...m, name: 'Nuevo' } : m));
    const synced = sessionReducer(started, { type: 'syncMembers', team: renamed });
    expect(synced.order[0]?.name).toBe('Nuevo');
    expect(synced.current?.name).toBe('Nuevo');
  });

  it('keeps members that were removed from the team', () => {
    const started = reveal(fresh());
    const synced = sessionReducer(started, { type: 'syncMembers', team: [] });
    expect(synced.order).toHaveLength(team.length);
  });

  it('marks the daily as ended', () => {
    expect(sessionReducer(fresh(), { type: 'end' }).ended).toBe(true);
  });

  it('resets to a fresh session', () => {
    const state = sessionReducer(reveal(fresh()), { type: 'reset', order: [second!] });
    expect(state).toEqual(createSession([second!]));
  });
});

describe('selectors', () => {
  it('counts remaining turns', () => {
    expect(remainingTurns(fresh())).toBe(team.length);
    expect(remainingTurns(reveal(fresh()))).toBe(team.length - 1);
  });

  it('labels the main button through the daily lifecycle', () => {
    const start = fresh();
    expect(mainButtonLabel(start)).toBe('Start stand-up');
    expect(mainButtonLabel(reveal(start))).toBe('Next pack');

    const last = reveal(createSession([first!]));
    expect(mainButtonLabel(last)).toBe('Finish stand-up');

    const done = sessionReducer(last, { type: 'finish', result: { absent: true } });
    expect(mainButtonLabel(done)).toBe('Stand-up done');
  });

  it('disables the main button while busy or when there is nobody', () => {
    expect(isMainDisabled(fresh())).toBe(false);
    expect(isMainDisabled(sessionReducer(fresh(), { type: 'open' }))).toBe(true);
    expect(isMainDisabled(createSession([]))).toBe(true);
  });

  it('only reshuffles people who have not spoken', () => {
    const state = reveal(fresh());
    const order = rerolledOrder(state, rest => rest.slice().reverse());
    expect(order?.[0]).toBe(first);
    expect(order?.slice(1)).toEqual(team.slice(1).reverse());
  });

  it('does not reroll with fewer than two people left', () => {
    let state = fresh();
    for (let i = 0; i < team.length - 1; i++) state = reveal(state);
    expect(rerolledOrder(state, r => r)).toBeNull();
  });

  it('sums time ignoring absences', () => {
    expect(
      totalUsed({
        [first!.id]: { used: 60, limit: 120 },
        [second!.id]: { absent: true },
        [third!.id]: { used: 30, limit: 120 },
      }),
    ).toBe(90);
  });
});
