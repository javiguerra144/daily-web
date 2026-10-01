import { useState } from 'react';
import styles from './App.module.css';
import { AppHeader } from '@/components/organisms/AppHeader/AppHeader';
import { QueuePanel } from '@/components/organisms/QueuePanel/QueuePanel';
import { SettingsPanel } from '@/components/organisms/SettingsPanel/SettingsPanel';
import { Stage } from '@/components/organisms/Stage/Stage';
import { TurnPanel } from '@/components/organisms/TurnPanel/TurnPanel';
import { isMainDisabled, mainButtonLabel, remainingTurns } from '@/features/daily/sessionReducer';
import { useDaily } from '@/features/daily/useDaily';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSettings } from '@/hooks/useSettings';
import { barRatio, clockStatus, displaySeconds } from '@/utils/clock';
import { formatTime, formatToday } from '@/utils/format';

function describeSpeaker(started: boolean, ended: boolean, current: string | undefined) {
  if (current) return current;
  if (ended) return 'Todos han pasado';
  return started ? 'Abriendo sobre…' : 'Nadie todavía';
}

function describePack(
  { started, ended, idx, order }: ReturnType<typeof useDaily>['session'],
  hasTeam: boolean,
) {
  if (ended) return { caption: '¡Daily terminada!', counter: 'Buen día' };
  if (started) {
    return {
      caption: `Turno ${idx + 1} de ${order.length}`,
      counter: `${order.length - idx} por abrir`,
    };
  }
  return {
    caption: hasTeam ? 'Pulsa para empezar' : 'Añade al equipo en ajustes',
    counter: `${order.length} ${order.length === 1 ? 'carta' : 'cartas'}`,
  };
}

export function App() {
  const { settings, update, updateMember, addMember, removeMember, resetToDefaults } =
    useSettings();
  const daily = useDaily(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [today] = useState(() => formatToday());

  const { session, phase, timer, actions } = daily;
  const { started, ended, current, order, idx, results } = session;
  const turnActive = current !== null;

  useKeyboardShortcuts(!settingsOpen, {
    onSpace: actions.main,
    onReroll: actions.reroll,
    onPause: actions.togglePause,
  });

  const clockText = ended ? formatTime(daily.usedTotal) : formatTime(displaySeconds(timer.left));
  const status = ended ? 'ok' : clockStatus(timer.left, settings.warnAt);
  const pack = describePack(session, settings.team.length > 0);

  const closeSettings = () => {
    setSettingsOpen(false);
    actions.syncTeam();
  };

  return (
    <div className={styles.wrap}>
      <AppHeader edition={today} onOpenSettings={() => setSettingsOpen(true)} />

      <SettingsPanel
        hidden={!settingsOpen}
        settings={settings}
        onChange={update}
        onMemberChange={updateMember}
        onAddMember={addMember}
        onRemoveMember={removeMember}
        onResetDefaults={() => actions.restart(resetToDefaults())}
        onClose={closeSettings}
      />

      <main className={styles.table} hidden={settingsOpen}>
        <Stage
          visible={!settingsOpen}
          phase={phase}
          member={order[idx]}
          index={idx}
          total={order.length}
          turnSeconds={daily.turnSeconds}
          dateLabel={today}
          packCaption={pack.caption}
          packCounter={pack.counter}
          rarity={daily.rarity}
          flashKey={daily.flashKey}
          burning={phase === 'revealed' && turnActive}
          warnAt={settings.warnAt}
          leftRef={timer.leftRef}
          onOpenPack={actions.main}
        />

        <aside className={styles.side}>
          <TurnPanel
            speaker={describeSpeaker(started, ended, current?.name)}
            turnLabel={current ? `${idx + 1} / ${order.length}` : ''}
            clockText={clockText}
            clockStatus={status}
            barRatio={ended ? 0 : barRatio(timer.left, timer.total)}
            controls={{
              mainLabel: mainButtonLabel(session),
              mainDisabled: isMainDisabled(session),
              turnActive,
              running: timer.running,
              onMain: actions.main,
              onPause: actions.togglePause,
              onAddTime: actions.addTime,
              onSkip: actions.skip,
              onRestart: () => actions.restart(),
            }}
          />
          <QueuePanel
            session={session}
            phase={phase}
            turnSeconds={daily.turnSeconds}
            usedTotal={daily.usedTotal}
            spokenCount={Object.values(results).filter(r => !r.absent).length}
            canReroll={!session.busy && remainingTurns(session) >= 2}
            rerollNonce={daily.rerollNonce}
            onReroll={actions.reroll}
          />
        </aside>
      </main>
    </div>
  );
}
