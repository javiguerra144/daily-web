import type { Ref } from 'react';
import { cx } from '@/utils/cx';
import styles from './Avatar.module.css';

interface AvatarProps {
  src: string;
  alt?: string;
  /** `portrait` is the 4:5 queue thumbnail, `square` the settings thumbnail. */
  shape?: 'portrait' | 'square';
  ref?: Ref<HTMLImageElement>;
}

export function Avatar({ src, alt = '', shape = 'square', ref }: AvatarProps) {
  return (
    <img
      ref={ref}
      className={cx(styles.avatar, shape === 'portrait' ? styles.portrait : styles.square)}
      alt={alt}
      src={src}
    />
  );
}
