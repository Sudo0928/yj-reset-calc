import { BaseSlot, type SlotItem } from './BaseSlot';

interface SkillSlotProps {
  index: number;
  item?: SlotItem | null;
  level?: number;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function SkillSlot({ index, item, level, onSelect, onRemove, disabled }: SkillSlotProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <BaseSlot
        item={item}
        onSelect={onSelect}
        onRemove={onRemove}
        disabled={disabled}
        badge={level !== undefined ? `Lv${level}` : undefined}
        size={56}
      />
      <span style={{ fontSize: 10, color: 'var(--color-ink-muted)', fontWeight: 700 }}>
        스킬 {index + 1}
      </span>
    </div>
  );
}
