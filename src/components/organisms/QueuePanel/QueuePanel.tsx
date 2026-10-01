import { useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { Panel } from '@/components/atoms/Panel/Panel';
import { SectionLabel } from '@/components/atoms/SectionLabel/SectionLabel';
import { QueueItem } from '@/components/molecules/QueueItem/QueueItem';
import type { SessionState } from '@/features/daily/sessionReducer';
import type { StagePhase } from '@/types';
import { formatTime } from '@/utils/format';
import styles from './QueuePanel.module.css';

interface QueuePanelProps {
  session: SessionState;
  phase: StagePhase;
  turnSeconds: number;
  usedTotal: number;
  spokenCount: number;
  canReroll: boolean;
  /** Changes on every reroll to replay the shuffle animation. */
  rerollNonce: number;
  onReroll: () => void;
}

export function QueuePanel({
  session,
  phase,
  turnSeconds,
  usedTotal,
  spokenCount,
  canReroll,
  rerollNonce,
  onReroll,
}: QueuePanelProps) {
  const { order, idx, current, results, started } = session;
  // The row unmasks as the card flips, a beat before the turn actually starts.
  const activeIdx = current || phase === 'flipping' ? idx : -1;

  const listRef = useRef<HTMLUListElement>(null);
  // Keep the active row visible inside the scrollable list (without scrolling the page).
  useEffect(() => {
    const list = listRef.current;
    const row = list?.children[activeIdx] as HTMLElement | undefined;
    if (!list || !row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop) list.scrollTo({ top, behavior: 'smooth' });
    else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: bottom - list.clientHeight, behavior: 'smooth' });
    }
  }, [activeIdx]);

  return (
    <Panel className={styles.panel}>
      <div className={styles.head}>
        <SectionLabel flush>Today's order</SectionLabel>
        <Button
          size="sm"
          disabled={!canReroll}
          title="Reshuffle those who haven't spoken yet"
          onClick={onReroll}
        >
          🎲 Reroll
        </Button>
      </div>
      <ul key={rerollNonce} ref={listRef} className={styles.queue}>
        {order.length === 0 && (
          <li className={styles.empty}>No people. Open “Team & time” to add some.</li>
        )}
        {order.map((member, i) => {
          const result = results[member.id];
          return (
            <QueueItem
              key={member.id}
              member={member}
              index={i}
              started={started}
              result={result}
              current={i === activeIdx}
              speaking={i === idx && !!current}
              masked={i !== activeIdx && !result}
              shuffling={rerollNonce > 0}
            />
          );
        })}
      </ul>
      {order.length > 0 && (
        <div className={styles.totals}>
          {started ? (
            <>
              <span>
                {spokenCount} of {order.length} spoke
              </span>
              <span>Total {formatTime(usedTotal)}</span>
            </>
          ) : (
            <>
              <span>
                {order.length} {order.length === 1 ? 'person' : 'people'}
              </span>
              <span>≈ {formatTime(order.length * turnSeconds)}</span>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}
