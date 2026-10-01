import { Button } from '@/components/atoms/Button/Button';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  edition: string;
  onOpenSettings: () => void;
}

export function AppHeader({ edition, onOpenSettings }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1>Daily Pack</h1>
        <small>Edición {edition}</small>
      </div>
      <Button variant="ghost" onClick={onOpenSettings}>
        ⚙ Equipo y tiempo
      </Button>
    </header>
  );
}
