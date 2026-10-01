import type { ClockStatus } from '@/types';
import { cx } from '@/utils/cx';
import styles from './TimeDisplay.module.css';

interface TimeDisplayProps {
  text: string;
  status: ClockStatus;
}

export function TimeDisplay({ text, status }: TimeDisplayProps) {
  return (
    <div
      className={cx(
        styles.time,
        status === 'warn' && styles.warn,
        status === 'over' && styles.over,
      )}
      role="timer"
    >
      {text}
    </div>
  );
}
