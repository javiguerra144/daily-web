import type { ClockStatus } from '@/types';
import { cx } from '@/utils/cx';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** Filled fraction, 0–1. */
  ratio: number;
  status: ClockStatus;
}

export function ProgressBar({ ratio, status }: ProgressBarProps) {
  return (
    <div
      className={cx(styles.bar, status === 'warn' && styles.warn, status === 'over' && styles.over)}
      aria-hidden="true"
    >
      <i className={styles.fill} style={{ transform: `scaleX(${ratio})` }} />
    </div>
  );
}
