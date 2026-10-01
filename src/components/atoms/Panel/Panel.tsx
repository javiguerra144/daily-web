import type { HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import styles from './Panel.module.css';

export function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.panel, className)} {...rest} />;
}
