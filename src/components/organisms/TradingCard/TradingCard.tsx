import { useRef, type CSSProperties, type RefObject } from 'react';
import { DEFAULT_ROLE_COLOR, ROLE_COLORS, ROLE_TYPES } from '@/constants/roles';
import { isCardFlipped, isCardInFront, isCardRisen } from '@/features/daily/stagePhase';
import { useBurn } from '@/hooks/useBurn';
import type { Member, StagePhase } from '@/types';
import { imageFor } from '@/utils/art';
import { BURN_H, BURN_W } from '@/utils/burn';
import { cx } from '@/utils/cx';
import { pad2 } from '@/utils/format';
import styles from './TradingCard.module.css';

interface TradingCardProps {
  member: Member;
  /** Zero-based position in the speaking order. */
  index: number;
  total: number;
  /** Seconds allotted per turn, printed as the card's "HP". */
  turnSeconds: number;
  dateLabel: string;
  phase: StagePhase;
  /** The card burns away once the warning threshold is crossed. */
  burning: boolean;
  warnAt: number;
  leftRef: RefObject<number>;
  ref: RefObject<HTMLDivElement | null>;
}

export function TradingCard({
  member,
  index,
  total,
  turnSeconds,
  dateLabel,
  phase,
  burning,
  warnAt,
  leftRef,
  ref,
}: TradingCardProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useBurn({ enabled: burning, warnAt, leftRef, cardRef: frontRef, canvasRef });

  const hue = ROLE_COLORS[member.role] ?? DEFAULT_ROLE_COLOR;

  return (
    <div
      ref={ref}
      className={cx(
        styles.card,
        isCardRisen(phase) && styles.rise,
        isCardInFront(phase) && styles.frontZ,
        isCardFlipped(phase) && styles.flipped,
        phase === 'revealed' && styles.live,
      )}
    >
      <div className={styles.inner}>
        <div className={cx(styles.face, styles.back)}>
          <span>DAILY</span>
        </div>
        <div
          ref={frontRef}
          className={cx(styles.face, styles.front)}
          style={{ '--hue': hue } as CSSProperties}
        >
          <div className={styles.frontIn}>
            <div className={styles.top}>
              <span className={styles.name}>{member.name}</span>
              <span className={styles.hp}>
                TIEMPO <b>{turnSeconds}</b>
              </span>
            </div>
            <div className={styles.art}>
              <img alt={`Imagen de ${member.name}`} src={imageFor(member)} />
            </div>
            <div className={styles.type}>
              {ROLE_TYPES[member.role] ?? 'Tipo Equipo'} · {member.role}
            </div>
            <div className={styles.foot}>
              <span>
                {pad2(index + 1)}/{pad2(total)}
              </span>
              <span>{dateLabel}</span>
            </div>
          </div>
          <div className={styles.glare} />
          <canvas
            ref={canvasRef}
            className={styles.burn}
            width={BURN_W}
            height={BURN_H}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
