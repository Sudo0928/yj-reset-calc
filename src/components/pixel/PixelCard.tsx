import type { ReactNode } from 'react';

interface PixelCardProps {
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PixelCard({ title, footer, children, className = '' }: PixelCardProps) {
  return (
    <div className={`pixel-card ${className}`}>
      {title && <div className="pixel-card__header">{title}</div>}
      <div className="pixel-card__body">{children}</div>
      {footer && <div className="pixel-card__footer">{footer}</div>}
    </div>
  );
}
