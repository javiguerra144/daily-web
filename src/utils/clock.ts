import type { ClockStatus } from '@/types';
import { clamp } from './format';

export function clockStatus(left: number, warnAt: number): ClockStatus {
  if (left <= 0) return 'over';
  if (left <= warnAt) return 'warn';
  return 'ok';
}

/** Value shown on the big clock: whole seconds rounded up while counting down. */
export function displaySeconds(left: number): number {
  return left > 0 ? Math.ceil(left) : left;
}

/** Fraction of the progress bar still filled; stays full while in overtime. */
export function barRatio(left: number, total: number): number {
  if (left <= 0) return 1;
  return total > 0 ? clamp(left / total, 0, 1) : 0;
}
