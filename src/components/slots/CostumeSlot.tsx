import { BaseSlot, type SlotItem } from './BaseSlot';

interface CostumeSlotProps {
  index: number;
  item?: SlotItem | null;
  grade?: number;
  enhance?: number;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function CostumeSlot({
  index,
  item,
  grade,
  enhance,
  onSelect,
  onRemove,
  disabled,
}: CostumeSlotProps) {
  const badge = grade !== undefined ? `${grade}★` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <BaseSlot
        item={item}
        onSelect={onSelect}
        onRemove={onRemove}
        disabled={disabled}
        badge={badge}
        size={60}
      />
      <span style={{ fontSize: 10, color: 'var(--color-ink-muted)', fontWeight: 700 }}>
        코스튬 {index + 1}
        {enhance !== undefined && enhance > 0 ? ` +${enhance}` : ''}
      </span>
    </div>
  );
}
