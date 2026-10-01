import { useId } from 'react';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { IconButton } from '@/components/atoms/IconButton/IconButton';
import { ROLES } from '@/constants/roles';
import type { Member, Role } from '@/types';
import { imageFor } from '@/utils/art';
import { fileToResizedDataUrl } from '@/utils/image';
import styles from './TeamMemberRow.module.css';

interface TeamMemberRowProps {
  member: Member;
  onChange: (patch: Partial<Member>) => void;
  onRemove: () => void;
}

export function TeamMemberRow({ member, onChange, onRemove }: TeamMemberRowProps) {
  const fileId = useId();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      onChange({ img: await fileToResizedDataUrl(file) });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.member}>
      <Avatar src={imageFor(member)} />
      <input
        type="text"
        value={member.name}
        aria-label="Nombre"
        onChange={e => onChange({ name: e.target.value })}
      />
      <select
        value={member.role}
        aria-label="Rol"
        onChange={e => onChange({ role: e.target.value as Role })}
      >
        {ROLES.map(role => (
          <option key={role}>{role}</option>
        ))}
      </select>
      <label className={styles.upload} htmlFor={fileId}>
        Imagen
        <input
          id={fileId}
          type="file"
          accept="image/*"
          onChange={e => void handleFile(e.target.files?.[0])}
        />
      </label>
      <IconButton aria-label={`Quitar ${member.name}`} onClick={onRemove}>
        ✕
      </IconButton>
    </div>
  );
}
