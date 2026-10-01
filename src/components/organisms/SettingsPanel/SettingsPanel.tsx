import { Button } from '@/components/atoms/Button/Button';
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox';
import { Panel } from '@/components/atoms/Panel/Panel';
import { SectionLabel } from '@/components/atoms/SectionLabel/SectionLabel';
import { NumberField } from '@/components/molecules/NumberField/NumberField';
import { PresetButtons } from '@/components/molecules/PresetButtons/PresetButtons';
import { TeamMemberRow } from '@/components/molecules/TeamMemberRow/TeamMemberRow';
import { TIME_PRESETS } from '@/constants/defaults';
import type { Member, Settings } from '@/types';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  settings: Settings;
  hidden: boolean;
  onChange: (patch: Partial<Settings>) => void;
  onMemberChange: (id: string, patch: Partial<Member>) => void;
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  settings,
  hidden,
  onChange,
  onMemberChange,
  onAddMember,
  onRemoveMember,
  onResetDefaults,
  onClose,
}: SettingsPanelProps) {
  return (
    <Panel className={styles.settings} hidden={hidden} aria-label="Settings">
      <h2>Set up the stand-up</h2>

      <div>
        <SectionLabel>Time per person</SectionLabel>
        <div className={styles.row}>
          <NumberField
            label="Minutes"
            min={0}
            max={30}
            value={settings.minutes}
            onCommit={minutes => onChange({ minutes })}
          />
          <NumberField
            label="Seconds"
            min={0}
            max={59}
            step={5}
            value={settings.seconds}
            onCommit={seconds => onChange({ seconds })}
          />
          <NumberField
            label="Warning (s)"
            min={0}
            max={600}
            step={5}
            value={settings.warnAt}
            onCommit={warnAt => onChange({ warnAt })}
          />
          <PresetButtons
            presets={TIME_PRESETS}
            onSelect={sec => onChange({ minutes: Math.floor(sec / 60), seconds: sec % 60 })}
          />
        </div>
      </div>

      <div className={styles.row}>
        <Checkbox checked={settings.shuffle} onChange={shuffle => onChange({ shuffle })}>
          Random order every stand-up
        </Checkbox>
        <Checkbox checked={settings.autoNext} onChange={autoNext => onChange({ autoNext })}>
          Move to the next person when time runs out
        </Checkbox>
        <Checkbox checked={settings.sound} onChange={sound => onChange({ sound })}>
          Sound on warning
        </Checkbox>
      </div>

      <div>
        <SectionLabel>Team</SectionLabel>
        <div className={styles.members}>
          {settings.team.map(member => (
            <TeamMemberRow
              key={member.id}
              member={member}
              onChange={patch => onMemberChange(member.id, patch)}
              onRemove={() => onRemoveMember(member.id)}
            />
          ))}
        </div>
        <div className={styles.add}>
          <Button onClick={onAddMember}>+ Add person</Button>
        </div>
        <p className={styles.note}>
          Upload a photo or image for each card; if there isn't one, an illustration is generated
          from the name. Settings are saved in this browser.
        </p>
      </div>

      <div className={styles.foot}>
        <Button variant="ghost" onClick={onResetDefaults}>
          Restore example
        </Button>
        <Button variant="primary" onClick={onClose}>
          Save and go back
        </Button>
      </div>
    </Panel>
  );
}
