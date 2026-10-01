export type Role =
  'Frontend' | 'Backend' | 'QA' | 'Design' | 'Product' | 'Data' | 'DevOps' | 'Scrum';

export interface Member {
  id: string;
  name: string;
  role: Role;
  /** Data URL of the uploaded picture; empty when the art is generated. */
  img: string;
}

export interface Settings {
  minutes: number;
  seconds: number;
  /** Seconds left at which the warning starts. */
  warnAt: number;
  shuffle: boolean;
  autoNext: boolean;
  sound: boolean;
  team: Member[];
}

export type TurnResult = { absent: true } | { absent?: false; used: number; limit: number };

export type Rarity = readonly [label: string, symbol: string, probability: number];

/** Steps of the pack-opening animation, in order. */
export type StagePhase =
  | 'idle'
  | 'entering'
  | 'shaking'
  | 'tearing'
  | 'rising'
  | 'leaving'
  | 'lowering'
  | 'flipping'
  | 'revealed'
  | 'ended';

export type ClockStatus = 'ok' | 'warn' | 'over';
