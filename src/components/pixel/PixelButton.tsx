import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'sky' | 'yellow' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  default: '',
  primary: 'pixel-btn--primary',
  sky: 'pixel-btn--sky',
  yellow: 'pixel-btn--yellow',
  danger: 'pixel-btn--danger',
  ghost: 'pixel-btn--ghost',
};
const sizeClass: Record<Size, string> = {
  sm: 'pixel-btn--sm',
  md: '',
  lg: 'pixel-btn--lg',
};

export function PixelButton({
  variant = 'default',
  size = 'md',
  full = false,
  className = '',
  children,
  ...rest
}: PixelButtonProps) {
  const cls = [
    'pixel-btn',
    variantClass[variant],
    sizeClass[size],
    full ? 'pixel-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
