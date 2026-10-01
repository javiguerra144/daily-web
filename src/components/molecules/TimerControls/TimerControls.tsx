import { Button } from '@/components/atoms/Button/Button';
import { EXTRA_TIME_SECONDS } from '@/constants/defaults';
import styles from './TimerControls.module.css';

interface TimerControlsProps {
  mainLabel: string;
  mainDisabled: boolean;
  /** True while a turn is active (enables pause / extra time / skip). */
  turnActive: boolean;
  running: boolean;
  onMain: () => void;
  onPause: () => void;
  onAddTime: () => void;
  onSkip: () => void;
  onRestart: () => void;
}

export function TimerControls({
  mainLabel,
  mainDisabled,
  turnActive,
  running,
  onMain,
  onPause,
  onAddTime,
  onSkip,
  onRestart,
}: TimerControlsProps) {
  return (
    <div className={styles.controls}>
      <Button variant="primary" className={styles.main} disabled={mainDisabled} onClick={onMain}>
        {mainLabel}
      </Button>
      <Button disabled={!turnActive} onClick={onPause}>
        {running || !turnActive ? 'Pausa' : 'Seguir'}
      </Button>
      <Button disabled={!turnActive} onClick={onAddTime}>
        +{EXTRA_TIME_SECONDS} s
      </Button>
      <Button disabled={!turnActive} onClick={onSkip}>
        Ausente
      </Button>
      <Button variant="ghost" onClick={onRestart}>
        Reiniciar
      </Button>
    </div>
  );
}
