import type { StagePhase } from '@/types';

const CARD_VISIBLE: StagePhase[] = [
  'shaking',
  'tearing',
  'rising',
  'leaving',
  'lowering',
  'flipping',
  'revealed',
];
const CARD_RISEN: StagePhase[] = ['rising', 'leaving'];
const CARD_IN_FRONT: StagePhase[] = ['leaving', 'lowering', 'flipping', 'revealed'];
const CARD_FLIPPED: StagePhase[] = ['flipping', 'revealed'];

export type PackEffect = 'idle' | 'enter' | 'shake' | 'torn' | 'away';

const PACK_EFFECT: Record<StagePhase, PackEffect> = {
  idle: 'idle',
  entering: 'enter',
  shaking: 'shake',
  tearing: 'torn',
  rising: 'torn',
  leaving: 'away',
  lowering: 'away',
  flipping: 'away',
  revealed: 'away',
  ended: 'enter',
};

export const isCardVisible = (phase: StagePhase) => CARD_VISIBLE.includes(phase);
export const isCardRisen = (phase: StagePhase) => CARD_RISEN.includes(phase);
export const isCardInFront = (phase: StagePhase) => CARD_IN_FRONT.includes(phase);
export const isCardFlipped = (phase: StagePhase) => CARD_FLIPPED.includes(phase);
export const isPackVisible = (phase: StagePhase) => phase !== 'revealed';
export const packEffect = (phase: StagePhase): PackEffect => PACK_EFFECT[phase];
