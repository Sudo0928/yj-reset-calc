import { BaseSlot, type SlotItem } from './BaseSlot';

interface CompanionSlotProps {
  index: number;
  item?: SlotItem | null;
  traitActive?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function CompanionSlot({
  index,
  item,
  traitActive,
  onSelect,
  onRemove,
  disabled,
}: CompanionSlotProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <BaseSlot
        item={item}
        onSelect={onSelect}
        onRemove={onRemove}
        disabled={disabled}
        badge={traitActive ? '활성' : undefined}
        size={60}
      />
      <span style={{ fontSize: 10, color: 'var(--color-ink-muted)', fontWeight: 700 }}>
        동료 {index + 1}
      </span>
    </div>
  );
}
