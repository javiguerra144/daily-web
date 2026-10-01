import { Kbd } from '@/components/atoms/Kbd/Kbd';
import styles from './KeyHints.module.css';

export function KeyHints() {
  return (
    <p className={styles.hint}>
      <Kbd>Space</Kbd> open / next · <Kbd>P</Kbd> pause · <Kbd>R</Kbd> reroll
    </p>
  );
}
