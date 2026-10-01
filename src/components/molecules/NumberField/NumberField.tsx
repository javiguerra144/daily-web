import { useId, useState } from 'react';
import { clamp } from '@/utils/format';
import styles from './NumberField.module.css';

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onCommit: (value: number) => void;
}

/** Integer input that commits valid values as you type and normalises on blur. */
export function NumberField({ label, value, min, max, step = 1, onCommit }: NumberFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  const [seen, setSeen] = useState(value);

  if (seen !== value) {
    setSeen(value);
    setDraft(String(value));
  }

  const handleChange = (raw: string) => {
    setDraft(raw);
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n)) onCommit(clamp(n, min, max));
  };

  const normalise = () => {
    const n = clamp(parseInt(draft, 10) || 0, min, max);
    setDraft(String(n));
    onCommit(n);
  };

  return (
    <label className={styles.field} htmlFor={id}>
      {label}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={draft}
        onChange={e => handleChange(e.target.value)}
        onBlur={normalise}
      />
    </label>
  );
}
