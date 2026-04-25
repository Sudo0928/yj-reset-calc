import { BaseSlot, type SlotItem } from './BaseSlot';

export type EquipmentType = 'weapon' | 'armor' | 'accessory';

interface EquipmentSlotProps {
  type: EquipmentType;
  item?: SlotItem | null;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

const typeLabel: Record<EquipmentType, string> = {
  weapon: '무기',
  armor: '방어구',
  accessory: '장신구',
};

export function EquipmentSlot({ type, item, onSelect, onRemove, disabled }: EquipmentSlotProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <BaseSlot
        item={item}
        onSelect={onSelect}
        onRemove={onRemove}
        disabled={disabled}
        badge={item ? undefined : undefined}
      />
      <span style={{ fontSize: 10, color: 'var(--color-ink-muted)', fontWeight: 700 }}>
        {typeLabel[type]}
      </span>
    </div>
  );
}
