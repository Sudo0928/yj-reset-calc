import type { InputHTMLAttributes } from 'react';

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  hint?: string;
}

export function PixelInput({ label, suffix, hint, id, className = '', ...rest }: PixelInputProps) {
  const inputEl = (
    <div className="pixel-input-row">
      <input id={id} className={`pixel-input ${className}`} {...rest} />
      {suffix && <span className="pixel-input-suffix">{suffix}</span>}
    </div>
  );

  if (!label && !hint) return inputEl;

  return (
    <div className="pixel-input-wrap">
      {label && <label htmlFor={id}>{label}</label>}
      {inputEl}
      {hint && <span style={{ fontSize: 10, color: 'var(--color-ink-muted)' }}>{hint}</span>}
    </div>
  );
}
