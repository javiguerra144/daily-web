import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './SectionLabel.module.css';

export function SectionLabel({
  children,
  flush = false,
}: {
  children: ReactNode;
  /** Removes the bottom margin (for use inside flex headers). */
  flush?: boolean;
}) {
  return <p className={cx(styles.label, flush && styles.flush)}>{children}</p>;
}
