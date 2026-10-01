import { IconButton } from '@/components/atoms/IconButton/IconButton';
import { formatTime } from '@/utils/format';
import styles from './PresetButtons.module.css';

interface PresetButtonsProps {
  presets: readonly number[];
  onSelect: (seconds: number) => void;
}

export function PresetButtons({ presets, onSelect }: PresetButtonsProps) {
  return (
    <div className={styles.presets}>
      {presets.map(seconds => (
        <IconButton key={seconds} className={styles.preset} onClick={() => onSelect(seconds)}>
          {formatTime(seconds)}
        </IconButton>
      ))}
    </div>
  );
}
