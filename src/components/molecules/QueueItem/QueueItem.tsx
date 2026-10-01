import type { CSSProperties } from 'react';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Pill } from '@/components/atoms/Pill/Pill';
import type { Member, TurnResult } from '@/types';
import { imageFor } from '@/utils/art';
import { cx } from '@/utils/cx';
import { formatTime } from '@/utils/format';
import styles from './QueueItem.module.css';

const SKELETON_WIDTHS = [46, 62, 54, 70, 50, 66];

interface QueueItemProps {
  member: Member;
  index: number;
  /** Highlighted as the person whose turn it is. */
  current: boolean;
  /** Currently holding the floor (timer running). */
  speaking: boolean;
  /** Identity stays hidden until the pack is opened. */
  masked: boolean;
  started: boolean;
  /** Plays the reroll entrance animation (only for people still waiting). */
  shuffling?: boolean;
  result?: TurnResult;
}

function Status({
  result,
  speaking,
  started,
}: Pick<QueueItemProps, 'result' | 'speaking' | 'started'>) {
  if (result?.absent) return <Pill>Ausente</Pill>;
  if (result) {
    return (
      <span className={cx(styles.time, result.used > result.limit ? styles.over : styles.ok)}>
        {formatTime(result.used)}
      </span>
    );
  }
  if (speaking) return <Pill>Hablando</Pill>;
  return <span className={styles.time}>{started ? 'en cola' : ''}</span>;
}

export function QueueItem({
  member,
  index,
  current,
  speaking,
  masked,
  started,
  shuffling = false,
  result,
}: QueueItemProps) {
  const skeletonWidth = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];
  return (
    <li
      className={cx(
        styles.item,
        current && styles.current,
        !!result && styles.done,
        masked && styles.masked,
        masked && shuffling && styles.shuffle,
      )}
    >
      <span className={styles.avatarWrap}>
        <span className={cx(styles.reveal, styles.avatarReveal)}>
          <Avatar src={imageFor(member)} shape="portrait" />
        </span>
        <i className={cx(styles.skeleton, styles.skeletonAvatar)} />
      </span>
      <span className={styles.nameWrap}>
        <span className={cx(styles.name, styles.reveal)}>{member.name}</span>
        <i
          className={cx(styles.skeleton, styles.skeletonName)}
          style={{ '--w': `${skeletonWidth}%` } as CSSProperties}
        />
      </span>
      <Status result={result} speaking={speaking} started={started} />
    </li>
  );
}
