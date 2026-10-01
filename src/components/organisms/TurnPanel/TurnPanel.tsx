import { Panel } from '@/components/atoms/Panel/Panel';
import { ProgressBar } from '@/components/atoms/ProgressBar/ProgressBar';
import { SectionLabel } from '@/components/atoms/SectionLabel/SectionLabel';
import { TimeDisplay } from '@/components/atoms/TimeDisplay/TimeDisplay';
import { TimerControls } from '@/components/molecules/TimerControls/TimerControls';
import type { ClockStatus } from '@/types';
import styles from './TurnPanel.module.css';

interface TurnPanelProps {
  speaker: string;
  turnLabel: string;
  clockText: string;
  clockStatus: ClockStatus;
  barRatio: number;
  controls: Parameters<typeof TimerControls>[0];
}

export function TurnPanel({
  speaker,
  turnLabel,
  clockText,
  clockStatus,
  barRatio,
  controls,
}: TurnPanelProps) {
  return (
    <Panel className={styles.clock}>
      <SectionLabel>Turn</SectionLabel>
      <div className={styles.now}>
        <strong>{speaker}</strong>
        <span className={styles.status}>{turnLabel}</span>
      </div>
      <TimeDisplay text={clockText} status={clockStatus} />
      <ProgressBar ratio={barRatio} status={clockStatus} />
      <TimerControls {...controls} />
    </Panel>
  );
}
