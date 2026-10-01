import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'md' | 'sm';
}

export function Button({
  variant = 'default',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        styles.btn,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        size === 'sm' && styles.sm,
        className,
      )}
      {...rest}
    />
  );
}
