import type { Member, TurnResult } from '@/types';

export interface SessionState {
  started: boolean;
  ended: boolean;
  /** Speaking order. */
  order: Member[];
  /** Index in `order` of the current (or last opened) turn; -1 before the first. */
  idx: number;
  current: Member | null;
  results: Record<string, TurnResult>;
  /** True while the pack-opening animation runs. */
  busy: boolean;
}

export type SessionAction =
  | { type: 'reset'; order: Member[] }
  | { type: 'open'; started?: boolean }
  | { type: 'reveal' }
  | { type: 'finish'; result: TurnResult }
  | { type: 'end' }
  | { type: 'reroll'; order: Member[] }
  | { type: 'syncMembers'; team: Member[] };

export function createSession(order: Member[]): SessionState {
  return { started: false, ended: false, order, idx: -1, current: null, results: {}, busy: false };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'reset':
      return createSession(action.order);
    case 'open':
      return { ...state, started: true, busy: true, idx: state.idx + 1 };
    case 'reveal':
      return { ...state, busy: false, current: state.order[state.idx] ?? null };
    case 'finish': {
      if (!state.current) return state;
      return {
        ...state,
        current: null,
        results: { ...state.results, [state.current.id]: action.result },
      };
    }
    case 'end':
      return { ...state, ended: true };
    case 'reroll':
      return { ...state, order: action.order };
    case 'syncMembers': {
      const byId = new Map(action.team.map(m => [m.id, m]));
      const sync = (m: Member) => byId.get(m.id) ?? m;
      return {
        ...state,
        order: state.order.map(sync),
        current: state.current && sync(state.current),
      };
    }
  }
}

export function remainingTurns(state: SessionState): number {
  return state.order.length - (state.idx + 1);
}

/** Order after `idx` reshuffled with `shuffle`; null if fewer than two people are left. */
export function rerolledOrder(
  state: SessionState,
  shuffle: (rest: Member[]) => Member[],
): Member[] | null {
  const from = state.idx + 1;
  const rest = state.order.slice(from);
  if (rest.length < 2) return null;
  return state.order.slice(0, from).concat(shuffle(rest));
}

export function totalUsed(results: SessionState['results']): number {
  return Object.values(results).reduce((acc, r) => (r.absent ? acc : acc + r.used), 0);
}

export function mainButtonLabel(state: SessionState): string {
  if (!state.started) return 'Start stand-up';
  if (state.current) return remainingTurns(state) > 0 ? 'Next pack' : 'Finish stand-up';
  if (remainingTurns(state) > 0) return 'Open pack';
  return 'Stand-up done';
}

export function isMainDisabled(state: SessionState): boolean {
  return (
    state.busy ||
    state.order.length === 0 ||
    (state.started && !state.current && remainingTurns(state) <= 0)
  );
}
