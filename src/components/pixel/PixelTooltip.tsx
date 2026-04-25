import { useState, type ReactNode } from 'react';

interface PixelTooltipProps {
  tip: string;
  children: ReactNode;
}

export function PixelTooltip({ tip, children }: PixelTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="pixel-tooltip-wrap"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && <span className="pixel-tooltip" role="tooltip">{tip}</span>}
    </span>
  );
}
