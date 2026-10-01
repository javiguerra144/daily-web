import { Kbd } from '@/components/atoms/Kbd/Kbd';
import styles from './KeyHints.module.css';

export function KeyHints() {
  return (
    <p className={styles.hint}>
      <Kbd>Espacio</Kbd> abrir / siguiente · <Kbd>P</Kbd> pausa · <Kbd>R</Kbd> reroll
    </p>
  );
}
