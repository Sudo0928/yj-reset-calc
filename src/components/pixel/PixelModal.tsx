import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PixelModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export function PixelModal({ isOpen, title, onClose, footer, children }: PixelModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="pixel-modal-overlay"
      role="dialog"
      aria-modal
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pixel-modal">
        {title && (
          <div className="pixel-modal__title">
            {title}
            <button
              onClick={onClose}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--color-ink)',
              }}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        )}
        {children}
        {footer && <div className="pixel-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
