import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import styles from './IconButton.module.css';

export function IconButton({
  type = 'button',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cx(styles.iconBtn, className)} {...rest} />;
}
