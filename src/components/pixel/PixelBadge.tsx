import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'pink' | 'sky' | 'yellow' | 'mint' | 'gold' | 'danger' | 'tbd';

interface PixelBadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  default: '',
  pink: 'pixel-badge--pink',
  sky: 'pixel-badge--sky',
  yellow: 'pixel-badge--yellow',
  mint: 'pixel-badge--mint',
  gold: 'pixel-badge--gold',
  danger: 'pixel-badge--danger',
  tbd: 'pixel-badge--tbd',
};

export function PixelBadge({ variant = 'default', children, className = '' }: PixelBadgeProps) {
  return (
    <span className={`pixel-badge ${variantClass[variant]} ${className}`}>{children}</span>
  );
}
