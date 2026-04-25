import type { ReactNode } from 'react';

export interface SlotItem {
  icon?: string;
  label: string;
  sublabel?: string;
}

interface BaseSlotProps {
  item?: SlotItem | null;
  onSelect?: () => void;
  onRemove?: () => void;
  size?: number;
  badge?: string;
  placeholder?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function BaseSlot({
  item,
  onSelect,
  onRemove,
  size = 64,
  badge,
  placeholder,
  className = '',
  disabled = false,
}: BaseSlotProps) {
  const isEmpty = !item;

  return (
    <div
      className={`pixel-slot ${isEmpty ? 'pixel-slot--empty' : 'pixel-slot--filled'} ${className}`}
      style={{ width: size, height: size, opacity: disabled ? 0.5 : 1 }}
      onClick={!disabled ? onSelect : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) onSelect?.();
      }}
      title={item?.label ?? '슬롯 선택'}
    >
      {item ? (
        <>
          {item.icon ? (
            <img
              src={item.icon}
              alt={item.label}
              className="pixel-slot__icon"
              draggable={false}
            />
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', padding: 2 }}>
              {item.label.slice(0, 4)}
            </span>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 14,
                height: 14,
                border: '2px solid var(--color-border)',
                background: 'var(--color-danger)',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
              aria-label={`${item.label} 제거`}
            >
              ✕
            </button>
          )}
        </>
      ) : (
        (placeholder ?? null)
      )}
      {badge && <span className="pixel-slot__badge">{badge}</span>}
    </div>
  );
}
