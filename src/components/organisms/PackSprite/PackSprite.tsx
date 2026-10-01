import { packEffect } from '@/features/daily/stagePhase';
import type { StagePhase } from '@/types';
import { cx } from '@/utils/cx';
import styles from './PackSprite.module.css';

interface PackSpriteProps {
  phase: StagePhase;
  /** Line under the logo, e.g. "Turno 2 de 6". */
  caption: string;
  /** Pill at the bottom, e.g. "4 por abrir". */
  counter: string;
  onOpen: () => void;
}

export function PackSprite({ phase, caption, counter, onOpen }: PackSpriteProps) {
  const effect = packEffect(phase);
  return (
    <button
      type="button"
      aria-label="Abrir sobre"
      className={cx(
        styles.pack,
        effect === 'idle' && styles.idle,
        effect === 'enter' && styles.enter,
        effect === 'shake' && styles.shake,
        (effect === 'torn' || effect === 'away') && styles.torn,
        effect === 'away' && styles.away,
      )}
      onClick={onOpen}
    >
      <span className={cx(styles.piece, styles.top)}>
        <span className={cx(styles.crimp, styles.crimpTop)} />
        <span className={styles.tearline} />
      </span>
      <span className={cx(styles.piece, styles.body)}>
        <span className={styles.face}>
          <span className={styles.edition}>Edición sprint</span>
          <span className={styles.logo}>
            DAILY
            <br />
            PACK
          </span>
          <span className={styles.who}>{caption}</span>
          <span className={styles.count}>{counter}</span>
        </span>
        <span className={cx(styles.crimp, styles.crimpBottom)} />
      </span>
    </button>
  );
}
