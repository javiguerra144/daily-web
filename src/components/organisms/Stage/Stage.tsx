import { useRef, type CSSProperties, type RefObject } from 'react';
import { KeyHints } from '@/components/molecules/KeyHints/KeyHints';
import { PackSprite } from '@/components/organisms/PackSprite/PackSprite';
import { TradingCard } from '@/components/organisms/TradingCard/TradingCard';
import { isCardVisible, isPackVisible } from '@/features/daily/stagePhase';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useShine } from '@/hooks/useShine';
import { useStageScale } from '@/hooks/useStageScale';
import type { Member, Rarity, StagePhase } from '@/types';
import { cx } from '@/utils/cx';
import styles from './Stage.module.css';

interface StageProps {
  phase: StagePhase;
  /** Member whose card is being (or was last) opened. */
  member: Member | undefined;
  index: number;
  total: number;
  turnSeconds: number;
  dateLabel: string;
  packCaption: string;
  packCounter: string;
  rarity: Rarity | null;
  /** Increments each time the pack tears, replaying the flash. */
  flashKey: number;
  burning: boolean;
  warnAt: number;
  leftRef: RefObject<number>;
  /** False while the stage is hidden behind the settings panel. */
  visible: boolean;
  onOpenPack: () => void;
}

export function Stage({
  phase,
  member,
  index,
  total,
  turnSeconds,
  dateLabel,
  packCaption,
  packCounter,
  rarity,
  flashKey,
  burning,
  warnAt,
  leftRef,
  visible,
  onOpenPack,
}: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scale, minHeight } = useStageScale(stageRef, visible);
  const onPointerMove = useShine(cardRef, phase === 'revealed', reducedMotion);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      style={{ minHeight }}
      onPointerMove={onPointerMove}
    >
      <div className={styles.rays} />
      <div className={styles.glow} />
      <div className={styles.inner} style={{ '--scale': scale.toFixed(3) } as CSSProperties}>
        {member && isCardVisible(phase) && (
          <TradingCard
            ref={cardRef}
            member={member}
            index={index}
            total={total}
            turnSeconds={turnSeconds}
            dateLabel={dateLabel}
            phase={phase}
            burning={burning}
            warnAt={warnAt}
            leftRef={leftRef}
          />
        )}
        {isPackVisible(phase) && (
          <PackSprite
            phase={phase}
            caption={packCaption}
            counter={packCounter}
            onOpen={onOpenPack}
          />
        )}
        <div key={flashKey} className={cx(styles.flash, flashKey > 0 && styles.go)} />
        {rarity && phase === 'revealed' && (
          <div className={styles.rarity}>
            {rarity[1]} {rarity[0]}
          </div>
        )}
      </div>
      <KeyHints />
    </div>
  );
}
