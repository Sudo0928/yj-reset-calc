import type { InputHTMLAttributes } from 'react';

interface PixelCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function PixelCheckbox({ label, id, className = '', ...rest }: PixelCheckboxProps) {
  return (
    <label className={`pixel-checkbox ${className}`} htmlFor={id}>
      <input type="checkbox" id={id} {...rest} />
      {label && <span>{label}</span>}
    </label>
  );
}
