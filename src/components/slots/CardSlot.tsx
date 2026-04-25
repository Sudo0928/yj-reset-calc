import { BaseSlot, type SlotItem } from './BaseSlot';

interface CardSlotProps {
  index: number;
  item?: SlotItem | null;
  active?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function CardSlot({ index, item, active, onSelect, onRemove, disabled }: CardSlotProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <BaseSlot
        item={item}
        onSelect={onSelect}
        onRemove={onRemove}
        disabled={disabled}
        badge={active ? 'ON' : undefined}
        size={52}
        className={active ? '' : ''}
      />
      <span style={{ fontSize: 10, color: 'var(--color-ink-muted)', fontWeight: 700 }}>
        카드 {index + 1}
      </span>
    </div>
  );
}
