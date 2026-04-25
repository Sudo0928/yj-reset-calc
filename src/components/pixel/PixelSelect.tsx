import type { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface PixelSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
}

export function PixelSelect({ options, label, id, className = '', ...rest }: PixelSelectProps) {
  const el = (
    <select id={id} className={`pixel-select ${className}`} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  if (!label) return el;

  return (
    <div className="pixel-input-wrap">
      <label htmlFor={id}>{label}</label>
      {el}
    </div>
  );
}
